// API Configuration
const API_CONFIG = {
  // 根据环境自动选择 API 基础 URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://nebulaart-api.onrender.com'
    : 'http://localhost:3000',
  
  // API 端点
  ENDPOINTS: {
    // 认证相关
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    
    // 用户相关
    USER_PROFILE: '/users/profile',
    USER_UPDATE: '/users/update',
    USER_FOLLOW: '/users/follow',
    USER_UNFOLLOW: '/users/unfollow',
    USER_FOLLOWERS: '/users/followers',
    USER_FOLLOWING: '/users/following',
    
    // 艺术作品相关
    ARTWORKS: '/artworks',
    ARTWORK_UPLOAD: '/artworks/upload',
    ARTWORK_LIKE: '/artworks/like',
    ARTWORK_UNLIKE: '/artworks/unlike',
    ARTWORK_COMMENTS: '/artworks/comments',
    
    // 策展相关
    CURATIONS: '/curations',
    CURATION_CREATE: '/curations/create',
    CURATION_UPDATE: '/curations/update',
    
    // 健康检查
    HEALTH: '/health',
  },
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // 请求头
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API 请求工具类
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // 设置认证 token
  setToken(token: string) {
    this.token = token;
  }

  // 清除 token
  clearToken() {
    this.token = null;
  }

  // 获取请求头
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { ...API_CONFIG.HEADERS };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        const text = await response.text();
        return text as unknown as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      // 返回一个默认值而不是抛出错误，避免前端崩溃
      if (endpoint === API_CONFIG.ENDPOINTS.HEALTH) {
        return { status: 'error', error: (error as Error).message } as unknown as T;
      }
      throw error;
    }
  }

  // GET 请求
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string }> {
    return this.get(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // 用户登录
  async login(email: string, password: string): Promise<any> {
    return this.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
  }

  // 用户注册
  async register(userData: {
    name: string;
    email: string;
    password: string;
    isArtist?: boolean;
  }): Promise<any> {
    return this.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
  }

  // 获取用户资料
  async getUserProfile(): Promise<any> {
    return this.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
  }

  // 获取艺术作品列表
  async getArtworks(page: number = 1, limit: number = 20): Promise<any> {
    return this.get(`${API_CONFIG.ENDPOINTS.ARTWORKS}?page=${page}&limit=${limit}`);
  }

  // 获取策展列表
  async getCurations(page: number = 1, limit: number = 10): Promise<any> {
    return this.get(`${API_CONFIG.ENDPOINTS.CURATIONS}?page=${page}&limit=${limit}`);
  }
}

// 创建全局 API 客户端实例
export const apiClient = new ApiClient();

// 导出配置
export { API_CONFIG };
export default apiClient;
