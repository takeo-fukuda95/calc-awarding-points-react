import { configureStore } from '@reduxjs/toolkit';
import awardReducer from '../features/award/awardSlice';

export const store = configureStore({
  reducer: {
    award: awardReducer
  },
});
