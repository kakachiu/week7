<template>
  <div class="container text-left mt-3">
    <div class="row py-3">
      <div class="col-md-12">
        <button class="btn btn-primary ms-auto" type="button" @click="judgeModal('new')">新增產品</button>
        <table class="table table-hover mt-4">
          <thead>
            <tr>
              <th width="150">產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="150">是否啟用</th>
              <th width="120">編輯</th>
              <th width="120">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td width="150">{{ item.title }}</td>
              <td width="120">{{ convertToAmount(item.origin_price) }} 元</td>
              <td width="120">{{ convertToAmount(item.price) }} 元</td>
              <td width="150">
                <span class="text-success" v-if="item.is_enabled">啟用</span>
                <span class="text-danger" v-else>未啟用</span></td>
              <td width="120">
                <button class="btn btn-primary" type="button" @click="judgeModal('edit',item)">編輯</button>
              </td>
              <td width="120">
                <button class="btn btn-outline-danger" type="button" @click="judgeModal('delete',item)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mb-3">目前有 <span>{{ products.length }}</span> 項產品</p>
        <!-- 分頁-->
        <Pagination :pagination="pagination" @change-page="getProducts"></Pagination>
      </div>
    </div>
  </div>
  <!-- 新增 & 修改 Modal-->
  <div class="modal fade" id="productModal" ref="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <ProductModals :temp="temp" @get-products="getProducts" :product-modal="productModal"></ProductModals>
  </div>
  <!-- 刪除 Modal-->
  <div class="modal fade" id="delProductModal" ref="delProductModal" tabindex="-1" aria-labelledby="delProductModalLabel" aria-hidden="true">
    <DelModal :temp="temp" @get-products="getProducts" :del-model="delModel"></DelModal>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal' // 載入 bootstrap modal
import Pagination from '@/components/Pagination.vue'
import DelModal from '@/components/DelModal.vue'
import ProductModals from '@/components/ProductModal.vue'

export default {
  data () {
    return {
      products: [],
      temp: {},
      pagination: {},
      productModal: '', // 使用 ref 取得 dom 元素，先定義資料
      delModel: '' // 使用 ref 取得 dom 元素，先定義資料
    }
  },
  components: {
    Pagination,
    DelModal,
    ProductModals
  },
  methods: {
    judgeModal (isNew, item) {
      switch (isNew) {
        case 'new':
          this.temp = {}
          this.productModal.show()
          break
        case 'edit':
          this.temp = { ...item }
          this.productModal.show()
          break
        case 'delete':
          this.temp = { ...item }
          this.delModel.show()
          break
        default:
          break
      }
    },
    getProducts (page = 1) {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`)
        .then(res => {
          this.products = res.data.products
          this.pagination = res.data.pagination
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    },
    // $ 符號+千分位
    convertToAmount (num) {
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return '$' + parts.join('.')
    }
  },
  created () {
    this.getProducts()
  },
  mounted () {
    // 使用 this.$refs 取得 dom 元素
    // 原本為 new bootstrap.Modal，改為 new Modal
    this.productModal = new Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: 'static'
    })
    this.delModel = new Modal(this.$refs.delProductModal, {
      keyboard: false,
      backdrop: 'static'
    })
  }
}
</script>
