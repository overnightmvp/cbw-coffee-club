import type { ServerFunctionClient } from 'payload'
import config from '@/payload.config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Create a root layout that replaces the parent layout
// This prevents duplicate html/body tags
export default function PayloadLayout({ children }: Args) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
          {children}
        </RootLayout>
      </body>
    </html>
  )
}
