"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { getProductById, products } from "@/data/products";
import { getAvailability } from "@/lib/availability";
import type { Order, OrderContact, OrderShipping, Product } from "@/lib/types";

const STORAGE_KEY = "angel-wire-cart-v1";

type State = {
  itemIds: string[];
  soldIds: string[];
  lastOrder: Order | null;
  isDrawerOpen: boolean;
  /** True only once localStorage has been read. Gates the persist effect so
   *  the very first (empty, SSR-matching) render never clobbers real saved
   *  data — see the write-up in the conversation for why a ref alone isn't
   *  enough here. */
  isHydrated: boolean;
};

type Action =
  | { type: "ADD"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "HYDRATE"; state: Partial<State> }
  | { type: "CHECKOUT_COMPLETE"; order: Order };

const initialState: State = {
  itemIds: [],
  soldIds: [],
  lastOrder: null,
  isDrawerOpen: false,
  isHydrated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      // One-of-one rule: a product id can appear at most once. No quantity
      // field exists anywhere in this app for exactly this reason.
      if (state.itemIds.includes(action.id)) return state;
      const availability = getAvailability(getProductById(action.id)!, state.soldIds);
      if (availability === "sold") return state; // sold pieces can never be added
      return { ...state, itemIds: [...state.itemIds, action.id], isDrawerOpen: true };
    }
    case "REMOVE":
      return { ...state, itemIds: state.itemIds.filter((id) => id !== action.id) };
    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };
    case "TOGGLE_DRAWER":
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    case "HYDRATE":
      return { ...state, ...action.state, isHydrated: true };
    case "CHECKOUT_COMPLETE":
      return {
        ...state,
        soldIds: Array.from(new Set([...state.soldIds, ...action.order.items.map((p) => p.id)])),
        itemIds: [],
        lastOrder: action.order,
        isDrawerOpen: false,
      };
    default:
      return state;
  }
}

type CartContextValue = {
  items: Product[];
  itemIds: string[];
  soldIds: string[];
  count: number;
  subtotal: number;
  isDrawerOpen: boolean;
  lastOrder: Order | null;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isInBag: (id: string) => boolean;
  isSold: (product: Product) => boolean;
  completeCheckout: (contact: OrderContact, shipping: OrderShipping) => Order;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Read localStorage once, after mount — never during render, so the first
  // client render always matches the server (empty cart) and React never
  // reports a hydration mismatch. The brief flash from 0 to the real count
  // on a hard refresh is the accepted tradeoff for that.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({
          type: "HYDRATE",
          state: {
            itemIds: Array.isArray(parsed.itemIds) ? parsed.itemIds : [],
            soldIds: Array.isArray(parsed.soldIds) ? parsed.soldIds : [],
            lastOrder: parsed.lastOrder ?? null,
          },
        });
        return;
      }
    } catch {
      // corrupt or inaccessible storage — fall through to an empty, hydrated cart
    }
    dispatch({ type: "HYDRATE", state: {} });
  }, []);

  // Persist on every change, but only after hydration has actually landed —
  // otherwise this fires on the initial empty render and overwrites
  // whatever was just read above.
  useEffect(() => {
    if (!state.isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          itemIds: state.itemIds,
          soldIds: state.soldIds,
          lastOrder: state.lastOrder,
        })
      );
    } catch {
      // storage unavailable (private mode, quota) — cart still works for the session
    }
  }, [state.isHydrated, state.itemIds, state.soldIds, state.lastOrder]);

  const addItem = useCallback((id: string) => dispatch({ type: "ADD", id }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);

  const isSold = useCallback(
    (product: Product) => getAvailability(product, state.soldIds) === "sold",
    [state.soldIds]
  );
  const isInBag = useCallback((id: string) => state.itemIds.includes(id), [state.itemIds]);

  const items = useMemo(
    () => state.itemIds.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p)),
    [state.itemIds]
  );
  const subtotal = useMemo(() => items.reduce((sum, p) => sum + p.price, 0), [items]);

  const completeCheckout = useCallback(
    (contact: OrderContact, shipping: OrderShipping): Order => {
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        items,
        subtotal,
        placedAt: Date.now(),
        contact,
        shipping,
      };
      dispatch({ type: "CHECKOUT_COMPLETE", order });
      return order;
    },
    [items, subtotal]
  );

  const value: CartContextValue = {
    items,
    itemIds: state.itemIds,
    soldIds: state.soldIds,
    count: state.itemIds.length,
    subtotal,
    isDrawerOpen: state.isDrawerOpen,
    lastOrder: state.lastOrder,
    addItem,
    removeItem,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    isInBag,
    isSold,
    completeCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Re-exported so pages/components that only need the catalogue don't have to
// import from both data/products and context/CartContext.
export { products };
