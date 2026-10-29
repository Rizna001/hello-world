import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BookmarkedDua {
  id: string;
  categoryId: string;
  title: Record<string, string>;
  arabic: string;
  translation: Record<string, string>;
  reference: string;
  times: number;
  bookmarkedAt: number;
}

interface BookmarksContextType {
  bookmarks: BookmarkedDua[];
  isBookmarked: (duaId: string) => boolean;
  toggleBookmark: (dua: BookmarkedDua) => void;
  removeBookmark: (duaId: string) => void;
  clearAllBookmarks: () => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedDua[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (duaId: string) => {
    return bookmarks.some(b => b.id === duaId);
  };

  const toggleBookmark = (dua: BookmarkedDua) => {
    if (isBookmarked(dua.id)) {
      removeBookmark(dua.id);
    } else {
      setBookmarks(prev => [...prev, { ...dua, bookmarkedAt: Date.now() }]);
    }
  };

  const removeBookmark = (duaId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== duaId));
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearAllBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarksProvider');
  return context;
}
