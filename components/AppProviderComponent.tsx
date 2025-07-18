'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function AppProviderComponent({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: STALE_TIME,
        // gcTime: GC_TIME,
      },
      mutations: {
        // ...NProgressRequest(),
      },
    },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer rtl={true} autoClose={5000} />
          {children}
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  )
}
