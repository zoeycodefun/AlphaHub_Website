import { useMarketSwitchStore } from "../../global_state_store/market_switch_global_state_store" // 引入市场选择的全局状态store钩子
import React, { useState, useCallback, useRef, useEffect, memo } from "react";
/**
 * 市场类型选择器：用于未来用户选择更多市场的拓展，v1版本仅支持加密资产与web3市场，未未来拓展预留其他市场类型
 * 市场类型（现有市场与待拓展市场：加密资产与web3市场（v1现有），美股，商品，外汇，指数，债务利率（待拓展））
 * 类型安全，性能优化，可访问性，点击外部关闭
 */
// 定义市场选项接口（类型安全）
interface MarketOption {
    value: string; // 市场标识
    label: string; // 市场显示标签
    enabled: boolean; // 市场是否启用
}
// 市场配置
const MARKET_OPTIONS: readonly MarketOption[] = [
    {value: 'cryptocurrency_web3', label: '加密资产与web3市场', enabled: true},
    {value: 'us_stock', label: '美股市场', enabled: false},
    {value: 'commodities', label: '商品市场', enabled: false},
    {value: 'forex', label:'外汇市场', enabled: false},
    {value: 'equity_index', label:'指数市场', enabled: false},
    {value: 'interest_rate', label:'债务利率市场', enabled: false},
] as const; // 使用as const确保数组和对象的不可变性


const MarketSelector: React.FC = memo(() => {
    const { selectedMarket, setSelectedMarket } = useMarketSwitchStore(); // 从store里面解构出当前市场选择和更新函数
    const [openMarketSwitchMenu, setOpenMarketSwitchMenu] = useState(false);
    // 下拉菜单的DOM引用，用于点击外部关闭
    const marketSwitchMenuRef = useRef<HTMLDivElement>(null);

    const currentChooseMarketLabel = MARKET_OPTIONS.find(
        (market) => market.value === selectedMarket
    )?.label || '选择市场';

    // 切换下拉菜单：使用useCallback避免重复创建函数
    const toggleMarketSwitchMenu = useCallback(() => {
        setOpenMarketSwitchMenu((prev) => !prev);
    }, []);
    const closeMarketSwitchMenu = useCallback(()=> {
        setOpenMarketSwitchMenu(false);
    }, []);
    // 处理市场选择：选择市场后更新全局状态并关闭菜单
    const handleMarketSelect = useCallback((value: string) => {
        setSelectedMarket(value)
        closeMarketSwitchMenu();
    }, [setSelectedMarket, closeMarketSwitchMenu]);
    const handleKeyboardDown = useCallback((event: React.KeyboardEvent, marketValue?: string) => {
        if (event.key === 'Escape') {
            closeMarketSwitchMenu();
        } else if (event.key === 'Enter' || event.key === ' ') {
            if (marketValue) {
                event.preventDefault();
                handleMarketSelect(marketValue);
            } else {
                toggleMarketSwitchMenu();
            }
        }
    }, [closeMarketSwitchMenu, handleMarketSelect, toggleMarketSwitchMenu]);

    useEffect(() => {
        if (!openMarketSwitchMenu) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (marketSwitchMenuRef.current && !marketSwitchMenuRef.current.contains(event.target as Node)) {
                closeMarketSwitchMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMarketSwitchMenu, closeMarketSwitchMenu]);

    return (
        <div className=""
        ref= {marketSwitchMenuRef}
        >
            <button
            onClick={toggleMarketSwitchMenu}
            onKeyDown={(event) => handleKeyboardDown(event)}
            className=""
            aria-haspopup="listbox"
            aria-expanded={openMarketSwitchMenu}
            aria-label="Select Market"
            >
                <span>{currentChooseMarketLabel}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    openMarketSwitchMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </button>
            {openMarketSwitchMenu && (
                <ul
                className=""
                role="listbox"
                >
                   {MARKET_OPTIONS.map((market) => (
                    <li
                    key={market.value}
                    onClick={() => market.enabled && handleMarketSelect(market.value)} // 禁用状态不响应点击
                    onKeyDown={(event) => market.enabled && handleKeyboardDown(event, market.value)}
                    className={`
                        px-4 py-2 cursor-pointer 
                        ${market.value === selectedMarket ? 'bg-blue-50':'text-grey-700'}
                        ${market.enabled ? 'hover:bg-grey-100':'opcity-50 cursor-not-allowed'}
                        `}
                    role="option"
                    aria-selected={market.value === selectedMarket}
                    aria-disabled={!market.enabled}

                    >
                        <div className="">
                            <span>{market.label}</span>
                            {/** 选中标记 */}
                            {market.value === selectedMarket && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {/** 禁用标记 */}
                            {!market.enabled && (
                                <span>Expect</span>
                            )}
                        </div>
                    </li>
                   ))}
                </ul>
            )}
        </div>
    );
    });
MarketSelector.displayName = 'MarketSelector'; // 调试
export default MarketSelector;

