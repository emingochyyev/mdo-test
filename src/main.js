import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import Pagination from "vue-pagination-2";
import store from "../src/store/useStore";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.component("vuePagination", Pagination);

const token = localStorage.getItem("authToken");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
}

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
