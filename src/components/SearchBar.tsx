export default function SearchBar({
  searchQuery,
  setSearchQuery,
  language,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  language: string;
}) {
  const placeholder = language === 'en' ? 'Search duas by name or translation...' :
    language === 'ar' ? 'ابحث عن الأدعية بالاسم أو الترجمة...' :
    language === 'ur' ? 'نام یا ترجمہ سے دعائیں تلاش کریں...' :
    language === 'fr' ? 'Rechercher des duas par nom ou traduction...' :
    language === 'tr' ? 'İsim veya çeviriye göre dua ara...' :
    language === 'id' ? 'Cari doa berdasarkan nama atau terjemahan...' :
    language === 'bn' ? 'নাম বা অনুবাদ দিয়ে দোয়া খুঁজুন...' :
    language === 'ms' ? 'Cari doa berdasarkan nama atau terjemahan...' :
    language === 'ta' ? 'பெயர் அல்லது மொழிபெயர்ப்பால் துஆக்களைத் தேடுங்கள்...' :
    'പേര് അല്ലെങ്കിൽ വിവർത്തനം അനുസരിച്ച് ദുആകൾ തിരയുക...';

  return (
    <div className="flex-1 min-w-0">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`box-border h-[46px] w-full rounded-[13px] border border-[rgba(230,198,107,0.35)] bg-[var(--bisme-search)] px-[13px] font-sans text-[14px] font-normal text-white placeholder:text-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bisme-gold)] ${
            searchQuery ? 'pr-16' : 'pr-[13px]'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-[13px] text-sm text-white/70 hover:text-white"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
