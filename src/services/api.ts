import {
  Car,
  Winner,
  EngineResponse,
  DriveResponse,
  ApiResponse,
  PaginationParams,
  EngineStatus,
  WinnersSortBy,
  SortOrder,
} from '../types';
import { API_BASE_URL, ENDPOINTS } from '../components/constants';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const totalCount = response.headers.get('X-Total-Count');

    return {
      data,
      totalCount: totalCount ? parseInt(totalCount, 10) : undefined,
    };
  }

  // Garage API methods
  async getCars(params?: PaginationParams): Promise<ApiResponse<Car[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('_page', params.page.toString());
    if (params?.limit) queryParams.append('_limit', params.limit.toString());

    const endpoint = `${ENDPOINTS.GARAGE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<Car[]>(endpoint);
  }

  async getCar(id: number): Promise<ApiResponse<Car>> {
    return this.request<Car>(`${ENDPOINTS.GARAGE}/${id}`);
  }

  async createCar(car: Omit<Car, 'id'>): Promise<ApiResponse<Car>> {
    return this.request<Car>(ENDPOINTS.GARAGE, {
      method: 'POST',
      body: JSON.stringify(car),
    });
  }

  async updateCar(id: number, car: Omit<Car, 'id'>): Promise<ApiResponse<Car>> {
    return this.request<Car>(`${ENDPOINTS.GARAGE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
    });
  }

  async deleteCar(id: number): Promise<ApiResponse<Record<string, never>>> {
    return this.request<Record<string, never>>(`${ENDPOINTS.GARAGE}/${id}`, {
      method: 'DELETE',
    });
  }

  // Engine API methods
  async startStopEngine(
    id: number,
    status: EngineStatus.STARTED | EngineStatus.STOPPED
  ): Promise<ApiResponse<EngineResponse>> {
    const queryParams = new URLSearchParams({
      id: id.toString(),
      status,
    });

    return this.request<EngineResponse>(`${ENDPOINTS.ENGINE}?${queryParams.toString()}`, {
      method: 'PATCH',
    });
  }

  async switchToDriveMode(id: number): Promise<ApiResponse<DriveResponse>> {
    const queryParams = new URLSearchParams({
      id: id.toString(),
      status: EngineStatus.DRIVE,
    });

    return this.request<DriveResponse>(`${ENDPOINTS.ENGINE}?${queryParams.toString()}`, {
      method: 'PATCH',
    });
  }

  // Winners API methods
  async getWinners(params?: {
    page?: number;
    limit?: number;
    sort?: WinnersSortBy;
    order?: SortOrder;
  }): Promise<ApiResponse<Winner[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('_page', params.page.toString());
    if (params?.limit) queryParams.append('_limit', params.limit.toString());
    if (params?.sort) queryParams.append('_sort', params.sort);
    if (params?.order) queryParams.append('_order', params.order);

    const endpoint = `${ENDPOINTS.WINNERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<Winner[]>(endpoint);
  }

  async getWinner(id: number): Promise<ApiResponse<Winner>> {
    return this.request<Winner>(`${ENDPOINTS.WINNERS}/${id}`);
  }

  async createWinner(winner: Winner): Promise<ApiResponse<Winner>> {
    return this.request<Winner>(ENDPOINTS.WINNERS, {
      method: 'POST',
      body: JSON.stringify(winner),
    });
  }

  async updateWinner(id: number, winner: Omit<Winner, 'id'>): Promise<ApiResponse<Winner>> {
    return this.request<Winner>(`${ENDPOINTS.WINNERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(winner),
    });
  }

  async deleteWinner(id: number): Promise<ApiResponse<Record<string, never>>> {
    return this.request<Record<string, never>>(`${ENDPOINTS.WINNERS}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
