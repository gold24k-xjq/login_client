import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        evo_status: 1,//1列表点击报告，2提交测评跳转报告
        area_id: '',
    },
    mutations: {
        SETEVOSTATUS(state, status) {
            state.evo_status = status
        },
        SETAREA(state, id) {
            state.area_id = id
        },
    },
    actions: {
    },
    getters: {
    },
    modules: {
    }
})
