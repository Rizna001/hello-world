import { useBookmarks } from '../contexts/BookmarksContext';
import { useTheme } from '../contexts/ThemeContext';

interface BookmarksViewProps {
  language: string;
  onDuaClick: (dua: any, categoryId: string) => void;
}

export default function BookmarksView({ language, onDuaClick }: BookmarksViewProps) {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarks();
  const { isDark } = useTheme();

  const labels = {
    en: { title: 'Bookmarks', empty: 'No bookmarks yet', emptyDesc: 'Bookmark duas to find them easily here', clear: 'Clear All', remove: 'Remove' },
    ar: { title: 'المفضلة', empty: 'لا توجد مفضلات بعد', emptyDesc: 'أضف أدعية إلى المفضلة للعثور عليها بسهولة هنا', clear: 'مسح الكل', remove: 'إزالة' },
    ur: { title: 'بک مارکس', empty: 'ابھی تک کوئی بک مارک نہیں', emptyDesc: 'دعائیں بک مارک کریں تاکہ یہاں آسانی سے مل سکیں', clear: 'سب صاف کریں', remove: 'ہٹائیں' },
    fr: { title: 'Signets', empty: 'Aucun signet pour le moment', emptyDesc: 'Marquez des duas pour les retrouver facilement ici', clear: 'Tout Effacer', remove: 'Supprimer' },
    tr: { title: 'Yer İmleri', empty: 'Henüz yer imi yok', emptyDesc: 'Duaları kolayca bulmak için yer imi ekleyin', clear: 'Tümünü Temizle', remove: 'Kaldır' },
    id: { title: 'Bookmark', empty: 'Belum ada bookmark', emptyDesc: 'Bookmark doa untuk menemukannya dengan mudah di sini', clear: 'Hapus Semua', remove: 'Hapus' },
    bn: { title: 'বুকমার্ক', empty: 'এখনো কোনো বুকমার্ক নেই', emptyDesc: 'এখানে সহজে খুঁজে পেতে দোয়া বুকমার্ক করুন', clear: 'সব মুছুন', remove: 'সরান' },
    ms: { title: 'Penanda', empty: 'Tiada penanda lagi', emptyDesc: 'Tandai doa untuk mencarinya dengan mudah di sini', clear: 'Kosongkan Semua', remove: 'Keluarkan' },
    ta: { title: 'புக்மார்க்குகள்', empty: 'இன்னும் புக்மார்க்குகள் இல்லை', emptyDesc: 'இங்கே எளிதாகக் கண்டுபிடிக்க துஆக்களை புக்மார்க் செய்யவும்', clear: 'அனைத்தையும் அழி', remove: 'அகற்று' },
    ml: { title: 'ബുക്ക്മാർക്കുകൾ', empty: 'ഇതുവരെ ബുക്ക്മാർക്കുകളില്ല', emptyDesc: 'ഇവിടെ എളുപ്പത്തിൽ കണ്ടെത്താൻ ദുആകൾ ബുക്ക്മാർക്ക് ചെയ്യുക', clear: 'എല്ലാം മായ്ക്കുക', remove: 'നീക്കം ചെയ്യുക' },
  };

  const label = (labels as any)[language] || labels.en;

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📑</div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {label.empty}
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label.emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📑 {label.title} ({bookmarks.length})
        </h2>
        <button
          onClick={clearAllBookmarks}
          className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
            isDark 
              ? 'bg-red-900/50 hover:bg-red-900 text-red-300' 
              : 'bg-red-50 hover:bg-red-100 text-red-600'
          }`}
        >
          {label.clear}
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
              isDark 
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onDuaClick(bookmark, bookmark.categoryId)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {bookmark.title[language] || bookmark.title.en}
                </h3>
                <p 
                  dir="rtl" 
                  className={`text-lg mb-2 font-arabic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {bookmark.arabic}
                </p>
                <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {bookmark.translation[language] || bookmark.translation.en}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {bookmark.reference}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(bookmark.id);
                }}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'hover:bg-red-900/50 text-red-400' 
                    : 'hover:bg-red-50 text-red-500'
                }`}
                title={label.remove}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
