import React, {useState} from 'react';
/**
 * 搜索栏组件：全局搜索的功能，全局搜索，在当前进入的界面显示搜索的东西，支持模糊匹配（智能搜索拓展）
 */
const SearchBar: React.FC = () => {
    // 搜索关键词状态
    const [searchKeywordQuery, setSearchKeywordQuery] = useState('')
    // 处理搜索的提交
    const handleSearchSubmit = (event: React.FormEvent) => {
        
    }
}