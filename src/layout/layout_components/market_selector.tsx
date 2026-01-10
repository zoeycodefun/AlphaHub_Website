import { useMarketSwitchStore } from "../../global_state_store/market_switch_global_state_store" // 引入市场选择的全局状态store钩子
import { useState } from "react"; // 用户状态管理
/**
 * 市场类型选择器：用于未来用户选择更多市场的拓展，v1版本仅支持加密资产与web3市场，未未来拓展预留其他市场类型
 * 市场类型（现有市场与待拓展市场：加密资产与web3市场（v1现有），美股，商品，外汇，指数，债务利率（待拓展））
 */

const MarketSelector = () => {
    // 当前选中的市场状态设定
    const { selectedMarket, setSelectedMarket } = useMarketSwitchStore(); // 从store里面解构出当前市场选择和更新函数
    // 非原生select下拉菜单，自建下拉菜单的状态管理
    const [openMarketSwitchMenu, setOpenMarketSwitchMenu] = useState(false); // 控制下拉菜单的状态

    // 目前支持的和待拓展的市场类型
    // 定义市场选项数组，每个对象的value用于状态以及每个对象的label用于展示文本
    const markets = [
        {value: 'cryptocurrency_web3', label: '加密资产与web3市场'},
        {value: 'us_stock', label: '美股市场'},
        {value: 'commodities', label: '商品市场'},
        {value: 'forex', label:'外汇市场'},
        {value: 'equity_index', label:'指数市场'},
        {value: 'interest_rate', label:'债务利率市场'},
    ];
    // 获取当前选中的市场标签
    const currentChooseMarketLabel = markets.find(market => market.label === selectedMarket)?.label || '选择市场';

        return (
            // 市场选择器按钮与下拉菜单
            <div>
                {/** 市场选择器按钮：点击展开收起 */}
                <button
                onClick={() => setOpenMarketSwitchMenu(!open)}
                className="border text-black"
                >
                    {currentChooseMarketLabel}
                    <svg className={`ml-2 h-4 w-4 transition-transform ${openMarketSwitchMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                </button>
                {/** 下拉菜单选择试产：展开时显示菜单 */}
                {openMarketSwitchMenu && (
                    <div>
                        {markets.map((market) => (
                            <button 
                            key={market.value}
                            onClick={() => {
                                setSelectedMarket(market.value); // 选择市场更新全局状态
                                setOpenMarketSwitchMenu(false); // 关闭下拉菜单
                            }}
                            className=""
                            >
                                {market.label}
                            </button>
                        ))}
                    </div>
                )}

            </div>
    );
};
export default MarketSelector;