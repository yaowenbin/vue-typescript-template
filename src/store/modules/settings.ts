
import store from '@/store'
import elementVariables from '@/styles/element-variables.scss'

import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule
} from 'vuex-module-decorators'

export interface ISettingsState {
  theme: string; // 主题色
  networkSuccess:boolean; // 网络状态：断网为false,联网为true
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements ISettingsState {
  public theme = elementVariables.theme;
  public networkSuccess = false;

  @Mutation
  private CHANGE_SETTING (payload: { key: string; value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public ChangeSetting (payload: { key: string; value: any }) {
    this.CHANGE_SETTING(payload)
  }
}

export const SettingsModule = getModule(Settings)
