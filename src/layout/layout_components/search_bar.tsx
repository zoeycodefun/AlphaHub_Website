import React, {useState, useCallback, useRef, memo} from 'react'; // 引入React hooks, memo用于性能优化
import axios, {type CancelTokenSource } from 'axios'; // 引入axios用于请求与CancelToken用于取消请求

/**
 * 搜索栏组件：全局搜索的功能，全局搜索，在当前进入的界面显示搜索的东西，支持模糊匹配（智能搜索拓展）
 * 搜索结果以弹窗的形式出现，不占据主页面
 * 弹窗内有搜索栏，输入关键词后端调用模糊匹配数据库内容，搜索结果弹窗下方显示，支持滑动浏览
 */

// 定义搜索结果的接口确保类型安全
interface SearchResult {
    id: string; // 结果唯一标识符
    title: string;
    description: string;
    category: string; // 结果类别（如市场信息等）
    url?: string; // 可选的结果跳转链接
}

// 定义API响应接口
interface SearchApiResponse {
    results: SearchResult[];
    totalCount: number;
    searchQuery: string;
}

// 封装搜索逻辑以复用
const useSearch = () => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 搜索函数：useCallback减少重渲染
    const search = useCallback(async (query: string, cancelToken: CancelTokenSource) => {
        if (!query.trim()){
            setError('The search query cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            // 后端API支持请求取消
            const response = await axios.get<SearchApiResponse>('/api/search/global', {
                params: { query: query.trim()},
                cancelToken: cancelToken.token,
                timeout: 5000, // 设置请求超时时间为5秒
            });
            setResults(response.data.results); // 更新搜索结果
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Search request canceled');
                return;
            }
            console.error('Search error:', err);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    // 清空搜索状态
    const clearSearch = useCallback(() => {
        setResults([]);
        setError(null);
        setIsLoading(false);
    }, []);

    return { results, isLoading, error, search, clearSearch, setError };
};
// 搜索栏组件：类型安全，性能优化，错误处理，可取消请求，无障碍支持

const SearchBar: React.FC = memo(()=> { // 优化重渲染
    const [ showSearchWindow, setShowSearchWindow] = useState(false);
    const [ searchKeywordQuery, setSearchKeywordQuery] = useState('');
    const { results, isLoading, error, search, clearSearch, setError } = useSearch();
    const cancelTokenRef = useRef<CancelTokenSource | null>(null); // 改为useRef，初始为null
    
    const openSearchWindow = useCallback(() => {
        setShowSearchWindow(true);
        setSearchKeywordQuery('');
        clearSearch();
    }, [clearSearch]);
    const closeSearchWindow = useCallback(() => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('Search window closed by user');
        }
        setShowSearchWindow(false);
    }, []);
    const conductSearch = useCallback(() => {
        // 执行搜索以后申请新的取消令牌
        const newCancelToken = axios.CancelToken.source();
        cancelTokenRef.current = newCancelToken; // 执行新令牌引用
        search(searchKeywordQuery, newCancelToken);
    }, [searchKeywordQuery, search])
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeywordQuery(event.target.value);
        if (error) setError (null);
    }, [error]);
    const handleKeyboardDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            conductSearch();
        } else if (event.key === 'Escape') {
            closeSearchWindow();
        }
    }, [conductSearch, closeSearchWindow]);

    // 搜索处理结果点击：‼️跳转逻辑拓展
    const handleResultClick = useCallback((result: SearchResult) => {
        if (result.url) {
            window.open(result.url, '_blank');
        }
        // ‼️ 路由跳转与内容显示
    }, []);
    return (
        <>
        {/** 顶栏搜索按钮（无障碍） */}
        <button
        onClick={openSearchWindow}
        className=''
        aria-label='open global search'
        title='global search'
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
        {/** 搜索弹窗(Portal性能提升) */}
        {showSearchWindow && (
            // 遮蔽罩
            <div
            className=''
            onClick={closeSearchWindow}
            role='dialog' // 无障碍对话框角色
            aria-modal='true' // 无障碍模态对话框
            aria-labelledby='search-dialog-title'
            >
                {/** 弹窗内容区 */}
                <div
                className=''
                onClick={(event) => event.stopPropagation()} // 阻止点击冒泡关闭弹窗
                >
                    {/** 弹窗头部顶栏 */}
                    <header
                    className=''

                    >
                        <span>全局搜索</span>
                        <button
                        onClick={closeSearchWindow}
                        className=''
                        aria-label='close search window'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    {/** 搜索输入与输出区 */}
                    <div className=''>
                        <div className=''>
                            <input 
                            type="text"
                            value={searchKeywordQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyboardDown}
                            placeholder='请输入搜索关键词...'
                            className=''
                            disabled={isLoading}
                            aria-describedby={error ? 'search-error-message' : undefined}
                            autoFocus
                             />
                            <button
                            onClick={conductSearch}
                            disabled={isLoading || !searchKeywordQuery.trim()}
                            className=''
                            aria-label='execute search'
                             >
                                {isLoading ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ):'搜索'}
                             </button>
                        </div>
                        {/** 错误信息显示 */}
                        {error && (
                            <p
                            id='search-error'
                            className=''
                            role='alert'
                            >
                                {error}
                            </p>
                        )}
                    </div>
                    {/** 搜索结果显示区 */}
                    <main
                    className=''
                    >
                        {results.length > 0 ? (
                        <ul
                        className=''
                        role='listbox'

                        >
                            {results.map((result) => (
                                <li
                                key={result.id}
                                className=''
                                onClick={() => handleResultClick(result)}
                                role='option'
                                tabIndex={0}
                                onKeyDown={(event) => event.key === 'Enter' && handleResultClick(result)}
                                >
                                    {result.title}
                                    {result.description}
                                    {result.category}
                                </li>
                            ))}
                        </ul>
                    ):isLoading ? (
                        <div>
                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ):searchKeywordQuery ? (
                        <p>未找到匹配结果。</p>
                    ):(
                        <p>请输入关键词以搜索内容。</p>
                    )}

                    </main>

                </div>

            </div>
        )}
        </>
    )

}) 
SearchBar.displayName = 'SearchBar'; // 调试
export default SearchBar;