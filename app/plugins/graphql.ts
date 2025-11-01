import { defineNuxtPlugin } from '#app'
import { createClient } from '@urql/core'
import { provideClient } from '@urql/vue'

function makeAuthFetchOptions(token?: string | null) {
  return () => ({
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // Primary client (e.g., Directus)
  const primaryUrl = String(config.public.directus?.url || '')
  const primaryToken = String(config.public.directus?.auth?.token || '') || null
  const primaryClient = primaryUrl
    ? createClient({ url: primaryUrl, fetchOptions: makeAuthFetchOptions(primaryToken) })
    : undefined

  // Secondary client (e.g., commerce)
  const secondaryUrl = String(config.public.commerceGraphql || '')
  const secondaryToken = String(config.public.commerceApiToken || '') || null
  const secondaryClient = secondaryUrl
    ? createClient({ url: secondaryUrl, fetchOptions: makeAuthFetchOptions(secondaryToken) })
    : undefined

  // Third client (e.g., wordpress)
  const thirdUrl = String(config.public.wpGraphql || '')
  const thirdToken = String(config.public.wordpressToken || '') || null
  const thirdClient = thirdUrl
    ? createClient({ url: thirdUrl, fetchOptions: makeAuthFetchOptions(thirdToken) })
    : undefined

  // Provide default client (primary) if present
  if (primaryClient) {
    provideClient(primaryClient)
  }

  // Only add clients that exist to global properties and injection
  const clients: Record<string, unknown> = {}
  if (primaryClient) clients.primary = primaryClient
  if (secondaryClient) clients.secondary = secondaryClient
  if (thirdClient) clients.third = thirdClient

  nuxtApp.vueApp.config.globalProperties.$urql = clients
  nuxtApp.provide('urqlClients', clients)
})
