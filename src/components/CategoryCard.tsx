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
          ? 'bg-slate-800 border-slate-700 text-white hover:border-emerald-500'
          : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500'
      } min-h-32 w-full rounded-2xl border px-6 py-8 text-center text-lg font-semibold leading-relaxed shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
    >
      {category.name[language] || category.name.en}
    </button>
  );
}
