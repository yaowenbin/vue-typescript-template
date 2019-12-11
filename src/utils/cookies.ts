import Cookies from 'js-cookie'

// User
const tokenKey = 'access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)

const UserKey = 'User-Info'
export const setUser = (user: object) => Cookies.set(UserKey, user)
export const getUser = () => Cookies.get(UserKey) || '{}'
export const removeUser = () => Cookies.remove(UserKey)

const ShopKey = 'User-Shop'
export const setUserShopList = (shop: object) => Cookies.set(ShopKey, shop)
export const getUserShopList = () => Cookies.get(ShopKey)
export const removeUserShopList = () => Cookies.remove(ShopKey)

// 公共存储
export const setCommon = (common: string, content: object) =>
  Cookies.set(common, content)
export const getCommon = (common: string) => Cookies.get(common)
export const removeCommon = (common: string) => Cookies.remove(common)
