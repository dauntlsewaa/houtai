import { getReportData } from '@/api/data'
const state = {
  reportData: {}
}

const mutations = {
  SET_REPORT_DATA (state, reportData) {
    state.reportData = reportData
  }
}

const actions = {
  // 获取mock的数据
  async getReportData ({ commit }) {
    const result = await getReportData()
    const reportData = result.data
    commit('SET_REPORT_DATA', reportData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}