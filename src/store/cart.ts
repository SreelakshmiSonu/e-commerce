import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Product } from '../lib/types'

type CartState = {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (index: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => ({ items: [...state.items, product] })),
      removeItem: (index) =>
        set((state) => ({ items: state.items.filter((_, itemIndex) => itemIndex !== index) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'forma-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
