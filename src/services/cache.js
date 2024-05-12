import {createCache} from '@react-hook/cache'
// Creates a fetch cache w/ a max of 400 entries for JSON requests
export const fetchCache = createCache(async (key, options) => {
  const response = await fetch(key, options)
  return response.json()
}, 400)