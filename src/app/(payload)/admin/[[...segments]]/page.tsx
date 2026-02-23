import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@/payload-config-promise'
import { importMap } from '../importMap.js'
import type { Metadata } from 'next'

import '@payloadcms/next/css'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams })

const Page = ({ params, searchParams }: Args) => {
  return RootPage({ config: configPromise, importMap, params, searchParams })
}

export default Page
