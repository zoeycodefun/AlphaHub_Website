/** 
 *  API service interface for accounts management
 * responsible for the seal of accounts management related API calls, including CEX and DEX accounts
 * using axios instance for HTTP requests, handleing all JWT token authentication and error handling in one place
 * appointment: all API key& API secret transmission only through HTTPS, do not log sensitive inforamtion
 * response structure standardalized with backend as { success, message, data, timestamp }
*/
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
interface BaseResponse {
    success: boolean;
    message: string;
    timestamp: string;
}
interface DataResponse<T> extends BaseResponse {
    data?: T;
}
// CEX accounts types and request(response to CreateCexAccountDto)
export interface CreateCexAccountPayload {
    exchange: string;
    accountType: 'spot' | 'futures';
    accountEnvironment: 'live' | 'test' | 'demo';
    accountName: string;
    apiKey: string;
    apiSecret: string;
    apiPassphrase?: string;
    permissions?: string[];
    allowTrade?: boolean;
    allowWithdraw?: boolean;
    allowTransfer?: boolean;
}
// update CEX account request payload
export interface UpdateCexAccountPayload {
    accountName?: string;
    apiKey?: string;
    apiSecret?: string;
    apiPassphrase?: string;
    permissions?: string[];
    allowTrade?: boolean;
    allowWithdraw?: boolean;
    allowTransfer?: boolean;
}
// CEX account information returned from backend(from CexAccountResponseDto), the API Secret will not be returned, only apiKeyMasked
export interface CexAccountResponse {
    id: number;
    userId: string;
    exchange: string;
    exchangeDisplayName: string;
    accountType: string;
    accountEnvironment: string;
    accountName: string;
    // ‼️
    otherAccountName: string;
    permissions: string[];
    allowTrade: boolean;
    allowWithdraw: boolean;
    allowTransfer: boolean;
    status: string;
    enabled: boolean;
    // ‼️
    apiKeyMasked?: string;
    lastConnectedAt?: string;
    createdAt: string;
    updatedAt: string;
}
// CEX accounts list response(including pagination info)
export interface CexAccountListResponse {
    items: CexAccountResponse[];
    total: number;
    page: number;
    limit: number;
}
// DEX accounts types and request(response to CreateDexAccountDto)
export interface CreateDexAccountPayload {
    blockchainWebsiteId: number;
    walletAddress: string;
    walletType: 'metamask' | 'okx' | 'trustwallet' | 'coinbasewallet' | 'phantomwallet' | 'other';
    walletProvider: string;
    walletClientVersion?: string;
    dexPlatform?: 'hyperliquid' | 'uniswap' | 'sushiswap' | 'pancakeswap' | '1inch' | 'other';
    dexPlatformVersion?: string;
    permissions?: string[];
    allowTrade?: boolean;
    allowLiquidity?: boolean;
    allowStake?: boolean;
}
// update DEX account request payload
export interface UpdateDexAccountPayload {
    walletAddress?: string;
    walletProvider?: string;
    dexPlatform?: string;
    permissions?: string[];
    allowTrade?: boolean;
    allowLiquidity?: boolean;
    allowStake?: boolean;
}
// DEX account information returned from backend(from DexAccountResponseDto)
export interface DexAccountResponse {
    id: number;
    userId: string;
    blockchainWebsiteId: number;
    blockchainWebsiteName: string;
    blockchainWebsiteDisplayName: string;
    websiteType: string;
    walletAddress: string;
    walletType: string;
    walletProvider: string;
    dexPlatform?:string;
    permissions: string[];
    allowTrade: boolean;
    status: string;
    enabled: boolean;
    lastConnectedAt?: string;
    createdAt: string;
    updatedAt: string;
}
// DEX accounts list response(including pagination info)
export interface DexAccountListResponse {
    items: DexAccountResponse[];
    total: number;
    page: number;
    limit: number;
}
// AccountApiService service class definition
class AccountApiService {
    private http: AxiosInstance;
    constructor() {
        /**
         * create a specific axios instance
         * baseURL get Vite environment variable VITE_API_BASE_URL from Vite config
         * return http://localhost:3000 in local development
         */
        this.http = axios.create({
            baseURL: (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
            timeout: 15_000, // 15 seconds timeout for all requests
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // requests interceptor to add JWT token from localStorage to Authorization header
        this.http.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        // response interceptor to handle errors globally
        this.http.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // 401 is unauthorized, token might be expired or invalid, handle it globally by removing token and redirecting to login page
                    localStorage.removeItem('auth_token');
                    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                }
                return Promise.reject(error);
            }
        );
    }
    // CEX accounts interface
    // create CEX account---POST/cex-accounts
    async createCexAccount(payload: CreateCexAccountPayload): Promise<CexAccountResponse> {
        const response: AxiosResponse<DataResponse<CexAccountResponse>> = 
        await this.http.post('/cex-accounts', payload);
        return response.data.data!;
    }
    // get CEX accounts list with pagination---GET/cex-accounts
    async getCexAccounts(
        params?: { page?: number; limit?: number; exchange?: string }
    ): Promise<CexAccountListResponse> {
        const response: AxiosResponse<DataResponse<CexAccountListResponse>> = 
        await this.http.get('/cex-accounts', { params });
        return response.data.data!;
    }
    // get CEX account details---GET/cex-accounts/:id
    async getCexAccountById(id: number): Promise<CexAccountResponse> {
        const response: AxiosResponse<DataResponse<CexAccountResponse>> = 
        await this.http.get(`/cex-accounts/${id}`);
        return response.data.data!;
    }
    // update CEX account---PUT/cex-accounts/:id
    async updateCexAccount(
        id: number,
        payload: UpdateCexAccountPayload
    ): Promise<CexAccountResponse> {
        const response: AxiosResponse<DataResponse<CexAccountResponse>> = 
        await this.http.put(`/cex-accounts/${id}`, payload);
        return response.data.data!;
    }
    // soft delete CEX account---DELETE/cex-accounts/:id
    async deleteCexAccount(
        id: number
    ): Promise<void> {
        await this.http.delete(`/cex-accounts/${id}`);
    }
    // CEX accounts connection test---POST/cex-accounts/:id/connection-test
    async testCexAccountConnection(
        id: number
    ): Promise<{ success: boolean; latencyMs?: number; errorMessage?: string }> {
        const response = await this.http.post(`/cex-accounts/${id}/test-connection`);
        return response.data.data ?? response.data;
    }
    
    // DEX accounts interface
    // create DEX account---POST/dex-accounts
    async createDexAccount(payload: CreateDexAccountPayload): Promise<DexAccountResponse> {
        const response: AxiosResponse<DataResponse<DexAccountResponse>> =
        await this.http.post('/dex-accounts', payload);
        return response.data.data!;
    }
    // get DEX accounts list with pagination---GET/dex-accounts
    async getDexAccounts(
        params?: { page?: number; limit?: number }
    ): Promise<DexAccountListResponse> {
        const response: AxiosResponse<DataResponse<DexAccountListResponse>> =
        await this.http.get('/dex-accounts', { params });
        return response.data.data!;
    }
    // get DEX account details---GET/dex-accounts/:id
    async getDexAccountById(id: number): Promise<DexAccountResponse> {
        const response: AxiosResponse<DataResponse<DexAccountResponse>> =
        await this.http.get(`/dex-accounts/${id}`);
        return response.data.data!;
    }
    // update DEX account---PUT/dex-accounts/:id
    async updateDexAccount(
        id: number,
        payload: UpdateDexAccountPayload
    ): Promise<DexAccountResponse> {
        const response: AxiosResponse<DataResponse<DexAccountResponse>> =
        await this.http.put(`/dex-accounts/${id}`, payload);
        return response.data.data!;
    }
    // soft delete DEX account---DELETE/dex-accounts/:id
    async deleteDexAccount(
        id: number
    ): Promise<void> {
        await this.http.delete(`/dex-accounts/${id}`);
    }
    // DEX accounts connection test---POST/dex-accounts/:id/connection-test
    async testDexAccountConnection(
        id: number
    ): Promise<{ success: boolean; errorMessage: string }> {
        const response = await this.http.post(`/dex-accounts/${id}/test-connection`);
        return response.data.data ?? response.data;
    }
}
export const accountApiService = new AccountApiService();
