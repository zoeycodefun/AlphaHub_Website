import React, { useState, useCallback, memo, useMemo } from 'react';
import { ChevronDown, Clock, Settings, X } from 'lucide-react';
import { 
    type TradeCenterNavigationProps, 
    type Exchange, 
    type NavigationItem, 
    type TimeZone,
    TIMEZONE_CONFIG,
    MAX_EXCHANGE_MENU_HEIGHT,
    MOBILE_MENU_MAX_HEIGHT,
} from '../page_type/trade_center_navigation_type';

// trade center navigation component
const TradeCenterNavigation: React.FC<TradeCenterNavigationProps> = memo(({
    currentExchange,
    exchanges,
    currentTimeZone,
    currentPage,
    onExchangeChange,
    onTimeZoneChange,
    onPageChange,
}) => {
    // status management
    const [isExchangeMenuOpen, setIsExchangeMenuOpen] = useState(false);
    const [isTimeZoneMenuOpen, setIsTimeZoneMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    
    // navigation config(memoization to avoid redundant computations)
    const navigationItems: NavigationItem[] = [
        // home page is spot trading(contract trading)
        {
            id: 'spot_trading',
            label: '现货交易',
            isActive: currentPage === 'spot_trading',
        },
        {
            id: 'contract_trading',
            label: '合约交易',
            isActive: currentPage === 'contract_trading',
        },
        {
            id: 'hedge_trade',
            label: '对冲交易',
            isActive: currentPage === 'hedge_trade',
        },
        {
            id: 'signals_analysis_center',
            label: '信号分析中心',
            isActive: currentPage === 'signals_analysis_center',
        },
        {
            id: 'position_management',
            label: '持仓管理',
            isActive: currentPage === 'position_management',
        },
        {
            id: 'new_token_sniping',
            label: '新币狙击',
            isActive: currentPage === 'new_token_sniping',
        },
        {
            id: 'signals_backtesting',
            label: '信号回测',
            isActive: currentPage === 'signals_backtesting',
        },
        {
            id: 'strategies_center',
            label: '策略中心',
            isActive: currentPage === 'strategies_center',
        },
        {
            id: 'profit_loss_analysis',
            label: '盈亏分析',
            isActive: currentPage === 'profit_loss_analysis',
        },
    ];
    // ‼️exchange shift(according to the account management in the main guide)
    const handleExchangeChange = useCallback((exchange: Exchange) => {
        onExchangeChange(exchange);
        setIsExchangeMenuOpen(false);
    }, [onExchangeChange]);
    // timezone shift
    const handleTimeZoneChange = useCallback((timeZone: TimeZone) => {
        onTimeZoneChange(timeZone);
        setIsTimeZoneMenuOpen(false);
    }, [onTimeZoneChange]);
    // page shift
    const handlePageChange = useCallback((pageId: string) => {
        if (!navigationItems.find(item => item.id === pageId)?.isComingSoon) {
            onPageChange(pageId);
        }
    }, [onPageChange, navigationItems]);
    // ‼️format balance display
    const formatBalance = (balance: number): string => {
        if (balance >= 1000000) {
            return `${(balance/1000000).toFixed(1)}M`;
        } else if (balance >= 1000) {
            return `${(balance/1000).toFixed(1)}K`;
        } return balance.toFixed(2);
    };

    return (
        <div className=''>
            
        </div>


    )



})