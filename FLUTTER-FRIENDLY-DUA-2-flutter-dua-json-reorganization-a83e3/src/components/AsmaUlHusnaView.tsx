import { useState } from 'react';
import completeListsData from '../data/allData.json';
const { asmaUlHusna } = completeListsData;
import { useTheme } from '../contexts/ThemeContext';
import AudioPlayer from './AudioPlayer';

interface AsmaUlHusnaViewProps {
  language: string;
  onBack: () => void;
}

export default function AsmaUlHusnaView({ language, onBack }: AsmaUlHusnaViewProps) {
  const { isDark } = useTheme();
  const [selectedName, setSelectedName] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = asmaUlHusna.filter(name => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      name.tr.toLowerCase().includes(query) ||
      name.en.toLowerCase().includes(query) ||
      name.ar.includes(searchQuery) ||
      name.ta.includes(searchQuery) ||
      name.ml.includes(searchQuery)
    );
  });

  const labels: Record<string, Record<string, string>> = {
    en: { title: "99 Names of Allah", subtitle: "Asma ul Husna - The Most Beautiful Names", search: "Search names...", back: "Back to Categories" },
    ar: { title: "أسماء الله الحسنى", subtitle: "99 اسماً - الأسماء الحسنى", search: "ابحث عن الأسماء...", back: "العودة للفئات" },
    ur: { title: "اسماء اللہ الحسنی", subtitle: "99 نام - خوبصورت نام", search: "نام تلاش کریں...", back: "زمرہ جات پر واپس" },
    fr: { title: "99 Noms d'Allah", subtitle: "Asma ul Husna - Les Plus Beaux Noms", search: "Rechercher...", back: "Retour" },
    tr: { title: "99 İsim", subtitle: "Esmaü'l-Hüsna - En Güzel İsimler", search: "İsim ara...", back: "Geri" },
    id: { title: "99 Nama Allah", subtitle: "Asmaul Husna - Nama-Nama Terbaik", search: "Cari nama...", back: "Kembali" },
    bn: { title: "আল্লাহর ৯৯টি নাম", subtitle: "আসমাউল হুসনা - সর্বোত্তম নাম", search: "নাম খুঁজুন...", back: "পিছনে" },
    ms: { title: "99 Nama Allah", subtitle: "Asmaul Husna - Nama-Nama Terbaik", search: "Cari nama...", back: "Kembali" },
    ta: { title: "அல்லாஹ்வின் 99 பெயர்கள்", subtitle: "அஸ்மாவுல் ஹுஸ்னா - மிக அழகான பெயர்கள்", search: "பெயர் தேடு...", back: "பின்" },
    ml: { title: "അല്ലാഹുവിന്റെ 99 നാമങ്ങൾ", subtitle: "അൽ-അസ്മാഉൽ ഹുസ്നാ - ഏറ്റവും മനോഹരമായ നാമങ്ങൾ", search: "നാമം തിരയുക...", back: "തിരികെ" }
  };

  const label = labels[language] || labels.en;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className={`mb-6 flex items-center gap-2 transition-colors ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{label.back}</span>
      </button>

      <div className="bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">✨</span>
          <div>
            <h2 className="text-2xl font-bold">{label.title}</h2>
            <p className="text-white/80 text-sm">{label.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={label.search}
          className={`w-full px-4 py-3 rounded-xl border ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      {/* Grid of Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredNames.map((name) => (
          <div
            key={name.n}
            onClick={() => setSelectedName(selectedName === name.n ? null : name.n)}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              isDark 
                ? 'bg-slate-800 border-slate-700 hover:border-yellow-500' 
                : 'bg-white border-gray-200 hover:border-yellow-400 hover:shadow-md'
            } ${selectedName === name.n ? (isDark ? 'border-yellow-500 bg-slate-700' : 'border-yellow-500 shadow-lg') : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {name.n}
              </div>
              <div className="flex-1">
                <p dir="rtl" className="text-2xl font-arabic mb-1" style={{ fontFamily: "'Amiri', serif" }}>
                  {name.ar}
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  {name.tr}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'ta' ? name.ta : language === 'ml' ? name.ml : name.en}
                </p>
              </div>
            </div>

            {/* Expanded view with audio */}
            {selectedName === name.n && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                <AudioPlayer arabicText={name.ar} language={language} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'en' ? 'No names found' : 'لا توجد أسماء'}
          </p>
        </div>
      )}
    </div>
  );
}
