import {createSlice} from '@reduxjs/toolkit'

const initialState = () => ({
    initTheme: 'light',
    setting: {},
    connection: {},
})

export const sliceApp = createSlice({
    name: 'app',
    initialState: initialState(),
    reducers: {
        reducerAppReset: () => initialState(),
        setInitTheme: (state, action) => {
            state.initTheme = action.payload
        },
        setSetting: (state, action) => {
            state.setting = action.payload
        },
        setConnection: (state, action) => {
            state.connection = action.payload
        },
    },
})

export const {
    reducerAppReset,
    setInitTheme,
    setSetting,
    setConnection,
} = sliceApp.actions

export default sliceApp.reducer
