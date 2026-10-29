import { useState } from 'react';
import completeListsData from '../data/allData.json';
const { asmaUlAnbiya } = completeListsData;
const { prophetsWithDuas } = completeListsData;
import { useTheme } from '../contexts/ThemeContext';
import AudioPlayer from './AudioPlayer';

interface AsmaUlAnbiyaViewProps {
  language: string;
  onBack: () => void;
}

export default function AsmaUlAnbiyaView({ language, onBack }: AsmaUlAnbiyaViewProps) {
  const { isDark } = useTheme();
  const [selectedProphet, setSelectedProphet] = useState<number | null>(null);
  const [showDuas, setShowDuas] = useState<number | null>(null);

  const labels: Record<string, Record<string, string>> = {
    en: { title: "25 Prophets", subtitle: "Asma ul Anbiya - Names of the Prophets", back: "Back to Categories", showDuas: "Show Duas", hideDuas: "Hide Duas", noDuas: "No specific duas recorded" },
    ar: { title: "25 نبي", subtitle: "أسماء الأنبياء", back: "العودة للفئات", showDuas: "عرض الأدعية", hideDuas: "إخفاء الأدعية", noDuas: "لا توجد أدعية محددة مسجلة" },
    ur: { title: "25 انبیاء", subtitle: "اسماء الانبیاء", back: "زمرہ جات پر واپس", showDuas: "دعائیں دکھائیں", hideDuas: "دعائیں چھپائیں", noDuas: "کوئی مخصوص دعائیں درج نہیں" },
    fr: { title: "25 Prophètes", subtitle: "Asma ul Anbiya - Noms des Prophètes", back: "Retour", showDuas: "Afficher les Duas", hideDuas: "Masquer les Duas", noDuas: "Aucun dua spécifique enregistré" },
    tr: { title: "25 Peygamber", subtitle: "Peygamberlerin İsimleri", back: "Geri", showDuas: "Duaları Göster", hideDuas: "Duaları Gizle", noDuas: "Belirli dua kaydedilmedi" },
    id: { title: "25 Nabi", subtitle: "Nama-Nama Nabi", back: "Kembali", showDuas: "Tampilkan Doa", hideDuas: "Sembunyikan Doa", noDuas: "Tidak ada doa spesifik yang tercatat" },
    bn: { title: "২৫ নবী", subtitle: "নবীদের নাম", back: "পিছনে", showDuas: "দোয়া দেখান", hideDuas: "দোয়া লুকান", noDuas: "কোনো নির্দিষ্ট দোয়া রেকর্ড নেই" },
    ms: { title: "25 Nabi", subtitle: "Nama-Nama Nabi", back: "Kembali", showDuas: "Tunjukkan Doa", hideDuas: "Sembunyikan Doa", noDuas: "Tiada doa khusus direkodkan" },
    ta: { title: "25 நபிமார்கள்", subtitle: "நபிமார்களின் பெயர்கள்", back: "பின்", showDuas: "துஆக்களை காட்டு", hideDuas: "துஆக்களை மறை", noDuas: "குறிப்பிட்ட துஆக்கள் பதிவு செய்யப்படவில்லை" },
    ml: { title: "25 നബിമാർ", subtitle: "നബിമാരുടെ നാമങ്ങൾ", back: "തിരികെ", showDuas: "ദുആകൾ കാണിക്കുക", hideDuas: "ദുആകൾ മറയ്ക്കുക", noDuas: "നിർദ്ദിഷ്ട ദുആകൾ രേഖപ്പെടുത്തിയിട്ടില്ല" }
  };

  const label = labels[language] || labels.en;

  const getProphetDuas = (prophetNumber: number) => {
    return prophetsWithDuas.find(p => p.prophetNumber === prophetNumber);
  };

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📖</span>
          <div>
            <h2 className="text-2xl font-bold">{label.title}</h2>
            <p className="text-white/80 text-sm">{label.subtitle}</p>
          </div>
        </div>
      </div>

      {/* List of Prophets */}
      <div className="space-y-4">
        {asmaUlAnbiya.map((prophet) => (
          <div
            key={prophet.n}
            onClick={() => setSelectedProphet(selectedProphet === prophet.n ? null : prophet.n)}
            className={`cursor-pointer rounded-xl p-5 border transition-all ${
              isDark 
                ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' 
                : 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-md'
            } ${selectedProphet === prophet.n ? (isDark ? 'border-indigo-500 bg-slate-700' : 'border-indigo-500 shadow-lg') : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {prophet.n}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p dir="rtl" className="text-2xl font-arabic mb-1" style={{ fontFamily: "'Amiri', serif" }}>
                      {prophet.ar}
                    </p>
                    <p className={`text-base font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      {language === 'ta' ? prophet.ta : language === 'ml' ? prophet.ml : prophet.en}
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {prophet.title}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {prophet.years}
                    </p>
                  </div>
                </div>

                {/* Expanded view with audio and duas */}
                {selectedProphet === prophet.n && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                    <AudioPlayer arabicText={prophet.ar} language={language} />
                    
                    {/* Duas Section */}
                    {(() => {
                      const prophetData = getProphetDuas(prophet.n);
                      if (!prophetData || !prophetData.duas || prophetData.duas.length === 0) {
                        return (
                          <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-slate-700">
                            <p className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {label.noDuas}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDuas(showDuas === prophet.n ? null : prophet.n);
                            }}
                            className={`w-full mb-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                              isDark
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                            }`}
                          >
                            {showDuas === prophet.n ? label.hideDuas : label.showDuas} ({prophetData.duas.length})
                          </button>

                          {showDuas === prophet.n && (
                            <div className="space-y-3">
                              {prophetData.duas.map((dua, idx) => (
                                <div
                                  key={dua.id}
                                  className={`p-4 rounded-lg border ${
                                    isDark
                                      ? 'bg-slate-900 border-slate-600'
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-start gap-3 mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                      isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                      {idx + 1}
                                    </span>
                                    <h4 className={`font-semibold flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {dua.title[language as keyof typeof dua.title] || dua.title.en}
                                    </h4>
                                  </div>
                                  
                                  <p
                                    dir="rtl"
                                    className={`text-xl mb-2 leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
                                    style={{ fontFamily: "'Amiri', serif" }}
                                  >
                                    {dua.arabic}
                                  </p>

                                  {dua.transliteration && (
                                    <p className={`text-sm italic mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {dua.transliteration}
                                    </p>
                                  )}

                                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {dua.translation[language as keyof typeof dua.translation] || dua.translation.en}
                                  </p>

                                  <div className="flex items-center gap-2 text-xs">
                                    <span className={`px-2 py-1 rounded ${
                                      isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      📖 {dua.reference}
                                    </span>
                                  </div>

                                  {dua.context && (
                                    <p className={`text-xs mt-2 italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                      💡 {dua.context}
                                    </p>
                                  )}

                                  <div className="mt-3">
                                    <AudioPlayer arabicText={dua.arabic} language={language} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
