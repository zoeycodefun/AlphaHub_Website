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

export type TimeZone = 'UTC' | 'EST' | 'CST' | 'PST' | 'GMT' | 'JST' | 'LOCAL';
// config of timezone(only read)
export const TIMEZONE_CONFIG: ReadonlyArray<{
    readonly id: TimeZone;
    readonly label: string;
    readonly description: string;
}> = [
    { id: 'UTC' as TimeZone, label: 'UTC', description: 'Coordinated Universal Time' },
    { id: 'EST' as TimeZone, label: 'EST (UTC-5)', description: 'Eastern Standard Time' },
    { id: 'CST' as TimeZone, label: 'CST (UTC-6)', description: 'Central Standard Time' },
    { id: 'PST' as TimeZone, label: 'PST (UTC-8)', description: 'Pacific Standard Time' },
    { id: 'GMT' as TimeZone, label: 'GMT (UTC+0)', description: 'Greenwich Mean Time' },
    { id: 'JST' as TimeZone, label: 'JST (UTC+9)', description: 'Japan Standard Time' },
    { id: 'LOCAL' as TimeZone, label: 'Local Time', description: 'Local Time' },
] as const;

// navigation props
export interface TradeCenterNavigationProps {
    readonly currentExchange: Exchange | null;
    readonly exchanges: readonly Exchange[];
    readonly currentTimeZone: TimeZone;
    readonly currentPage: string;
    readonly onExchangeChange: (exchange: Exchange) => void;
    readonly onTimeZoneChange: (timezone: TimeZone) => void;
    readonly onPageChange: (pageId: string) => void;
}
// type guard function
export const isVaildTimeZone = (value: string): value is TimeZone => {
    return TIMEZONE_CONFIG.some((timezone => timezone.id === value));
};
// constants definition
export const MAX_EXCHANGE_MENU_HEIGHT = 240;
export const MOBILE_MENU_MAX_HEIGHT = '80vh';
