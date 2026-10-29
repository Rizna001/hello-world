import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SalahTrackerProps {
  language: string;
}

interface SalahRecord {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  date: string;
}

export default function SalahTracker({ language }: SalahTrackerProps) {
  const { isDark } = useTheme();
  const [todayRecord, setTodayRecord] = useState<SalahRecord>(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`salah-${today}`);
    return saved ? JSON.parse(saved) : {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      date: today
    };
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('salah-streak');
    return saved ? parseInt(saved) : 0;
  });

  const [weeklyStats, setWeeklyStats] = useState<number[]>(() => {
    const saved = localStorage.getItem('salah-weekly');
    return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0, 0, 0];
  });

  useEffect(() => {
    localStorage.setItem(`salah-${todayRecord.date}`, JSON.stringify(todayRecord));
  }, [todayRecord]);

  useEffect(() => {
    localStorage.setItem('salah-streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('salah-weekly', JSON.stringify(weeklyStats));
  }, [weeklyStats]);

  const toggleSalah = (prayer: keyof Omit<SalahRecord, 'date'>) => {
    const newRecord = { ...todayRecord, [prayer]: !todayRecord[prayer] };
    setTodayRecord(newRecord);

    // Update streak
    const completedCount = Object.values(newRecord).filter(v => v === true && typeof v === 'boolean').length;
    if (completedCount === 5) {
      setStreak(prev => prev + 1);
    }

    // Update weekly stats
    const dayOfWeek = new Date().getDay();
    const newWeekly = [...weeklyStats];
    newWeekly[dayOfWeek] = completedCount;
    setWeeklyStats(newWeekly);
  };

  const completedCount = Object.values(todayRecord).filter(v => v === true).length;
  const progress = (completedCount / 5) * 100;

  const prayers = [
    { key: 'fajr' as const, name: { en: 'Fajr', ar: 'الفجر', ur: 'فجر', fr: 'Fajr', tr: 'Sabah', id: 'Subuh', bn: 'ফজর', ms: 'Subuh', ta: 'ஃப்ஜ்ர்', ml: 'ഫജ്‌ർ' }, icon: '🌅', time: 'Dawn' },
    { key: 'dhuhr' as const, name: { en: 'Dhuhr', ar: 'الظهر', ur: 'ظہر', fr: 'Dhuhr', tr: 'Öğle', id: 'Dzuhur', bn: 'যোহর', ms: 'Zohor', ta: 'ளுஹ்ர்', ml: 'ൾഹ്‌ർ' }, icon: '☀️', time: 'Noon' },
    { key: 'asr' as const, name: { en: 'Asr', ar: 'العصر', ur: 'عصر', fr: 'Asr', tr: 'İkindi', id: 'Ashar', bn: 'আসর', ms: 'Asar', ta: 'அஸ்ர்', ml: 'അസ്‌ർ' }, icon: '🌤️', time: 'Afternoon' },
    { key: 'maghrib' as const, name: { en: 'Maghrib', ar: 'المغرب', ur: 'مغرب', fr: 'Maghrib', tr: 'Akşam', id: 'Maghrib', bn: 'মাগরিব', ms: 'Maghrib', ta: 'மக்ரிப்', ml: 'മഗ്‌രിബ്' }, icon: '🌅', time: 'Sunset' },
    { key: 'isha' as const, name: { en: 'Isha', ar: 'العشاء', ur: 'عشاء', fr: 'Isha', tr: 'Yatsı', id: 'Isya', bn: 'ইশা', ms: 'Isyak', ta: 'இஷா', ml: 'ഇശാ' }, icon: '🌙', time: 'Night' },
  ];

  const dayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
    ur: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
    fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    bn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'],
    ms: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
    ta: ['ஞாயி', 'திங்', 'செவ்', 'புத', 'வியா', 'வெள்', 'சனி'],
    ml: ['ഞായ', 'തിങ്ക', 'ചൊവ്വ', 'ബുധ', 'വ്യാഴ', 'വെള്ള', 'ശനി'],
  };

  const labels = {
    en: { title: 'Salah Tracker', streak: 'Day Streak', weekly: 'This Week', completed: 'completed', reset: 'Reset' },
    ar: { title: 'متتبع الصلاة', streak: 'أيام متتالية', weekly: 'هذا الأسبوع', completed: 'مكتمل', reset: 'إعادة تعيين' },
    ur: { title: 'نماز ٹریکر', streak: 'مسلسل دن', weekly: 'اس ہفتے', completed: 'مکمل', reset: 'ری سیٹ' },
    fr: { title: 'Suivi de la Prière', streak: 'Jours Consécutifs', weekly: 'Cette Semaine', completed: 'complété', reset: 'Réinitialiser' },
    tr: { title: 'Namaz Takibi', streak: 'Gün Serisi', weekly: 'Bu Hafta', completed: 'tamamlandı', reset: 'Sıfırla' },
    id: { title: 'Pelacak Shalat', streak: 'Hari Berturut-turut', weekly: 'Minggu Ini', completed: 'selesai', reset: 'Reset' },
    bn: { title: 'নামাজ ট্র্যাকার', streak: 'ধারাবাহিক দিন', weekly: 'এই সপ্তাহ', completed: 'সম্পন্ন', reset: 'রিসেট' },
    ms: { title: 'Penjejak Solat', streak: 'Hari Berturut-turut', weekly: 'Minggu Ini', completed: 'selesai', reset: 'Reset' },
    ta: { title: 'தொழுகை டிராக்கர்', streak: 'தொடர்ச்சி நாட்கள்', weekly: 'இந்த வாரம்', completed: 'முடிந்தது', reset: 'மீட்டமை' },
    ml: { title: 'നമസ്കാര ട്രാക്കർ', streak: 'തുടർച്ച ദിവസങ്ങൾ', weekly: 'ഈ ആഴ്ച', completed: 'പൂർത്തിയായി', reset: 'പുനഃക്രമീകരിക്കുക' },
  };

  const label = labels[language as keyof typeof labels] || labels.en;
  const days = dayNames[language as keyof typeof dayNames] || dayNames.en;

  return (
    <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🕌 {label.title}
        </h3>
        <div className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          🔥 {streak} {label.streak}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {completedCount}/5 {label.completed}
          </span>
          <span className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <div
            className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Prayer Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {prayers.map((prayer) => (
          <button
            key={prayer.key}
            onClick={() => toggleSalah(prayer.key)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              todayRecord[prayer.key]
                ? isDark
                  ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-700'
                : isDark
                ? 'bg-slate-900 border-slate-700 text-gray-400 hover:border-slate-600'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            } border-2`}
          >
            <span className="text-2xl mb-1">{prayer.icon}</span>
            <span className="text-xs font-medium">{prayer.name[language as keyof typeof prayer.name] || prayer.name.en}</span>
            {todayRecord[prayer.key] && (
              <span className="text-xs mt-1">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Weekly Stats */}
      <div>
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label.weekly}
        </h4>
        <div className="flex items-end justify-between gap-1 h-20">
          {weeklyStats.map((count, index) => {
            const height = (count / 5) * 100;
            const isToday = index === new Date().getDay();
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${
                    isToday
                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-400'
                      : isDark
                      ? 'bg-slate-700'
                      : 'bg-gray-300'
                  }`}
                  style={{ height: `${height}%`, minHeight: count > 0 ? '8px' : '2px' }}
                />
                <span className={`text-xs ${isToday ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold') : (isDark ? 'text-gray-500' : 'text-gray-500')}`}>
                  {days[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
