import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Mobile Coffee Carts in Melbourne | The Bean Route',
  description: 'Filter and compare Melbourne\'s best mobile coffee carts by suburb, event type, and price. Free to inquire, no commitment.',
  openGraph: {
    title: 'Browse Mobile Coffee Carts in Melbourne | The Bean Route',
    description: 'Filter and compare Melbourne\'s best mobile coffee carts by suburb, event type, and price.',
    type: 'website',
    url: 'https://thebeanroute.com.au/app',
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
