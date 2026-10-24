import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  Institution,
  FdrRecord,
  ReleaseRequest,
  ChecklistItem,
  AppNotification
} from '../types';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aicte_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string }>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('aicte_token');
      localStorage.removeItem('aicte_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Response Type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    role: string;
    institutionId?: string;
    name: string;
    phone?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },
};

// ============================================================================
// INSTITUTIONS API
// ============================================================================

export const institutionsAPI = {
  getAll: async (params?: { region?: string; category?: string; search?: string }) => {
    const response = await apiClient.get<ApiResponse<Institution[]>>('/institutions', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Institution>>(`/institutions/${id}`);
    return response.data;
  },

  create: async (data: Partial<Institution>) => {
    const response = await apiClient.post<ApiResponse<Institution>>('/institutions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Institution>) => {
    const response = await apiClient.put<ApiResponse<Institution>>(`/institutions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/institutions/${id}`);
    return response.data;
  },
};

// ============================================================================
// FDRs API
// ============================================================================

export const fdrsAPI = {
  getAll: async (params?: { status?: string; institutionId?: string; maturingSoon?: boolean }) => {
    const response = await apiClient.get<ApiResponse<FdrRecord[]>>('/fdrs', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<FdrRecord>>(`/fdrs/${id}`);
    return response.data;
  },

  create: async (data: Partial<FdrRecord>) => {
    const response = await apiClient.post<ApiResponse<FdrRecord>>('/fdrs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<FdrRecord>) => {
    const response = await apiClient.put<ApiResponse<FdrRecord>>(`/fdrs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/fdrs/${id}`);
    return response.data;
  },

  uploadDocument: async (id: string, formData: FormData) => {
    const response = await apiClient.post<ApiResponse<FdrRecord>>(`/fdrs/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getByInstitution: async (institutionId: string) => {
    const response = await apiClient.get<ApiResponse<FdrRecord[]>>(`/fdrs/institution/${institutionId}`);
    return response.data;
  },
};

// ============================================================================
// RELEASE REQUESTS API
// ============================================================================

export const requestsAPI = {
  getAll: async (params?: { status?: string; priority?: string; institutionId?: string }) => {
    const response = await apiClient.get<ApiResponse<ReleaseRequest[]>>('/requests', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ReleaseRequest>>(`/requests/${id}`);
    return response.data;
  },

  create: async (data: Partial<ReleaseRequest>) => {
    const response = await apiClient.post<ApiResponse<ReleaseRequest>>('/requests', data);
    return response.data;
  },

  updateStatus: async (id: string, data: { status?: string; currentStage?: string; nextResponsibleDesk?: string; stages?: any[] }) => {
    const response = await apiClient.patch<ApiResponse<ReleaseRequest>>(`/requests/${id}/status`, data);
    return response.data;
  },

  addClarification: async (id: string, data: { role?: string; text: string }) => {
    const response = await apiClient.post<ApiResponse<ReleaseRequest>>(`/requests/${id}/clarification`, data);
    return response.data;
  },

  grantClearance: async (id: string, data: { role?: string; text: string; status?: string; currentStage?: string; stages?: any[] }) => {
    const response = await apiClient.post<ApiResponse<ReleaseRequest>>(`/requests/${id}/clearance`, data);
    return response.data;
  },

  executeDecision: async (id: string, data: { outcomeType: 'noc' | 'rtgs' | 'withhold'; memo: string; stages?: any[] }) => {
    const response = await apiClient.post<ApiResponse<ReleaseRequest>>(`/requests/${id}/decision`, data);
    return response.data;
  },

  getPrioritized: async () => {
    const response = await apiClient.get<ApiResponse<ReleaseRequest[]>>('/requests/priority/list');
    return response.data;
  },
};

// ============================================================================
// DASHBOARD API
// ============================================================================

export const dashboardAPI = {
  getInstitutionDashboard: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/dashboard/institution/${id}`);
    return response.data;
  },

  getCouncilDashboard: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/council');
    return response.data;
  },

  getFDRAnalytics: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/analytics/fdrs');
    return response.data;
  },

  getRequestAnalytics: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/analytics/requests');
    return response.data;
  },

  getChecklist: async (institutionId: string) => {
    const response = await apiClient.get<ApiResponse<ChecklistItem[]>>(`/dashboard/checklist/${institutionId}`);
    return response.data;
  },

  createChecklistItem: async (data: Partial<ChecklistItem>) => {
    const response = await apiClient.post<ApiResponse<ChecklistItem>>('/dashboard/checklist', data);
    return response.data;
  },

  updateChecklistItem: async (id: string, data: Partial<ChecklistItem>) => {
    const response = await apiClient.put<ApiResponse<ChecklistItem>>(`/dashboard/checklist/${id}`, data);
    return response.data;
  },

  getNotifications: async (unreadOnly?: boolean) => {
    const response = await apiClient.get<ApiResponse<AppNotification[]>>('/dashboard/notifications', {
      params: { unreadOnly },
    });
    return response.data;
  },

  markNotificationRead: async (id: string) => {
    const response = await apiClient.patch<ApiResponse<AppNotification>>(`/dashboard/notifications/${id}/read`);
    return response.data;
  },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthCheck = async () => {
  const response = await apiClient.get<{ success: boolean; message: string; timestamp: string }>('/health');
  return response.data;
};

export default apiClient;
