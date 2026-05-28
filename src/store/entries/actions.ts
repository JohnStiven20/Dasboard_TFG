import { createAction } from "@reduxjs/toolkit";

export const syncEntriesCachedAt = createAction<number | null>("entries/syncCachedAt");
