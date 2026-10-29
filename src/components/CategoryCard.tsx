import { useTheme } from '../contexts/ThemeContext';

export default function CategoryCard({
  category,
  language,
  onClick,
}: {
  category: any;
  language: string;
  onClick: () => void;
}) {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`${
        isDark 
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
          : `${category.bg} ${category.border} hover:shadow-lg`
      } border rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] group`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
          <span className="text-2xl">{category.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${isDark ? 'text-white' : category.text} text-base leading-tight`}>
            {category.name[language] || category.name.en}
          </h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {category.duas.length} {language === 'en' ? 'duas' : language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : language === 'fr' ? 'duas' : language === 'tr' ? 'dua' : language === 'id' ? 'doa' : language === 'bn' ? 'দোয়া' : language === 'ms' ? 'doa' : language === 'ta' ? 'துஆ' : 'ദുആ'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {category.duas.slice(0, 2).map((dua: any) => (
          <span
            key={dua.id}
            className={`text-xs px-2 py-1 rounded-md truncate max-w-[120px] ${
              isDark ? 'bg-slate-700 text-gray-300' : 'bg-white/70 text-gray-600'
            }`}
          >
            {dua.title[language] || dua.title.en}
          </span>
        ))}
        {category.duas.length > 2 && (
          <span className={`text-xs px-2 py-1 rounded-md ${
            isDark ? 'bg-slate-700 text-gray-400' : 'bg-white/70 text-gray-400'
          }`}>
            +{category.duas.length - 2}
          </span>
        )}
      </div>
    </button>
  );
}
