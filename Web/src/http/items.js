import $http from './index.js'

// 获取所有商品
export function getItems() {
    return $http.get('/items')
}

// 根据ID获取单个商品
export function getItemById(id) {
    return $http.get(`/items/${id}`)
}

// 添加新商品
export function addItem(data) {
    return $http.post('/items', data)
}

// 更新商品
export function updateItem(data) {
    return $http.post('/items/update', data)
}

// 删除单个商品
export function deleteItem(data) {
    return $http.post('/items/delete', data)
}

// 批量删除商品
export function batchDeleteItems(data) {
    return $http.post('/items/batchDelete', data)
}

// 搜索商品
export function searchItems(keyword) {
    return $http.get(`/items/search/${encodeURIComponent(keyword)}`)
}

// 图片上传
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)  // 字段名跟后端一致，这里是 'file'
  return $http.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 音频上传
export function uploadAudio(file) {
  const formData = new FormData()
  formData.append('file', file)
  return $http.post('/upload/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}


