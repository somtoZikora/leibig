// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
// Note: next-sanity/live is not available in the current version
// import { defineLive } from "next-sanity/live";
import { client } from './client'

// Fallback exports when live mode is not available
export const sanityFetch = client.fetch.bind(client)
export const SanityLive = () => null
