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
    <div className="min-h-screen overflow-x-clip bg-[var(--bisme-bg-primary)] text-white">
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
                    className="dua-card cursor-pointer rounded-xl border p-4 transition-all duration-200"
                  >
                    <div className="mb-1 flex min-w-0 flex-wrap items-center justify-between gap-2">
                      <h3 className={`min-w-0 break-words font-semibold ${isDark ? 'text-white' : category.text}`}>
                        {dua.title[language] || dua.title.en}
                      </h3>
                      <span className="max-w-[45%] break-words rounded-full border border-[var(--bisme-gold-border)] bg-[#00251b] px-2 py-0.5 text-right text-xs text-[var(--bisme-text-secondary)]">
                        {category.name[language] || category.name.en}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 text-[var(--bisme-text-secondary)]">
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
            <div className="category-detail-header mb-6 rounded-2xl p-4 sm:p-6">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{selectedCategory.name[language] || selectedCategory.name.en}</h2>
                <p className="text-sm">{visibleCategoryDuas.length} {language === 'en' ? 'duas' : language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : language === 'fr' ? 'duas' : language === 'tr' ? 'dua' : language === 'id' ? 'doa' : language === 'bn' ? 'দোয়া' : language === 'ms' ? 'doa' : language === 'ta' ? 'துஆ' : 'ദുആ'}</p>
              </div>
            </div>

            {/* Duas List */}
            <div className="space-y-4">
              {visibleCategoryDuas.map((dua, index) => (
                <div
                  key={dua.id}
                  onClick={() => setSelectedDua(dua)}
                  className="dua-card cursor-pointer rounded-xl border p-5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--bisme-gold-border)] bg-[#00251b] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        {dua.title[language] || dua.title.en}
                      </h3>
                      <p className="text-sm text-[var(--bisme-text-secondary)] line-clamp-2">
                        {dua.translation[language] || dua.translation.en}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-[var(--bisme-text-muted)]">{dua.reference}</span>
                        {dua.times > 1 && (
                          <span className="rounded-full border border-[var(--bisme-gold-border)] bg-[#00251b] px-2 py-0.5 text-xs text-[var(--bisme-text-secondary)]">
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
      <footer className="app-footer mt-16 border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-white/60">
            {language === 'en' ? 'Source and authenticity notes are shown where available.' :
             language === 'ar' ? 'تُعرض المصادر وملاحظات درجة الصحة حيثما توفرت.' :
             language === 'ur' ? 'جہاں دستیاب ہو، ماخذ اور درجۂ صحت کی وضاحت درج ہے۔' :
             language === 'fr' ? 'Les sources et les indications d’authenticité sont affichées lorsqu’elles sont disponibles.' :
             language === 'tr' ? 'Kaynak ve sıhhat bilgileri mevcut olduğunda gösterilir.' :
             language === 'id' ? 'Keterangan sumber dan status keaslian ditampilkan jika tersedia.' :
             language === 'bn' ? 'উৎস ও বিশুদ্ধতার তথ্য পাওয়া গেলে দেখানো হয়েছে।' :
             language === 'ms' ? 'Maklumat sumber dan status kesahihan dipaparkan jika tersedia.' :
             language === 'ta' ? 'ஆதாரம் மற்றும் நம்பகத்தன்மைக் குறிப்புகள் கிடைக்கும்போது காட்டப்படும்.' :
             'ലഭ്യമായിടത്ത് ഉറവിടവും ആധികാരികതയെക്കുറിച്ചുള്ള കുറിപ്പുകളും കാണിച്ചിരിക്കുന്നു.'}
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
