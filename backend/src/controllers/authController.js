import User from '../models/User.js';
import OTP from '../models/OTP.js';
import AuditLog from '../models/AuditLog.js';
import { generateToken } from '../middleware/auth.js';
import { sendOTPEmail, generateOTP } from '../services/emailService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, role, institutionId, name, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      institutionId: role === 'institution' ? institutionId : null,
      name,
      phone
    });

    // Log audit (catch any errors to not block registration)
    try {
      await AuditLog.create({
        userId: user._id,
        action: 'CREATE',
        entity: 'User',
        entityId: user._id.toString(),
        ipAddress: req.ip
      });
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Login user (Step 1: Validate credentials)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('institutionId');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // TEMPORARILY DISABLED OTP - Direct login for all users
    // TODO: Re-enable OTP for institution users later
    
    // Generate token
    const token = generateToken(user._id);

    // Update last login (without triggering password hash)
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Log audit (catch any errors to not block login)
    try {
      await AuditLog.create({
        userId: user._id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user._id.toString(),
        ipAddress: req.ip
      });
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      requiresOTP: false,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// @desc    Verify OTP (Step 2: Complete institution login)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find the most recent OTP for this email
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check maximum attempts (3 attempts)
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`
      });
    }

    // OTP is valid - mark as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Get user details
    const user = await User.findById(otpRecord.userId).populate('institutionId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Log audit
    try {
      await AuditLog.create({
        userId: user._id,
        action: 'LOGIN_OTP_VERIFIED',
        entity: 'User',
        entityId: user._id.toString(),
        ipAddress: req.ip
      });
    } catch (auditError) {
      console.warn('Audit log failed:', auditError.message);
    }

    // Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is institution
    if (user.role !== 'institution') {
      return res.status(400).json({
        success: false,
        message: 'OTP is only required for institution users'
      });
    }

    // Rate limiting: Check recent OTP requests (max 3 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      email: user.email,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOTPs >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 1 hour.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete old OTPs
    await OTP.deleteMany({ email: user.email });

    // Create new OTP
    await OTP.create({
      email: user.email,
      otp: otp,
      userId: user._id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP via email
    try {
      await sendOTPEmail(user.email, otp, user.name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'New OTP has been sent to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend OTP'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('institutionId');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // Log audit
    await AuditLog.create({
      userId: req.user._id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: req.user._id.toString(),
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Password update failed'
    });
  }
};
