import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '../components/config/storageKeys.js';
import {
  formatMoney,
  getProductOldPrice,
  getProductPrice,
} from '../utils/currency.js';

const CurrencyContext = createContext(null);

function readCurrency() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return value === 'USD' ? 'USD' : 'INR';
  } catch {
    return 'INR';
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => readCurrency());

  const setCurrency = useCallback((next) => {
    const value = next === 'USD' ? 'USD' : 'INR';
    setCurrencyState(value);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, value);
    } catch {
      // ignore
    }
  }, []);

  const formatPrice = useCallback(
    (productOrAmount) => {
      if (
        productOrAmount &&
        typeof productOrAmount === 'object' &&
        (productOrAmount.priceINR != null ||
          productOrAmount.priceUSD != null ||
          productOrAmount.price != null)
      ) {
        return formatMoney(getProductPrice(productOrAmount, currency), currency);
      }
      return formatMoney(productOrAmount, currency);
    },
    [currency]
  );

  const getPrice = useCallback(
    (product) => getProductPrice(product, currency),
    [currency]
  );

  const getOldPrice = useCallback(
    (product) => getProductOldPrice(product, currency),
    [currency]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      getPrice,
      getOldPrice,
      formatMoney: (amount) => formatMoney(amount, currency),
    }),
    [currency, setCurrency, formatPrice, getPrice, getOldPrice]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}

export default CurrencyContext;
