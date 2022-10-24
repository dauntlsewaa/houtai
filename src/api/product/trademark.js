import request from '@/utils/request'



// 品牌分页展示数据
export const reqTrademark = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)

// 添加品牌
export const reqAddAndSaveTrademark = (data) => {
    if (data.id) {
        return request.put('/admin/product/baseTrademark/update', data)
    } else {
        return request.post('/admin/product/baseTrademark/save', data)
    }
}

// 删除品牌
export const reqDeleteTrademark = (id)=>request.delete(`/admin/product/baseTrademark/remove/${id}`)