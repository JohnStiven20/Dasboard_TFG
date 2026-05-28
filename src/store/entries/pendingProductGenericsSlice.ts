import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PendingProductGeneric } from "../../modules/entries/interface/ProductGenericEntry";
import { syncEntriesCachedAt } from "./actions";

const THIRTY_MINUTES = 30 * 60 * 1000;


interface PendingProductGenericsState {
    items: PendingProductGeneric[],
    cachedAt: number | null;
}

const initialState: PendingProductGenericsState = {
    items: [],
    cachedAt: null,
};

export const pendingProductGenericsSlice = createSlice({
    name: "pendingProductGenerics",
    initialState,
    reducers: {
        addPendingProductGeneric(state, action: PayloadAction<PendingProductGeneric>) {

            const incomingGeneric = action.payload;
            const existingItem = state.items.find((item) => {
                return item.id === incomingGeneric.id && item.identifier === incomingGeneric.identifier;
            });

            if (!existingItem) {
                state.items.push(incomingGeneric);
                return;
            }

            existingItem.quantity += incomingGeneric.quantity;
        },
        clearPendingProductGenerics(state) {
            state.items = [];
        },
        removePendingProductGenericAtIndex(state, action: PayloadAction<number>) {
            const index = action.payload;
            if (index >= 0 && index < state.items.length) {
                state.items.splice(index, 1);
            }
        },

        decrementPendingProductGeneric(state, action: PayloadAction<number>) {
            const index = action.payload;
            const current = state.items[index];

            if (!current) return;

            if (current.quantity <= 1) {
                state.items.splice(index, 1);
                return;
            }

            current.quantity -= 1;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(syncEntriesCachedAt, (state, action) => {
            state.cachedAt = action.payload;
        });
    },
});

export const selectPendingProductGenericsCache = (state: { pendingProductGenerics: PendingProductGenericsState }) => {
    const { items: pendingProductGenerics, cachedAt } = state.pendingProductGenerics;
    const isValid = cachedAt !== null && Date.now() - cachedAt < THIRTY_MINUTES;
    return { pendingProductGenerics, isValid };
};

export const {
    addPendingProductGeneric,
    clearPendingProductGenerics,
    removePendingProductGenericAtIndex,
    decrementPendingProductGeneric
} = pendingProductGenericsSlice.actions;

export default pendingProductGenericsSlice;
