import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
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
import DuaReminder from './components/DuaReminder';

type LanguageCode = 'en' | 'ar' | 'ur' | 'fr' | 'tr' | 'id' | 'bn' | 'ms' | 'ta' | 'ml';

interface Dua {
  id: string;
  title: Record<string, string>;
  arabic: string;
  translation: Record<string, string>;
  transliteration?: string;
  reference: string;
  times: number;
}

interface Category {
  id: string;
  color: string;
  gradient: string;
  bg: string;
  border: string;
  text: string;
  name: Record<string, string>;
  duas: Dua[];
}

type ViewMode = 'categories' | 'bookmarks';

// Lower-cases and strips Arabic diacritics, Latin accents and apostrophe-like marks
// so that "a'laa", "aalaa" style spellings and Arabic with/without harakat all match.
const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/['’‘ʿʻ`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const duaSearchText = (dua: Dua) =>
  normalize([
    ...Object.values(dua.title || {}),
    ...Object.values(dua.translation || {}),
    dua.arabic,
    dua.transliteration,
    dua.reference,
  ].filter(Boolean).join(' \n '));

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [showImportantTexts, setShowImportantTexts] = useState(false);
  const { isDark } = useTheme();
  const { bookmarks } = useBookmarks();

  const categories = useMemo(() => (duasData.categories as Category[])
    .filter(category => !/ruqyah|ruqya|رقية/i.test(
      `${category.id} ${Object.values(category.name).join(' ')}`
    ))
    .map(category => ({
      ...category,
      duas: category.duas.filter(dua => !/ruqyah|ruqya|رقية/i.test(
        `${dua.id} ${Object.values(dua.title).join(' ')} ${Object.values(dua.translation).join(' ')}`
      )),
    }))
    .filter(category => category.duas.length > 0), []);
  const languages = duasData.languages;

  const normalizedQuery = useMemo(() => normalize(searchQuery), [searchQuery]);
  const isSearching = normalizedQuery.length > 0;

  // Pre-computed searchable text for every dua (all categories, including "Others").
  const searchIndex = useMemo(
    () => categories.flatMap(category =>
      category.duas.map(dua => ({ category, dua, text: duaSearchText(dua) }))
    ),
    [categories]
  );

  // Individual duas matching the query, across every category.
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return searchIndex.filter(item => item.text.includes(normalizedQuery));
  }, [isSearching, normalizedQuery, searchIndex]);

  // Categories whose own name matches the query.
  const filteredCategories = useMemo(() => {
    if (!isSearching) return categories;
    return categories.filter(cat =>
      normalize(Object.values(cat.name).join(' ')).includes(normalizedQuery)
    );
  }, [isSearching, normalizedQuery, categories]);

  // Inside an open category, narrow the list by the search text too.
  const visibleCategoryDuas = useMemo(() => {
    if (!selectedCategory) return [];
    if (!isSearching) return selectedCategory.duas;
    return selectedCategory.duas.filter(dua => duaSearchText(dua).includes(normalizedQuery));
  }, [selectedCategory, isSearching, normalizedQuery]);

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
    <div className="min-h-screen overflow-x-clip bg-[#000d08] text-white">
      <Header 
        language={language} 
        languages={languages} 
        showLanguageMenu={showLanguageMenu} 
        setShowLanguageMenu={setShowLanguageMenu} 
        setLanguage={setLanguage} 
        currentLanguage={currentLanguage}
        onHomeClick={() => {
          setSelectedCategory(null);
          setSelectedDua(null);
          setViewMode('categories');
        }}
        viewMode={viewMode}
        setViewMode={setViewMode}
        bookmarksCount={bookmarks.length}
      />
      
      <main className="max-w-7xl mx-auto px-[9px] sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search bar with the compact custom-reminders box beside it */}
        <div className="mb-4 flex flex-col md:flex-row md:items-start gap-3 sm:mb-5">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} language={language} />
          {viewMode === 'categories' && !selectedCategory && !selectedDua && (
            <DuaReminder language={language} duas={categories.flatMap(category => category.duas)} />
          )}
        </div>

        {/* View Mode Toggle */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && !isSearching && (
          <div className="mb-4 text-center sm:mb-5">
            <p className="text-[15px] font-semibold text-[var(--bisme-gold)]">
              {bannerText[language as keyof typeof bannerText] || bannerText.en}
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 gap-[9px] sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
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

        {/* Search results: individual duas from every category (including Others) */}
        {viewMode === 'categories' && !selectedCategory && !selectedDua && isSearching && (
          <div className={filteredCategories.length > 0 ? 'mt-8' : ''}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {language === 'ar' ? 'نتائج الأدعية' : language === 'ur' ? 'دعاؤں کے نتائج' : language === 'fr' ? 'Résultats' : 'Dua results'} ({searchResults.length})
            </h2>
            {searchResults.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {language === 'ar' ? 'لا توجد نتائج' : language === 'ur' ? 'کوئی نتیجہ نہیں ملا' : language === 'fr' ? 'Aucun résultat' : 'No duas found'}
              </p>
            ) : (
              <div className="space-y-3">
                {searchResults.map(({ category, dua }) => (
                  <div
                    key={`${category.id}-${dua.id}`}
                    onClick={() => { setSelectedCategory(category); setSelectedDua(dua); }}
                    className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : `${category.bg} ${category.border} hover:shadow-md`} border rounded-xl p-4 cursor-pointer transition-all duration-200`}
                  >
                    <div className="mb-1 flex min-w-0 flex-wrap items-center justify-between gap-2">
                      <h3 className={`min-w-0 break-words font-semibold ${isDark ? 'text-white' : category.text}`}>
                        {dua.title[language] || dua.title.en}
                      </h3>
                      <span className={`max-w-[45%] break-words rounded-full px-2 py-0.5 text-right text-xs ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-white/80 text-gray-500'}`}>
                        {category.name[language] || category.name.en}
                      </span>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-2`}>
                      {dua.translation[language] || dua.translation.en}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
              className="category-back-button mb-5 inline-flex items-center gap-2 rounded-[13px] border border-[var(--bisme-gold)] px-3 py-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>
                {language === 'en' ? 'Back to Categories' : language === 'ar' ? 'العودة للفئات' : language === 'ur' ? 'زمرہ جات پر واپس' : language === 'fr' ? 'Retour aux Catégories' : language === 'tr' ? 'Kategorilere Dön' : language === 'id' ? 'Kembali ke Kategori' : language === 'bn' ? 'বিভাগে ফিরে যান' : language === 'ms' ? 'Kembali ke Kategori' : language === 'ta' ? 'வகைகளுக்குத் திரும்பு' : 'വിഭാഗങ്ങളിലേക്ക് മടങ്ങുക'}
              </span>
            </button>
            
            {/* Category Header */}
            <div className="mb-6 rounded-2xl border border-[rgba(230,198,107,0.35)] bg-[#003d2b] p-4 text-white shadow-lg sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--bisme-gold)] sm:text-2xl">{selectedCategory.name[language] || selectedCategory.name.en}</h2>
                <p className="text-white/80 text-sm">{visibleCategoryDuas.length} {language === 'en' ? 'duas' : language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : language === 'fr' ? 'duas' : language === 'tr' ? 'dua' : language === 'id' ? 'doa' : language === 'bn' ? 'দোয়া' : language === 'ms' ? 'doa' : language === 'ta' ? 'துஆ' : 'ദുആ'}</p>
              </div>
            </div>

            {/* Duas List */}
            <div className="space-y-4">
              {visibleCategoryDuas.map((dua, index) => (
                <div
                  key={dua.id}
                  onClick={() => setSelectedDua(dua)}
                  className={`${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : `${selectedCategory.bg} ${selectedCategory.border} hover:shadow-md`} border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bisme-jade)] text-sm font-bold text-[#000d08]">
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
                            x{dua.times}
                          </span>
                        )}
                      </div>
                    </div>
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
          <p className="text-sm text-white/60">
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
          <p className="mt-2 font-arabic text-lg text-[var(--bisme-gold)]">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="mt-1 text-[10px] text-white/50">Arabic text set in KFGQPC Uthmanic Script (Hafs)</p>
        </div>
      </footer>

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
