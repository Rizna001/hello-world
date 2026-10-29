import { useTheme } from '../contexts/ThemeContext';

const categoryColors: Record<string, { light: string; dark: string; accent: string }> = {
  amber: { light: 'from-amber-50 to-orange-100/70 border-amber-200 text-amber-950', dark: 'from-amber-950/50 to-orange-900/30 border-amber-700/70 text-amber-100', accent: 'from-amber-400 to-orange-500' },
  blue: { light: 'from-blue-50 to-sky-100/70 border-blue-200 text-blue-950', dark: 'from-blue-950/50 to-sky-900/30 border-blue-700/70 text-blue-100', accent: 'from-blue-400 to-sky-500' },
  cyan: { light: 'from-cyan-50 to-blue-100/70 border-cyan-200 text-cyan-950', dark: 'from-cyan-950/50 to-blue-900/30 border-cyan-700/70 text-cyan-100', accent: 'from-cyan-400 to-blue-500' },
  emerald: { light: 'from-emerald-50 to-teal-100/70 border-emerald-200 text-emerald-950', dark: 'from-emerald-950/50 to-teal-900/30 border-emerald-700/70 text-emerald-100', accent: 'from-emerald-400 to-teal-500' },
  fuchsia: { light: 'from-fuchsia-50 to-pink-100/70 border-fuchsia-200 text-fuchsia-950', dark: 'from-fuchsia-950/50 to-pink-900/30 border-fuchsia-700/70 text-fuchsia-100', accent: 'from-fuchsia-400 to-pink-500' },
  gray: { light: 'from-gray-50 to-slate-100/70 border-gray-200 text-gray-900', dark: 'from-gray-900/60 to-slate-800/50 border-gray-700 text-gray-100', accent: 'from-gray-400 to-slate-600' },
  green: { light: 'from-green-50 to-emerald-100/70 border-green-200 text-green-950', dark: 'from-green-950/50 to-emerald-900/30 border-green-700/70 text-green-100', accent: 'from-green-400 to-emerald-500' },
  indigo: { light: 'from-indigo-50 to-violet-100/70 border-indigo-200 text-indigo-950', dark: 'from-indigo-950/50 to-violet-900/30 border-indigo-700/70 text-indigo-100', accent: 'from-indigo-400 to-violet-500' },
  orange: { light: 'from-orange-50 to-red-100/70 border-orange-200 text-orange-950', dark: 'from-orange-950/50 to-red-900/30 border-orange-700/70 text-orange-100', accent: 'from-orange-400 to-red-500' },
  pink: { light: 'from-pink-50 to-rose-100/70 border-pink-200 text-pink-950', dark: 'from-pink-950/50 to-rose-900/30 border-pink-700/70 text-pink-100', accent: 'from-pink-400 to-rose-500' },
  purple: { light: 'from-purple-50 to-violet-100/70 border-purple-200 text-purple-950', dark: 'from-purple-950/50 to-violet-900/30 border-purple-700/70 text-purple-100', accent: 'from-purple-400 to-violet-500' },
  red: { light: 'from-red-50 to-rose-100/70 border-red-200 text-red-950', dark: 'from-red-950/50 to-rose-900/30 border-red-700/70 text-red-100', accent: 'from-red-400 to-rose-500' },
  rose: { light: 'from-rose-50 to-pink-100/70 border-rose-200 text-rose-950', dark: 'from-rose-950/50 to-pink-900/30 border-rose-700/70 text-rose-100', accent: 'from-rose-400 to-pink-500' },
  slate: { light: 'from-slate-50 to-gray-100/70 border-slate-200 text-slate-900', dark: 'from-slate-900/60 to-gray-800/50 border-slate-700 text-slate-100', accent: 'from-slate-400 to-gray-500' },
  sky: { light: 'from-sky-50 to-blue-100/70 border-sky-200 text-sky-950', dark: 'from-sky-950/50 to-blue-900/30 border-sky-700/70 text-sky-100', accent: 'from-sky-400 to-blue-500' },
  teal: { light: 'from-teal-50 to-cyan-100/70 border-teal-200 text-teal-950', dark: 'from-teal-950/50 to-cyan-900/30 border-teal-700/70 text-teal-100', accent: 'from-teal-400 to-cyan-500' },
  violet: { light: 'from-violet-50 to-purple-100/70 border-violet-200 text-violet-950', dark: 'from-violet-950/50 to-purple-900/30 border-violet-700/70 text-violet-100', accent: 'from-violet-400 to-purple-500' },
  yellow: { light: 'from-yellow-50 to-amber-100/70 border-yellow-200 text-yellow-950', dark: 'from-yellow-950/50 to-amber-900/30 border-yellow-700/70 text-yellow-100', accent: 'from-yellow-400 to-amber-500' },
};

export default function CategoryCard({
  category,
  language,
  onClick,
}: {
  category: { color?: string; name: Record<string, string>; duas: unknown[] };
  language: string;
  onClick: () => void;
}) {
  const { isDark } = useTheme();
  const colors = categoryColors[category.color || 'emerald'] || categoryColors.emerald;

  return (
    <button
      onClick={onClick}
      className={`group relative min-h-24 w-full overflow-hidden rounded-2xl border bg-gradient-to-br px-5 py-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 animate-fade-in ${
        isDark ? colors.dark : colors.light
      }`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.accent}`} aria-hidden="true" />
      <span className="flex items-center justify-between gap-3">
        <span className="text-base font-semibold leading-snug">{category.name[language] || category.name.en}</span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isDark ? 'bg-white/10 text-white/80' : 'bg-white/70 text-slate-600'
        }`}>
          {category.duas.length}
        </span>
      </span>
    </button>
  );
}
