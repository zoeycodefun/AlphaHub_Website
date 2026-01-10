import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './layout_components/navigation' // 顶部导航栏
import MarketSelector from './layout_components/market_selector' // 市场选择器
import LanguageSwitcher from './layout_components/language_switcher' // 语言切换器(只有中英，考虑提前设定还是自动检测翻译)
import SearchBar from './layout_components/search_bar' // 搜索栏
import UserAccounts from './layout_components/user_accounts' // 用户账户信息(此处为账户的统一管理，整个系统的全部账户)


/*
Layout组件：固定的顶部导航（系统名称，市场选择器，导航菜单，语言切换，搜索和账户管理）和下方的内容
* 
*/
const Layout = () => {
    return (
        <div className='min-h-screen '>
            {/** 顶部导航栏固定在顶部并始终在页面顶部 */}
            <header className='fixed top-0 left-0 right-0 z-50 bg-green-50 '>
                {/** 左侧：系统名称与市场选择 */}
                <div >
                    <span>AlphaHub</span>
                    <MarketSelector />
                </div>
                {/** 中间：可滑动导航菜单 */}
                <div>
                    <Navigation/>
                </div>
                {/** 右侧：语言切换➕搜索➕账户管理 */}
                <div>
                    <LanguageSwitcher />
                    <SearchBar />
                    <UserAccounts />
                </div>
            </header>

            {/** 除了顶栏的主体区域，主要内容区域，与顶栏形成完整网页，可以向下滑动内容，为顶栏留出内容 */}
            <main>
                {/** outlet路由组件会渲染当前路由对应的页面组件 */}
                <Outlet />
            </main>

        </div>
    )
} 
export default Layout
