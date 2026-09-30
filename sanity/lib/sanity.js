import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'sqk19c1z',
  dataset: 'production',
  apiVersion: '2026-03-01',
  useCdn: true,
})