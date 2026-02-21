import { RootLayout, RootPage } from '@payloadcms/next/layouts'
import React from 'react'
import configPromise from '@/payload.config'
import { Metadata } from 'next'

import '@payloadcms/next/css'

export const metadata: Metadata = {
  title: 'The Bean Route CMS',
  description: 'Blog content management system',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <RootLayout config={configPromise}>{children}</RootLayout>
}

const Page = ({ params, searchParams }: any) => {
  return <RootPage config={configPromise} params={params} searchParams={searchParams} />
}

export default Page
