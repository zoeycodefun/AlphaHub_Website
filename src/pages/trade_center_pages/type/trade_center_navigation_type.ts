// trade center navigation types
export interface Exchange {
    readonly id: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly balance: {
        readonly total: number;
        readonly available: number;
        readonly currency: string;
    };
}

export interface NavigationItem {
    readonly id: string;
    readonly label: string;
    readonly badge?: string;
    readonly isActive: boolean;
    readonly isComingSoon?: boolean;
}

// timezone types and utilities
export type TimeZone = 'UTC' | 'EST' | 'CST' | 'PST' | 'GMT' | 'JST' | 'LOCAL' | 'HKT' | 'KST' | 'ICT' | 'SGT' | 'AEDT' | 'NZDT';

// timezone config
export const TIMEZONE_CONFIG: ReadonlyArray<{
    readonly id: TimeZone;
    readonly label: string;
    readonly country: string;
    readonly offset: number;
    readonly description: string;
}> = [
    { id: 'UTC', label: 'UTC', country: 'International', offset: 0, description: 'Coordinated Universal Time' },
    { id: 'EST', label: 'Eastern Standard Time', country: 'United States', offset: -5, description: 'Eastern Standard Time' },
    { id: 'CST', label: 'Central Standard Time', country: 'United States', offset: -6, description: 'Central Standard Time' },
    { id: 'PST', label: 'Pacific Standard Time', country: 'United States', offset: -8, description: 'Pacific Standard Time' },
    { id: 'GMT', label: 'Greenwich Mean Time', country: 'United Kingdom', offset: 0, description: 'Greenwich Mean Time' },
    { id: 'JST', label: 'Japan Standard Time', country: 'Japan', offset: 9, description: 'Japan Standard Time' },
    { id: 'HKT', label: 'Hong Kong Time', country: 'Hong Kong SAR', offset: 8, description: 'Hong Kong Time' },
    { id: 'KST', label: 'Korea Standard Time', country: 'South Korea', offset: 9, description: 'Korea Standard Time' },
    { id: 'ICT', label: 'Indochina Time', country: 'Thailand', offset: 7, description: 'Indochina Time' },
    { id: 'SGT', label: 'Singapore Time', country: 'Singapore', offset: 8, description: 'Singapore Time' },
    { id: 'AEDT', label: 'Australian Eastern Daylight Time', country: 'Australia', offset: 10, description: 'Australian Eastern Daylight Time' },
    { id: 'NZDT', label: 'New Zealand Daylight Time', country: 'New Zealand', offset: 12, description: 'New Zealand Daylight Time' },
    { id: 'LOCAL', label: 'Local Time', country: 'Local', offset: new Date().getTimezoneOffset() / -60, description: 'Local Time' },
] as const;

// get current time in specified timezone (including seconds)
export const getCurrentTimeInTimeZone = (timezoneId: TimeZone): string => {
    const config = TIMEZONE_CONFIG.find(timezone => timezone.id === timezoneId);
    if (!config) return '';

    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const targetTime = new Date(utcTime + (config.offset * 3600000));

    return targetTime.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// navigation props interface
export interface TradeCenterNavigationProps {
    readonly currentExchange: Exchange | null;
    readonly exchanges: readonly Exchange[];
    readonly currentTimeZone: TimeZone;
    readonly currentPage: string;
    readonly onExchangeChange: (exchange: Exchange) => void;
    readonly onTimeZoneChange: (timezone: TimeZone) => void;
    readonly onPageChange: (pageId: string) => void;
}


// trade center status type interface
export interface TradeCenterState {
    readonly currentExchange: Exchange | null;
    readonly currentTimeZone: TimeZone;
    readonly currentPage: string;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly userPermissions: readonly string[];
    
}

// type guard function
export const isValidTimeZone = (value: string): value is TimeZone => {
    return TIMEZONE_CONFIG.some(timezone => timezone.id === value);
};

// constant definitions
export const MAX_EXCHANGE_MENU_HEIGHT = 240;
export const MOBILE_MENU_MAX_HEIGHT = '80vh';
export const NAVIGATION_HEIGHT = 64; // navigation bar height (px)