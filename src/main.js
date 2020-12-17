import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import gsap from "gsap";
import Draggable from "@/modules/gsap/Draggable";
import InertiaPlugin from "@/modules/gsap/InertiaPlugin";
gsap.registerPlugin(Draggable, InertiaPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
