import { useTheme } from '../contexts/ThemeContext';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  language,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  language: string;
}) {
  const { isDark } = useTheme();

  const placeholder = language === 'en' ? 'Search duas by name or translation...' :
    language === 'ar' ? 'ابحث عن الأدعية بالاسم أو الترجمة...' :
    language === 'ur' ? 'نام یا ترجمہ سے دعائیں تلاش کریں...' :
    language === 'fr' ? 'Rechercher des duas par nom ou traduction...' :
    language === 'tr' ? 'İsim veya çeviriye göre dua ara...' :
    language === 'id' ? 'Cari doa berdasarkan nama atau terjemahan...' :
    language === 'bn' ? 'নাম বা অনুবাদ দিয়ে দোয়া খুঁজুন...' :
    language === 'ms' ? 'Cari doa berdasarkan nama atau terjemahan...' :
    language === 'ta' ? 'பெயர் அல்லது மொழிபெயர்ப்பால் துஆக்களைத் தேடுங்கள்...' :
    'പേര് അല്ലെങ്കിൽ വിവർത്തനം അനുസരിച്ച് ദുആകൾ തിരയുക...';

  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder-gray-500' 
              : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
