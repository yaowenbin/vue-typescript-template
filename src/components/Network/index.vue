<template>
  <div id="app">
    <div v-if="!networkSuccess">
      <h3>我没网了</h3>
      <div @click="onRefresh">刷新</div>
    </div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'network'
})

export default class extends Vue {
  get networkSuccess () {
    return SettingsModule.networkSuccess
  }
  private onRefresh () {
    this.$router.replace('/refresh')
  }
}
</script>
