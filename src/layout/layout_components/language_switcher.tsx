// 语言切换器
import { useLanguageStore } from '../../global_state_store/language_global_state_store';

/**
 * 语言切换器：v1版本仅支持中英文语言互换，后期若产品拓展再拓展
 * 语言切换器为手动切换语言，更新全局状态，后端API根据状态返回对应的语言数据（中/英）
 */

const LanguageSwitcher = () => {
    // 当前包含语言：中文zh，英文en，默认中文
    const { currentLanguage, setCurrentLanguage } = useLanguageStore() // 获取当前的语言状态与设置函数
    // 定义支持的语言数组
    const languages = [
        {code: 'zh', label: '中文'},
        {code: 'en', label: 'English'},
    ]
    // 语言切换处理函数
    const languageToggle = () => {
        const changeLanguage = currentLanguage === 'zh' ? 'en' : 'zh' // 切换到另一种语言，计算下一种语言
        setCurrentLanguage(changeLanguage) // 通过语言设定函数更新全局状态，后端API语言切换调用时会读取状态
    }

    return (
        <button
        onClick={languageToggle} // 点击切换语言
        className=''
        >
             {/** 显示当前选中的语言标签 */}
            {languages.find(language => language.code === currentLanguage)?.label || '中文'}
        </button>
    )
}
export default LanguageSwitcher;
