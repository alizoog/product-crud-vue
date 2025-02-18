<script setup>
import {RouterView} from 'vue-router'
</script>

<template>
  <header>

    <div class="wrapper mb-4">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
          <button class="btn btn-success">Add Product</button>
        </div>
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style>
body {
  background-color: #646777; /* Yoki boshqa fon stil */
}
</style>
