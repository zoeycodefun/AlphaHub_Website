// 导航菜单组件
import { Link, useLocation } from 'react-router-dom'; // link用于跳转路由，uselocation用于获取当前的路径
import React, { memo, useMemo } from 'react';

/**
 * 
 * 导航组件：顶栏的可滑动导航组件，选中的导航文字高亮，横向滚动
 * v1导航内容：首页Dashboard，市场信息，投研，交易中心
 */
// 导航项类型接口
interface NavigationItem {
    path: string;
    label: string;
    icon?: string;
}

const Navigation: React.FC = memo(() => {
    const currentLocation = useLocation();
    const navigationItems: readonly NavigationItem[] = useMemo(() => [
        { path: '/' , label: '首页Dashboard' },
        { path: 'market_info', label: '市场信息' },
        { path:'investment_research', label:'投研'},
        { path:'/trading_center', label:'交易中心'}
    ], []);
    return (
        <nav
        className=''
        role='navigation'
        aria-label='主导航菜单'
        >
            {navigationItems.map((item) => {
                const isActive = currentLocation.pathname === item.path ||
                (item.path === '/' && currentLocation.pathname === '/');
                return (
                    <Link
                    key={item.path}
                    to={item.path}
                    className={`
                        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100 '}
                        `}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                    >
                        <span>
                            {item.label}
                        </span>
                        {/** 激活指示器-伪类 */}
                        {isActive && (
                            <div
                            className=''
                            ></div>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
});
Navigation.displayName = 'Navigation'; // 调试
export default Navigation;
