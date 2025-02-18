<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th>Index</th>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>{{ ++index }}</td>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.createdAt }}</td>
            <td>
              <button type="button" class="btn btn-warning btn-sm me-2">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button type="button" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import productApi from "@/api/productApi.js";

export default {
  name: "products",
  data() {
    return {
      products: [],
    }
  },
  mounted() {
    console.log("Component mounted.")
    this.getProducts();
  },

  methods: {
    getProducts() {
      productApi.getAll().then(response => {
        this.products = response;
      })
    }
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
</style>;