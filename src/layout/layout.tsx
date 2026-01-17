import React, { memo } from 'react'; // 引入React和memo用于性能优化
import { Outlet } from 'react-router-dom'; // 引入Outlet用于嵌套路由渲染
import Navigation from './layout_components/navigation'; // 顶部导航栏
import MarketSelector from './layout_components/market_selector'; // 市场选择器
import LanguageSwitcher from './layout_components/language_switcher'; // 语言切换器
import SearchBar from './layout_components/search_bar'; // 搜索栏
// import UserAccounts from './layout_components/user_accounts'; // 用户账户管理


/// ‼️



/**
 * Layout组件：应用的主布局框架
 * 结构：固定顶部导航栏（系统名称、市场选择器、导航菜单、语言切换、搜索、账户管理）+ 主内容区域
 * 特点：响应式设计、固定顶栏、滚动内容区
 */
const Layout: React.FC = memo(() => { // 使用memo优化重渲染
  return (
    <div className="min-h-screen bg-gray-50"> {/* 最小高度全屏，背景色 */}
      {/* 顶部导航栏：固定在页面顶部，始终可见 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* 导航栏内容容器：最大宽度，居中，内边距 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Flex布局：左中右三部分，垂直居中 */}
          <div className="flex items-center justify-between h-16">
            
            {/* 左侧：系统名称 + 市场选择器 */}
            <div className="flex items-center space-x-4">
              {/* 系统Logo/名称 */}
              <h1 className="text-xl font-bold text-gray-900">
                AlphaHub
              </h1>
              {/* 市场选择器 */}
              <MarketSelector />
            </div>
            
            {/* 中间：导航菜单（桌面端显示，移动端隐藏） */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <Navigation />
            </div>
            
            {/* 右侧：语言切换 + 搜索 + 账户管理 */}
            <div className="flex items-center space-x-3">
              {/* 语言切换器 */}
              <LanguageSwitcher />
              {/* 搜索栏 */}
              <SearchBar />
              
              {/* 用户账户管理 */}
              {/* <UserAccounts /> */}
            </div>
          </div>
          
          {/* 移动端导航菜单（仅在小屏幕显示） */}
          <div className="md:hidden pb-3 pt-2 border-t border-gray-200">
            <Navigation />
          </div>
        </div>
      </header>

      {/* 主内容区域：为顶栏留出空间，内容可滚动 */}
      <main className="pt-16 min-h-screen"> {/* pt-16确保内容不被固定顶栏遮挡 */}
        {/* 内容容器：最大宽度，居中，内边距 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Outlet：渲染当前路由对应的页面组件 */}
          <Outlet />
        </div>
      </main>
    </div>
  );
});

Layout.displayName = 'Layout'; // 设置displayName便于调试

export default Layout;
