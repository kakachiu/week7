<template>
  <div class="d-flex justify-content-end">
    <button type="button" class="btn btn-danger"  @click="judgeModal('delAll')">刪除全部訂單</button>
  </div>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col" width="120">購買時間</th>
        <th scope="col">Email</th>
        <th scope="col">購買品項</th>
        <th scope="col">應付金額</th>
        <th scope="col">付款狀態</th>
        <th scope="col">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in orders" :key="item.id">
        <td>{{ date(item.create_at)}}</td>
        <td>{{ item.user.email }}</td>
        <td>
          <ul class="productList">
            <li v-for="product in item.products" :key="product.id">
              {{ product.product.title }} {{product.qty}} {{ product.product.unit }}
            </li>
          </ul>
        </td>
        <td>{{ convertToAmount(item.total) }} 元</td>
        <td>
          <p class="text-success" v-if="item.is_paid">已付款</p>
          <p class="text-danger" v-else>未付款</p>
        </td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-outline-primary" @click="judgeModal('detail',item)">查看</button>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="judgeModal('delete',item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="mb-3">目前有 <span>{{ orders.length }}</span> 筆訂單</p>
  <!-- 分頁 -->
  <Pagination :pagination="pagination" @change-page="getOrders"></Pagination>

  <!--訂單 Modal-->
  <div class="modal fade" id="orderModal" ref="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
    <OrderModal :temp="temp" @get-orders="getOrders" :order-modal="orderModal"></OrderModal>
  </div>

  <!-- 刪除 Modal-->
  <div class="modal fade" id="delOrderModal" ref="delOrderModal" tabindex="-1" aria-labelledby="delOrderModalLabel" aria-hidden="true">
    <DelModal :temp="temp" @get-orders="getOrders" :del-model="delModel"></DelModal>
  </div>

  <!-- 刪除全部訂單 Modal -->
  <div class="modal fade" id="orderAllDel" ref="orderAllDel" tabindex="-1" aria-labelledby="orderAllDelLabel" aria-hidden="true">
    <DelAllModal :del-text="delText" @del-all-order="delAllOrder"></DelAllModal>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import Pagination from '@/components/Pagination.vue'
import DelModal from '@/components/DelModal.vue'
import OrderModal from '@/components/OrderModal.vue'
import DelAllModal from '@/components/DelAllModal.vue'

export default {
  data () {
    return {
      orders: [],
      pagination: {},
      temp: {},
      orderModal: '',
      delModel: '',
      orderAllDel: '',
      delText: '' // 刪除全部訂單文字
    }
  },
  components: {
    Pagination,
    DelModal,
    OrderModal,
    DelAllModal
  },
  methods: {
    // 取得訂單
    getOrders (page = 1) {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`)
        .then(res => {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    },
    // 日期
    date (date) {
      const newDate = new Date(date * 1000)
      const dateTime = `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`
      return dateTime
    },
    // $ 符號+千分位
    convertToAmount (num) {
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return '$' + parts.join('.')
    },
    // 判斷 modal
    judgeModal (isNew, item) {
      switch (isNew) {
        case 'detail':
          this.temp = { ...item }
          this.orderModal.show()
          break
        case 'delete':
          this.temp = { ...item }
          this.delModel.show()
          break
        case 'delAll':
          this.delText = isNew
          this.orderAllDel.show()
          break
        default:
          break
      }
    },
    // 刪除全部訂單
    delAllOrder () {
      this.axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders/all`)
        .then(res => {
          this.orderAllDel.show()
          alert(res.data.message)
          this.getOrders()
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    }
  },
  created () {
    this.getOrders()
  },
  mounted () {
    this.orderModal = new Modal(this.$refs.orderModal, {
      keyboard: false,
      backdrop: 'static'
    })
    this.delModel = new Modal(this.$refs.delOrderModal, {
      keyboard: false,
      backdrop: 'static'
    })
    this.orderAllDel = new Modal(this.$refs.orderAllDel, {
      keyboard: false,
      backdrop: 'static'
    })
  }
}
</script>

<style lang="sass">
.productList
  list-style-type: none
  padding-left: 0
</style>
