import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type IdentifiedProduct from "../../interface/entries/entries";
import { syncEntriesCachedAt } from "./actions";

const THIRTY_MINUTES = 30 * 60 * 1000;

interface PendingProductItemsState {
  items: IdentifiedProduct[];
  cachedAt: number | null;
}

const initialState: PendingProductItemsState = {
  items: [],
  cachedAt: null,
};

const pendingProductItemsSlice = createSlice({
  name: "pendingProductItems",
  initialState,
  reducers: {
    addPendingProductItem(state, action: PayloadAction<IdentifiedProduct>) {
      state.items.push(action.payload);
    },
    clearPendingProductItems(state) {
      state.items = [];
    },
    removePendingProductItemAtIndex(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncEntriesCachedAt, (state, action) => {
      state.cachedAt = action.payload;
    });
  },
});

export const selectPendingProductItemsCache = (state: { pendingProductItems: PendingProductItemsState }) => {
  const { items: pendingProductItems, cachedAt } = state.pendingProductItems;
  const isValid = cachedAt !== null && Date.now() - cachedAt < THIRTY_MINUTES;
  return { pendingProductItems, isValid };
};

export const {
  addPendingProductItem,
  clearPendingProductItems,
  removePendingProductItemAtIndex
} = pendingProductItemsSlice.actions;

export default pendingProductItemsSlice;
