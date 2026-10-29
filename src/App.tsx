import { useState, useMemo } from 'react';
import duasData from './data/allData.json';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BookmarksProvider, useBookmarks } from './contexts/BookmarksContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import CategoryCard from './components/CategoryCard';
import DuaDetail from './components/DuaDetail';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Settings from './components/Settings';
import BookmarksView from './components/BookmarksView';
import AsmaUlHusnaView from './components/AsmaUlHusnaView';
import AsmaUlAnbiyaView from './components/AsmaUlAnbiyaView';
import DailyProgress from './components/DailyProgress';
import SalahTracker from './components/SalahTracker';
import DuaReminder from './components/DuaReminder';
import TasbeehCounter from './components/TasbeehCounter';

type LanguageCode = 'en' | 'ar' | 'ur' | 'fr' | 'tr' | 'id' | 'bn' | 'ms' | 'ta' | 'ml';

interface Dua {
  id: string;
  title: Record<string, string>;
  arabic: string;
  translation: Record<string, string>;
  reference: string;
  times: number;
}

interface Category {
  id: string;
  icon: string;
  color: string;
  gradient: string;
  bg: string;
  border: string;
  text: string;
  name: Record<string, string>;
  duas: Dua[];
}

type ViewMode = 'categories' | 'bookmarks';

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [showImportantTexts, setShowImportantTexts] = useState(false);
  const { isDark } = useTheme();
  const { bookmarks } = useBookmarks();

  const categories: Category[] = duasData.categories as Category[];
  const languages = duasData.languages;

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(cat => {
      const catName = cat.name[language] || cat.name.en;
      if (catName.toLowerCase().includes(query)) return true;
      return cat.duas.some(dua => {
        const title = dua.title[language] || dua.title.en;
        const translation = dua.translation[language] || dua.translation.en;
        return title.toLowerCase().includes(query) || translation.toLowerCase().includes(query);
      });
    });
  }, [searchQuery, categories, language]);

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  const handleDuaClickFromBookmarks = (dua: any, categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setSelectedDua(dua);
      setViewMode('categories');
    }
  };

  const bannerText = {
    en: 'Select a category to view duas',
    ar: 'اختر فئة لعرض الأدعية',
    ur: 'دعائیں دیکھنے کے لیے ایک زمرہ منتخب کریں',
    fr: 'Sélectionnez une catégorie pour voir les duas',
    tr: 'Duaları görmek için bir kategori seçin',
    id: 'Pilih kategori untuk melihat doa',
    bn: 'দোয়া দেখতে একটি বিভাগ নির্বাচন করুন',
    ms: 'Pilih kategori untuk melihat doa',
    ta: 'துஆக்களைப் பார்க்க ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
    ml: 'ദുആകൾ കാണാൻ ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'
    }`}>
      <Header 
        language={language} 
        languages={languages} 
        showLanguageMenu={showLanguageMenu} 
        setShowLanguageMenu={setShowLanguageMenu} 
        setLanguage={setLanguage} 
        currentLanguage={currentLanguage}
        onSettingsClick={() => setShowSettings(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        bookmarksCount={bookmarks.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />

        {/* View Mode Toggle */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="mb-8 text-center">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {bannerText[language as keyof typeof bannerText] || bannerText.en}
            </p>
          </div>
        )}

        {/* Daily Progress Tracker */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="mb-8">
            <DailyProgress language={language} />
          </div>
        )}

        {/* Salah Tracker */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="mb-8">
            <SalahTracker language={language} />
          </div>
        )}

        {/* Dua Reminder */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="mb-8">
            <DuaReminder language={language} />
          </div>
        )}

        {/* Tasbeeh Counter */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="mb-8">
            <TasbeehCounter language={language} />
          </div>
        )}

        {/* Categories Grid */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                language={language}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        )}

        {/* Bookmarks View */}
        {viewMode === 'bookmarks' && !selectedCategory && !selectedDua && (
          <BookmarksView language={language} onDuaClick={handleDuaClickFromBookmarks} />
        )}

        {/* Special Views for Asma ul Husna and Asma ul Anbiya */}
        {selectedCategory && !selectedDua && selectedCategory.id === 'asma-ul-husna' && (
          <AsmaUlHusnaView language={language} onBack={() => setSelectedCategory(null)} />
        )}

        {selectedCategory && !selectedDua && selectedCategory.id === 'asma-ul-anbiya' && (
          <AsmaUlAnbiyaView language={language} onBack={() => setSelectedCategory(null)} />
        )}

        {/* Regular Category View */}
        {selectedCategory && !selectedDua && selectedCategory.id !== 'asma-ul-husna' && selectedCategory.id !== 'asma-ul-anbiya' && (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`mb-6 flex items-center gap-2 transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>
                {language === 'en' ? 'Back to Categories' : language === 'ar' ? 'العودة للفئات' : language === 'ur' ? 'زمرہ جات پر واپس' : language === 'fr' ? 'Retour aux Catégories' : language === 'tr' ? 'Kategorilere Dön' : language === 'id' ? 'Kembali ke Kategori' : language === 'bn' ? 'বিভাগে ফিরে যান' : language === 'ms' ? 'Kembali ke Kategori' : language === 'ta' ? 'வகைகளுக்குத் திரும்பு' : 'വിഭാഗങ്ങളിലേക്ക് മടങ്ങുക'}
              </span>
            </button>
            
            {/* Category Header */}
            <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${selectedCategory.gradient} text-white shadow-lg`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCategory.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCategory.name[language] || selectedCategory.name.en}</h2>
                  <p className="text-white/80 text-sm">{selectedCategory.duas.length} {language === 'en' ? 'duas' : language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : language === 'fr' ? 'duas' : language === 'tr' ? 'dua' : language === 'id' ? 'doa' : language === 'bn' ? 'দোয়া' : language === 'ms' ? 'doa' : language === 'ta' ? 'துஆ' : 'ദുആ'}</p>
                </div>
              </div>
            </div>

            {/* Duas List */}
            <div className="space-y-4">
              {selectedCategory.duas.map((dua, index) => (
                <div
                  key={dua.id}
                  onClick={() => setSelectedDua(dua)}
                  className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : `${selectedCategory.bg} ${selectedCategory.border} hover:shadow-md`} border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedCategory.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : selectedCategory.text} text-lg mb-1`}>
                        {dua.title[language] || dua.title.en}
                      </h3>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-2`}>
                        {dua.translation[language] || dua.translation.en}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{dua.reference}</span>
                        {dua.times > 1 && (
                          <span className={`text-xs ${isDark ? 'bg-slate-700 text-gray-400' : 'bg-white/80 text-gray-500'} px-2 py-0.5 rounded-full`}>
                            ×{dua.times}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className={`w-5 h-5 flex-shrink-0 mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dua Detail View */}
        {selectedDua && selectedCategory && (
          <DuaDetail
            dua={selectedDua}
            category={selectedCategory}
            language={language}
            onBack={() => setSelectedDua(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-16 py-8 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {language === 'en' ? 'All duas are from authentic sources (Quran & Sunnah)' :
             language === 'ar' ? 'جميع الأدعية من مصادر صحيحة (القرآن والسنة)' :
             language === 'ur' ? 'تمام دعائیں مستند مصادر سے ہیں (قرآن و سنت)' :
             language === 'fr' ? 'Tous les duas proviennent de sources authentiques (Coran & Sunnah)' :
             language === 'tr' ? 'Tüm dualar sahih kaynaklardandır (Kur\'an ve Sünnet)' :
             language === 'id' ? 'Semua doa dari sumber yang shahih (Al-Quran & Sunnah)' :
             language === 'bn' ? 'সকল দোয়া সহীহ উৎস থেকে (কুরআন ও সুন্নাহ)' :
             language === 'ms' ? 'Semua doa dari sumber yang sahih (Al-Quran & Sunnah)' :
             language === 'ta' ? 'அனைத்து துஆக்களும் நம்பகமான ஆதாரங்களிலிருந்து (குர்ஆன் & சுன்னா)' :
             'എല്ലാ ദുആകളും ആധികാരികമായ ഉറവിടങ്ങളിൽ നിന്നാണ് (ഖുർആനും സുന്നത്തും)'}
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      </footer>

      {/* Settings Modal */}
      <Settings language={language} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </BookmarksProvider>
    </ThemeProvider>
  );
}
