import { getUserInfo, login, logout } from '@/api/users'
import { getShoppingCart } from '@/api/shop'

import { resetRouter } from '@/router'

import {
  getToken,
  removeToken,
  setToken,
  getUser,
  setUser,
  removeUser
} from '@/utils/cookies'

import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'

import store from '@/store'

export interface IUserState {
  token: string;
  userInfo: object;
  name: string;
  avatar: string;
  city: string;
  userId: string;
  shopCart: object;
  showLogin: boolean;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || '';
  public userInfo = JSON.parse(getUser()) || {};
  public shopCart = [];
  public showLogin = false;
  public name = '';
  public avatar = '';
  public city = '';
  public userId = '';

  @Mutation
  private SET_TOKEN (token: string) {
    this.token = token
  }

  @Mutation SET_USER (obj: object) {
    this.userInfo = obj
  }

  @Mutation SET_SHOP (list: []) {
    this.shopCart = list
  }

  @Mutation SHOW_LOGIN (type: boolean) {
    this.showLogin = type
  }

  @Action
  public async Login (userInfo: {
    loginName: string;
    password: string;
    autoLogin: number;
  }) {
    try {
      const { loginName, password, autoLogin } = userInfo
      const name = loginName.trim()
      const { data } = await login({ loginName: name, password, autoLogin })

      setToken(data.token)
      this.SET_TOKEN(data.token)

      this.GetUserInfo()
      this.GetUserShop()

      this.SHOW_LOGIN(false)
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public changeToken (token: string) {
    this.SET_TOKEN(token)
  }

  @Action
  public ResetToken () {
    removeToken()
    this.SET_TOKEN('')
    removeUser()
    this.SET_USER({})
  }

  @Action
  public LoginMask (type: boolean) {
    this.SHOW_LOGIN(type)
  }

  @Action
  public async GetUserInfo () {
    try {
      const { data } = await getUserInfo({})
      this.SET_USER(data)

      setUser(data)
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public async GetUserShop () {
    try {
      const { data } = await getShoppingCart({ userId: this.userId })
      this.SET_SHOP(data.cartList)
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public async LogOut () {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    this.ResetToken()
    resetRouter()
  }
}

export const UserModule = getModule(User)
