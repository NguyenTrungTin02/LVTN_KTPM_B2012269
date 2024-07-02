import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore,FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist';
import userSlice from './user/userSlice';


const commonUserConfig = {
  key:'shop/user',
  storage
}


const userConfig = {
    ...commonUserConfig,
    whitelist:['isLoggedIn','token','current','currentCart']
}

export const store = configureStore({
  reducer: {
      app: appSlice,
      user: persistReducer(userConfig,userSlice)

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor= persistStore(store)
