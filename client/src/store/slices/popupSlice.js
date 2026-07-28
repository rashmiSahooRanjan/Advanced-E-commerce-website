import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
  },

  reducers: {
    // auth popup
    toggleAuthPopup(state) {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },

    openAuthPopup(state) {
      state.isAuthPopupOpen = true;
    },

    closeAuthPopup(state) {
      state.isAuthPopupOpen = false;
    },

    // sidebar
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    // search
    toggleSearchBar(state) {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },

    // cart
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    // ai modal
    toggleAIModal(state) {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },
  },
});

export const {
  toggleAuthPopup,
  openAuthPopup,
  closeAuthPopup,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
} = popupSlice.actions;

export default popupSlice.reducer;
