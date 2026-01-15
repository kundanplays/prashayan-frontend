import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

// Define a type for adding items that doesn't require quantity
export type AddCartItem = Omit<CartItem, 'quantity'>;

interface CartStore {
    items: CartItem[];
    couponCode: string | null;
    discount: number; // Percentage as decimal (e.g., 0.9999 for 99.99% off)
    addItem: (item: AddCartItem) => void;
    removeItem: (id: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    subtotal: () => number;
    applyCoupon: (code: string) => boolean;
    removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            couponCode: null,
            discount: 0,

            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    // Cast item as CartItem with quantity 1
                    set({ items: [...currentItems, { ...item, quantity: 1 } as CartItem] });
                }
            },

            removeItem: (id) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === id);

                if (existingItem && existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                        ),
                    });
                } else {
                    set({ items: currentItems.filter((i) => i.id !== id) });
                }
            },

            removeFromCart: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) {
                    get().removeFromCart(id);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

            applyCoupon: (code) => {
                if (code.toUpperCase() === 'NEW99') {
                    set({ couponCode: code.toUpperCase(), discount: 0.9999 });
                    return true;
                }
                return false;
            },

            removeCoupon: () => set({ couponCode: null, discount: 0 }),

            subtotal: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },

            total: () => {
                const sub = get().subtotal();
                const disc = sub * get().discount;
                return sub - disc;
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
