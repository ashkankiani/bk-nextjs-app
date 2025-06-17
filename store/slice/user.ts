import {createSlice} from '@reduxjs/toolkit'
import {TypeApiUser, TypeApiPermissions} from "@/types/typeApiAdmin";

interface TypeInitialState {
  isLogin: boolean
  user: null | TypeApiUser
  permissions: TypeApiPermissions | null
  searchQuery: any
  cart: any
  order: any
}

const initialState = (): TypeInitialState => ({
  isLogin: false,
  user: null,
  permissions: null,
  searchQuery: [],
  cart: [],
  order: []
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
