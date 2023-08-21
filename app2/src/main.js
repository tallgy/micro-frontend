import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'
import singleSpaLeakedGlobals from 'single-spa-leaked-globals';

Vue.config.productionTip = false
const leakedGlobalsLifecycles = singleSpaLeakedGlobals({
  globalVariableNames: ['a'],
})

const appOptions = {
  el: '#microApp',
  router,
  render: h => h(App)
}

// 支持应用独立运行、部署，不依赖于基座应用
if (!window.singleSpaNavigate) {
  delete appOptions.el
  new Vue(appOptions).$mount('#app')
}

// 基于基座应用，导出生命周期函数
const vueLifecycle = singleSpaVue({
  Vue,
  appOptions
})

export const bootstrap = [
  leakedGlobalsLifecycles.bootstrap,
  (props) => {
    console.log('app1 bootstrap')
    // return 
    return vueLifecycle.bootstrap(() => {})
  }
] 

export const mount = [
  leakedGlobalsLifecycles.mount,
  (props) => {
    console.log('app1 mount')
    // 简单的描述了 mount 方法的实现机制
    // return new Vue(appOptions)
    return vueLifecycle.mount(() => {})
  }
] 

export const unmount = [
  leakedGlobalsLifecycles.unmount,
  (props) => {
    console.log('app1 unmount')
    return vueLifecycle.unmount(() => {})
  }
] 
