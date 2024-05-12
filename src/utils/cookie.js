export const createCookie = (name,value) => {
  return localStorage.setItem(name, value)
}

export const getCookie = (name) => {
  return localStorage.getItem(name) // => 'value'
}

export const removeCookie = (name) => {
  return localStorage.removeItem(name)
}