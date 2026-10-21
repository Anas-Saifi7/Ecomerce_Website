import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '../components/config/storageKeys.js';
import { useAuth } from './AuthContext.jsx';
import * as wishlistService from '../services/wishlistService.js';

const WishlistContext = createContext(null);

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
  window.dispatchEvent(new Event('wishlistUpdated'));
}

export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [ids, setIds] = useState(() => readLocal());
  const [syncing, setSyncing] = useState(false);

  const syncFromApi = useCallback(async () => {
    if (!isAuthenticated) return;
    setSyncing(true);
    try {
      const data = await wishlistService.getWishlist();
      const products = data.products || data.wishlist || [];
      const serverIds = products
        .map((p) => String(p._id || p.id || p))
        .filter(Boolean);
      const localIds = readLocal().filter((id) => /^[a-f\d]{24}$/i.test(id));
      const merged = new Set(serverIds);
      for (const id of localIds) {
        if (merged.has(id)) continue;
        try {
          await wishlistService.addToWishlist(id);
          merged.add(id);
        } catch {
          // Guest data can refer to products no longer present in MongoDB.
        }
      }
      const next = [...merged];
      setIds(next);
      writeLocal(next);
    } catch {
      // keep local
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      syncFromApi();
    } else {
      setIds(readLocal());
    }
  }, [authLoading, isAuthenticated, syncFromApi]);

  const isWishlisted = useCallback(
    (productId) => ids.includes(String(productId)),
    [ids]
  );

  const toggle = useCallback(
    async (productId) => {
      const id = String(productId);
      const exists = ids.includes(id);

      if (isAuthenticated) {
        if (exists) await wishlistService.removeFromWishlist(id);
        else await wishlistService.addToWishlist(id);
      }

      setIds((prev) => {
        const next = exists
          ? prev.filter((x) => x !== id)
          : [...prev, id];
        writeLocal(next);
        return next;
      });
    },
    [ids, isAuthenticated]
  );

  const value = useMemo(
    () => ({
      ids,
      syncing,
      isWishlisted,
      toggle,
      refresh: syncFromApi,
    }),
    [ids, syncing, isWishlisted, toggle, syncFromApi]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}

export default WishlistContext;
