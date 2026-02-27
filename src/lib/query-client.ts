import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute - data considered fresh
      gcTime: 5 * 60 * 1000, // 5 minutes - cache garbage collection (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Retry failed requests once
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
})
