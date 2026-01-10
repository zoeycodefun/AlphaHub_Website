// 导航菜单组件
import { Link, useLocation } from 'react-router-dom'; // link用于跳转路由，uselocation用于获取当前的路径

/**
 * 
 * 导航组件：顶栏的可滑动导航组件，选中的导航文字高亮，横向滚动
 * v1导航内容：首页Dashboard，市场信息，投研，交易中心
 */
const Navigation = () => {
    // 获取当前的路由并高亮
    const location = useLocation();
    // 导航的菜单配置
    const navigationItems = [
        { path: '/' , label: '首页Dashboard' },
        { path: 'market_info', label: '市场信息' },
        { path:'investment_research', label:'投研'},
        { path:'/trading_center', label:'交易中心'}
    ]
    return (
        <nav >
            {navigationItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                // 根据当前路径选中的导航高亮
                className={`whitespace-nowrap transition-colors 
                    ${location.pathname === item.path ? 
                        // 选中激活状态的样式
                    'text-blue-600 font-bold' : 
                    // 非选中未激活样式与悬浮样式
                    'text-gray-600 hover:text-blue-400'
                    }`}
                >
                    {/** 导航文字 */}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};
export default Navigation;