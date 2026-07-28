import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");

    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Failed to load cart from storage.", error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage.", error);
  }
};

const loadCheckoutItemFromStorage = () => {
  try {
    const item = localStorage.getItem("checkoutItem");

    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to load checkout item.", error);

    return null;
  }
};

const saveCheckoutItemToStorage = (item) => {
  try {
    localStorage.setItem("checkoutItem", JSON.stringify(item));
  } catch (error) {
    console.error("Failed to save checkout item.", error);
  }
};

const clearCheckoutStorage = () => {
  localStorage.removeItem("checkoutItem");
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    checkOutItem: loadCheckoutItemFromStorage(),
  },

  reducers: {
    checkout(state, action) {
      const { product, quantity = 1 } = action.payload;

      state.checkOutItem = {
        product,
        quantity,
      };

      saveCheckoutItemToStorage(state.checkOutItem);
    },

    clearCheckOutItem(state) {
      state.checkOutItem = null;

      clearCheckoutStorage();
    },

    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;

      const existingItem = state.cart.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + quantity,
          product.stock,
        );
      } else {
        state.cart.push({
          product,
          quantity: Math.min(quantity, product.stock),
        });
      }
      saveCartToStorage(state.cart);
    },

    removeFromCart(state, action) {
      state.cart = state.cart.filter(
        (item) => item.product.id !== action.payload,
      );
      saveCartToStorage(state.cart);
    },

    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.product.id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.product.stock));
      }
      saveCartToStorage(state.cart);
    },

    clearCart(state) {
      state.cart = [];
      saveCartToStorage(state.cart);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  checkout,
  clearCheckOutItem,
} = cartSlice.actions;

export default cartSlice.reducer;
