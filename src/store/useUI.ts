"use client";

import { create } from "zustand";

interface UIState {
  searchOpen: boolean;
  cartOpen: boolean;
  menuOpen: boolean;
  filterOpen: boolean;
  setSearch: (v: boolean) => void;
  setCart: (v: boolean) => void;
  setMenu: (v: boolean) => void;
  setFilter: (v: boolean) => void;
  closeAll: () => void;
}

export const useUI = create<UIState>((set) => ({
  searchOpen: false,
  cartOpen: false,
  menuOpen: false,
  filterOpen: false,
  setSearch: (v) => set({ searchOpen: v, cartOpen: false, menuOpen: false }),
  setCart: (v) => set({ cartOpen: v, searchOpen: false, menuOpen: false }),
  setMenu: (v) => set({ menuOpen: v, searchOpen: false, cartOpen: false }),
  setFilter: (v) => set({ filterOpen: v }),
  closeAll: () => set({ searchOpen: false, cartOpen: false, menuOpen: false, filterOpen: false }),
}));
