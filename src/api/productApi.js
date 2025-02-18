import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/products'

 const productApi = {
    async getAll(page = 1, size = 10, search = '') {
        const response = await axios.post(`${BASE_URL}/list?search=${search}`, {
             page, size
        })
        return response.data
    },

     // async getAll() {
     //    return  await axios.get(`${BASE_URL}/users`)
     // },



    async getById(id) {
        const response = await axios.get(`${BASE_URL}/${id}`)
        return response.data
    },

    async create(product) {
        const response = await axios.post(`${BASE_URL}`, product)
        return response.data
    },

    async update(id, product) {
        const response = await axios.put(`${BASE_URL}/${id}`, product)
        return response.data
    },

    async delete(id) {
        await axios.delete(`${BASE_URL}/${id}`)
    }
}

export  default productApi;


