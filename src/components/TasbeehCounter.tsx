import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TasbeehCounterProps {
  language: string;
}

export default function TasbeehCounter({ language }: TasbeehCounterProps) {
  const { isDark } = useTheme();
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tasbeeh-count');
    return saved ? parseInt(saved) : 0;
  });
  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem('tasbeeh-target');
    return saved ? parseInt(saved) : 33;
  });
  const [totalToday, setTotalToday] = useState(() => {
    const saved = localStorage.getItem('tasbeeh-today');
    const savedDate = localStorage.getItem('tasbeeh-date');
    const today = new Date().toDateString();
    if (savedDate === today && saved) {
      return parseInt(saved);
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('tasbeeh-count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('tasbeeh-target', target.toString());
  }, [target]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('tasbeeh-today', totalToday.toString());
    localStorage.setItem('tasbeeh-date', today);
  }, [totalToday]);

  const increment = () => {
    setCount(prev => prev + 1);
    setTotalToday(prev => prev + 1);
    if (count + 1 === target) {
      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(prev => prev - 1);
      setTotalToday(prev => Math.max(0, prev - 1));
    }
  };

  const reset = () => {
    setCount(0);
  };

  const resetAll = () => {
    setCount(0);
    setTotalToday(0);
  };

  const progress = (count / target) * 100;

  const labels = {
    en: { title: 'Tasbeeh Counter', count: 'Count', target: 'Target', today: 'Today', reset: 'Reset', resetAll: 'Reset All', setTarget: 'Set Target', completed: 'Completed!', dhikr: 'Dhikr' },
    ar: { title: 'عداد التسبيح', count: 'العدد', target: 'الهدف', today: 'اليوم', reset: 'إعادة', resetAll: 'إعادة الكل', setTarget: 'تعيين الهدف', completed: 'مكتمل!', dhikr: 'ذكر' },
    ur: { title: 'تسبیح کاؤنٹر', count: 'شمار', target: 'ہدف', today: 'آج', reset: 'ری سیٹ', resetAll: 'سب ری سیٹ', setTarget: 'ہدف مقرر کریں', completed: 'مکمل!', dhikr: 'ذکر' },
    fr: { title: 'Compteur de Tasbih', count: 'Compte', target: 'Objectif', today: 'Aujourd\'hui', reset: 'Réinitialiser', resetAll: 'Tout Réinitialiser', setTarget: 'Définir l\'Objectif', completed: 'Terminé!', dhikr: 'Dhikr' },
    tr: { title: 'Tesbih Sayacı', count: 'Sayı', target: 'Hedef', today: 'Bugün', reset: 'Sıfırla', resetAll: 'Tümünü Sıfırla', setTarget: 'Hedef Belirle', completed: 'Tamamlandı!', dhikr: 'Zikir' },
    id: { title: 'Penghitung Tasbih', count: 'Hitungan', target: 'Target', today: 'Hari Ini', reset: 'Reset', resetAll: 'Reset Semua', setTarget: 'Atur Target', completed: 'Selesai!', dhikr: 'Dzikir' },
    bn: { title: 'তাসবীহ কাউন্টার', count: 'গণনা', target: 'লক্ষ্য', today: 'আজ', reset: 'রিসেট', resetAll: 'সব রিসেট', setTarget: 'লক্ষ্য নির্ধারণ', completed: 'সম্পন্ন!', dhikr: 'যিকির' },
    ms: { title: 'Penghitung Tasbih', count: 'Hitungan', target: 'Target', today: 'Hari Ini', reset: 'Reset', resetAll: 'Reset Semua', setTarget: 'Atur Target', completed: 'Selesai!', dhikr: 'Zikir' },
    ta: { title: 'தஸ்பீஹ் எண்ணிக்கை', count: 'எண்ணிக்கை', target: 'இலக்கு', today: 'இன்று', reset: 'மீட்டமை', resetAll: 'அனைத்தையும் மீட்டமை', setTarget: 'இலக்கை அமை', completed: 'முடிந்தது!', dhikr: 'திக்ர்' },
    ml: { title: 'തസ്ബീഹ് എണ്ണി', count: 'എണ്ണം', target: 'ലക്ഷ്യം', today: 'ഇന്ന്', reset: 'പുനഃക്രമീകരിക്കുക', resetAll: 'എല്ലാം പുനഃക്രമീകരിക്കുക', setTarget: 'ലക്ഷ്യം സജ്ജമാക്കുക', completed: 'പൂർത്തിയായി!', dhikr: 'ദിക്ർ' },
  };

  const label = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-lg`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        📿 {label.title}
      </h3>

      {/* Main Counter Display */}
      <div className="text-center mb-6">
        <div
          onClick={increment}
          className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
            count >= target
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
              : isDark
              ? 'bg-slate-700 text-white'
              : 'bg-gray-100 text-gray-900'
          } shadow-lg`}
        >
          <div className="text-center">
            <div className="text-5xl font-bold">{count}</div>
            <div className={`text-sm mt-1 ${count >= target ? 'text-white/80' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              / {target}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                count >= target
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {count >= target && (
          <div className="mt-3 text-emerald-500 font-semibold animate-pulse">
            ✓ {label.completed}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={decrement}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={reset}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {label.reset}
        </button>

        <button
          onClick={increment}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Target Selector */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label.setTarget}
        </label>
        <div className="flex gap-2">
          {[33, 99, 100, 500, 1000].map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                target === t
                  ? isDark
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 text-white'
                  : isDark
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Total */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {label.today}
          </span>
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {totalToday}
          </span>
        </div>
        <button
          onClick={resetAll}
          className={`mt-2 w-full py-1 rounded text-xs transition-colors ${
            isDark
              ? 'text-gray-500 hover:text-gray-300'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {label.resetAll}
        </button>
      </div>
    </div>
  );
}
