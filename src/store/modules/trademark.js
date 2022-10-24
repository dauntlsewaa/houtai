
import { reqTrademark } from '@/api/product/trademark'

const state = () => {
    return {
        total: 0,//总页码
        records: [],//表格数据
    }
}

const mutations = {
    // 页码和表格数据
    GETTRADEMARK(state, data) {
        state.total = data.total
        state.records = data.records
    }

}

const actions = {
    // 请求品牌数据
    async getTrademark({ commit, dispatch, state }, { page, limit }) {
        let result = await reqTrademark(page, limit)
        if (result.code === 200) {
            commit('GETTRADEMARK', result.data)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}