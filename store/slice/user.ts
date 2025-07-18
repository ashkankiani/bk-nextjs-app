import { createSlice } from '@reduxjs/toolkit'
import { TypeApiPermission, TypeApiService, TypeApiUser } from '@/types/typeApiEntity'
import { TypeApiGetProvidersByServiceIdRes } from '@/types/typeApiUser'
import { TypeCart } from '@/app/(theme1)/reserve/TheReserveUi'

interface TypeInitialState {
  isLogin: boolean
  user: null | TypeApiUser
  permissions: TypeApiPermission | null
  searchQuery: {
    service: TypeApiService
    provider: TypeApiGetProvidersByServiceIdRes
    startDate: string
    endDate: string
  } | null
  cart: TypeCart[]
  order: any
}

const initialState = (): TypeInitialState => ({
  isLogin: false,
  user: null,
  permissions: null,
  searchQuery: null,
  cart: [],
  order: [],
})

export const sliceUser = createSlice({
  name: 'user',
  initialState: initialState(),
  reducers: {
    reducerUserReset: () => initialState(),
    setIsLogin: (state, action) => {
      state.isLogin = action.payload
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setCart: (state, action) => {
      state.cart = action.payload
    },
    deleteCart: (state, action) => {
      state.cart.splice(action.payload, 1)
    },
    setOrder: (state, action) => {
      state.order = action.payload
    },
  },
})

export const {
  reducerUserReset,
  setIsLogin,
  setUser,
  setPermissions,
  setSearchQuery,
  setCart,
  deleteCart,
  setOrder,
} = sliceUser.actions

export default sliceUser.reducer
