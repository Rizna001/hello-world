import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, Home, Languages } from 'lucide-react';

export default function Header({
  language,
  languages,
  showLanguageMenu,
  setShowLanguageMenu,
  setLanguage,
  currentLanguage,
  onHomeClick,
  viewMode,
  setViewMode,
  bookmarksCount,
}: {
  language: string;
  languages: { code: string; name: string }[];
  showLanguageMenu: boolean;
  setShowLanguageMenu: (v: boolean) => void;
  setLanguage: (code: any) => void;
  currentLanguage: { code: string; name: string };
  onHomeClick: () => void;
  viewMode: 'categories' | 'bookmarks';
  setViewMode: (mode: 'categories' | 'bookmarks') => void;
  bookmarksCount: number;
}) {
  const { isDark, theme, toggleTheme } = useTheme();

  const title = language === 'en' ? 'Duas Collection' :
    language === 'ar' ? 'مجموعة الأدعية' :
    language === 'ur' ? 'مجموعہ دعائیں' :
    language === 'fr' ? 'Collection de Duas' :
    language === 'tr' ? 'Dua Koleksiyonu' :
    language === 'id' ? 'Koleksi Doa' :
    language === 'bn' ? 'দোয়া সংকলন' :
    language === 'ms' ? 'Koleksi Doa' :
    language === 'ta' ? 'துஆ தொகுப்பு' :
    'ദുആ ശേഖരം';

  const subtitle = language === 'en' ? 'Authentic supplications for every occasion' :
    language === 'ar' ? 'أدعية صحيحة لكل مناسبة' :
    language === 'ur' ? 'ہر موقع کے لیے مستند دعائیں' :
    language === 'fr' ? 'Invocations authentiques pour chaque occasion' :
    language === 'tr' ? 'Her durum için sahih dualar' :
    language === 'id' ? 'Doa-doa shahih untuk setiap keadaan' :
    language === 'bn' ? 'প্রতিটি উপলক্ষ্যের জন্য সহীহ দোয়া' :
    language === 'ms' ? 'Doa-doa sahih untuk setiap keadaan' :
    language === 'ta' ? 'ஒவ்வொரு சந்தர்ப்பத்திற்கும் நம்பகமான பிரார்த்தனைகள்' :
    'ഓരോ സന്ദർഭത്തിനുമുള്ള ആധികാരികമായ പ്രാർത്ഥനകൾ';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b border-t-2 border-amber-400/80 shadow-sm transition-colors ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h1 className={`truncate text-sm sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
              <p className={`hidden sm:block text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className={`hidden sm:flex items-center rounded-lg p-1 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('categories')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'categories'
                    ? isDark ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 shadow-sm'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'en' ? 'Categories' : language === 'ar' ? 'الفئات' : language === 'ur' ? 'زمرہ جات' : language === 'fr' ? 'Catégories' : language === 'tr' ? 'Kategoriler' : language === 'id' ? 'Kategori' : language === 'bn' ? 'বিভাগ' : language === 'ms' ? 'Kategori' : language === 'ta' ? 'வகைகள்' : 'വിഭാഗങ്ങൾ'}
              </button>
              <button
                onClick={() => setViewMode('bookmarks')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  viewMode === 'bookmarks'
                    ? isDark ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 shadow-sm'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'en' ? 'Saved' : language === 'ar' ? 'المحفوظة' : language === 'ur' ? 'محفوظ' : language === 'fr' ? 'Enregistrés' : language === 'tr' ? 'Kaydedilen' : language === 'id' ? 'Tersimpan' : language === 'bn' ? 'সংরক্ষিত' : language === 'ms' ? 'Disimpan' : language === 'ta' ? 'சேமிக்கப்பட்டவை' : 'സേവ് ചെയ്തവ'}
                {bookmarksCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    viewMode === 'bookmarks'
                      ? 'bg-emerald-100 text-emerald-700'
                      : isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {bookmarksCount}
                  </span>
                )}
              </button>
            </div>

            {/* Theme Toggle: light -> sepia -> dark */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={`Theme: ${theme} (click to change)`}
              aria-label={`Theme: ${theme}. Click to switch theme`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : theme === 'sepia' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25v13.5M12 6.25C10.5 5 8.2 4.5 4.5 4.5v13.2c3.7 0 6 .5 7.5 2.05 1.5-1.55 3.8-2.05 7.5-2.05V4.5c-3.7 0-6 .5-7.5 1.75z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Home Button */}
            <button
              onClick={onHomeClick}
              aria-label="Home"
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Home"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <svg className="hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                aria-haspopup="menu"
                aria-expanded={showLanguageMenu}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <Languages className={`w-4 h-4 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`} aria-hidden="true" />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{currentLanguage.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageMenu ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" />
              </button>

              {showLanguageMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-2 z-50 max-h-80 overflow-y-auto ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
                  }`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          language === lang.code 
                            ? isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                            : isDark ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
