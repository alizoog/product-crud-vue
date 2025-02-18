<template>
  <div class="container">
    <div class="wrapper mb-2">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <div class="d-flex w-100 justify-content-between">
            <form class="d-flex me-3" role="search" @submit.prevent="handleSearch">
              <input
                  v-model="searchQuery"
                  class="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
              >
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>

            <nav aria-label="Page navigation" class="me-3">
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                </li>
                <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === currentPage }"
                >
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>

            <button class="btn btn-success ms-auto" @click="openAddModal">Add Product</button>
          </div>
        </div>
      </nav>
    </div>
    <div class="card" style="margin-bottom: 20px">
      <div class="card-body">
        <table class="table table-bordered table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>{{ startIndex + index + 1}}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}$</td>
            <td>{{ product.createdAt }}</td>
            <td>
              <button
                  type="button"
                  class="btn btn-warning btn-sm me-2"
                  @click="openEditModal(product)">
                Edit
              </button>
              <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="openDeleteModal(product)">
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="modal fade" id="productModal" tabindex="-1" ref="productModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" id="productForm">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="form.name"
                    required
                >
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="form.price"
                    required
                    step="0.01"
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="submit" form="productForm" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this product?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Close</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {Modal} from "bootstrap";
import productApi from "@/api/productApi.js";
export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      productModal: null,
      deleteModal: null,
      isEditing: false,
      selectedProduct: null,
      form: {
        name: '',
        price: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    }
  },
  mounted() {
    this.productModal = new Modal(this.$refs.productModal);
    this.deleteModal = new Modal(this.$refs.deleteModal);
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      try {
        const response = await productApi.getAll(this.currentPage, this.pageSize, this.searchQuery);
        this.products = response.data;
        this.totalItems = response.metadata.totalItems;
        this.currentPage = response.metadata.currentPage;
        this.pageSize = response.metadata.pageSize;
      } catch (error) {
        console.error('Error loading products:', error);
      }
    },
    async handleSearch() {
      this.currentPage = 1;
      await this.loadProducts();
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.loadProducts();
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.form = {
        name: '',
        price: ''
      };
      this.productModal.show();
    },
    openEditModal(product) {
      this.isEditing = true;
      this.selectedProduct = product;
      this.form = {
        name: product.name,
        price: product.price
      };
      this.productModal.show();
    },
    openDeleteModal(product) {
      this.selectedProduct = product;
      this.deleteModal.show();
    },
    closeModal() {
      this.productModal.hide();
    },
    closeDeleteModal() {
      this.deleteModal.hide();
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await productApi.update(this.selectedProduct.id, this.form);
        } else {
          await productApi.create(this.form);
        }
        this.closeModal();
        await this.loadProducts();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    },
    async confirmDelete() {
      try {
        await productApi.delete(this.selectedProduct.id);
        this.closeDeleteModal();
        await this.loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
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