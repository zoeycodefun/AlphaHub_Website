// pages config interface
export interface PageConfig {
    readonly id: string;
    readonly path: string;
    readonly component: () => Promise<{ default: React.ComponentType}>;
    readonly title: string;
    readonly isComingSoon?: boolean;
    readonly requiredPermissions?: readonly string[];
}

// page config array
export const PAGE_CONFIGS: readonly PageConfig[] = [
    {
        id: 'spot_trading',
        path: '/trade_center/spot_trading',
        component: () => import('../spot_trading_page.tsx'),
        title: '现货交易',
    },
    {
        id: 'contract_trading',
        path: '/trade_center/contract_trading',
        component: () => import('../contract_trading_page'),
        title: '合约交易',
    },
    {
        id: 'hedge_trade',
        path: '/trade_center/hedge_trade',
        component: () => import('../hedge_trade_page'),
        title: '对冲交易',
    },
    {
        id: 'signals_analysis_center',
        path: '/trade_center/signals_analysis_center',
        component: () => import('../signals_analysis_center'),
        title: '信号分析中心',
    },
    {
        id: 'altcoin_position_management',
        path: '/trade_center/altcoin_position_management',
        component: () => import('../altcoin_position_management_page'),
        title: '山寨币仓位管理',
    },
    {
        id: 'new_token_sniping',
        path: '/trade_center/new_token_sniping',
        component: () => import('../new_coins_monitor_page'),
        title: '新币监控',
    },
    {
        id: 'signals_backtesting',
        path: '/trade_center/signals_backtesting',
        component: () => import('../signals_backtesting_page'),
        title: '信号回测',
    },
    {
        id: 'strategies_center',
        path: '/trade_center/strategies_center',
        component: () => import('../strategies_center_page'),
        title: '策略中心',
    },
    {
        id: 'profit_loss_analysis',
        path: '/trade_center/profit_loss_analysis',
        component: () => import('../profit_loss_analysis_page'),
        title: '盈亏分析',
    }
] as const;
