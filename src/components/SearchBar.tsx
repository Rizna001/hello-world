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
    <div className="flex-1 min-w-0">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-4 pr-20 py-3.5 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder-gray-500' 
              : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center text-sm ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
