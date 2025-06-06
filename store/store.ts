import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducerApp from '@/store/slice/app'
import reducerUser from '@/store/slice/user'

const persistConfigApp = {
  key: 'app',
  storage,
}
const persistConfigUser = {
  key: 'user',
  storage,
}

const persistedReducerApp = persistReducer(persistConfigApp, reducerApp)
const persistedReducerUser = persistReducer(persistConfigUser, reducerUser)
// const persistedReducerAdmin = persistReducer(persistConfigAdmin, reducerAdmin)

const rootReducer = combineReducers({
  app: persistedReducerApp,
  user: persistedReducerUser,
})


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    // .concat(thunk)
})

export const persistor = persistStore(store)
export type TypeRootState = ReturnType<typeof rootReducer>
