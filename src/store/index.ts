import Vue from 'vue'
import Vuex from 'vuex'

import { IUserState } from './modules/user'
import { ISettingsState } from './modules/settings'

Vue.use(Vuex)

// 统一对外声明state
export interface IRootState {
  user: IUserState;
  setting:ISettingsState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
