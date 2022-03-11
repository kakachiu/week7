<template>
  <div class="d-flex justify-content-end">
    <button type="button" class="btn btn-primary" @click="judgeModal('new')" >新增優惠券</button>
  </div>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col" >名稱</th>
        <th scope="col">折扣百分比</th>
        <th scope="col">到期日</th>
        <th scope="col">是否啟用</th>
        <th scope="col">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item) in coupons" :key="item.id">
        <td scope="row">{{ item.title }}</td>
        <td>{{ item.percent }}%</td>
        <td>{{ date(item.due_date) }}</td>
        <td>
          <div v-if="item.is_enabled" class="text-success">啟用</div>
          <div v-else class="text-danger">未啟用</div>
        </td>
        <td>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary" @click="judgeModal('edit',item)">編輯
            </button>
            <button type="button" class="btn btn-outline-danger" @click="judgeModal('delete',item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="mb-3">目前有 <span>{{ coupons.length }}</span> 張優惠券</p>
  <!-- 分頁-->
  <Pagination :pagination="pagination" @change-page="getCoupons"></Pagination>

  <!-- 新增&編輯 Modal -->
  <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true" ref="couponModal">
      <CouponModal :temp="temp" :coupon-modal="couponModal" @get-coupons="getCoupons"></CouponModal>
  </div>
  <!-- 刪除 Modal-->
  <div class="modal fade" id="delCouponModal" ref="delModel" tabindex="-1" aria-labelledby="delCouponModalLabel" aria-hidden="true">
    <DelModal :temp="temp" @get-coupons="getCoupons" :del-model="delModel"></DelModal>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import CouponModal from '@/components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  data () {
    return {
      coupons: [],
      pagination: {},
      temp: {
        title: '',
        is_enabled: 0,
        percent: 0,
        code: ''
      },
      couponModal: '',
      delModel: ''
    }
  },
  components: {
    CouponModal,
    DelModal,
    Pagination
  },
  methods: {
    // 取得優惠券
    getCoupons (page = 1) {
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`)
        .then(res => {
          this.coupons = res.data.coupons
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
    // 判斷 modal
    judgeModal (isNew, item) {
      switch (isNew) {
        case 'new':
          this.temp = {
            due_date: Math.floor(new Date().getTime() / 1000)
          }
          this.couponModal.show()
          break
        case 'edit':
          this.temp = { ...item }
          this.couponModal.show()
          break
        case 'delete':
          this.temp = { ...item }
          this.delModel.show()
          break
        default:
          break
      }
    }
  },
  created () {
    this.getCoupons()
  },
  mounted () {
    this.couponModal = new Modal(this.$refs.couponModal, {
      keyboard: false,
      backdrop: 'static'
    })
    this.delModel = new Modal(this.$refs.delModel, {
      keyboard: false,
      backdrop: 'static'
    })
  }
}
</script>
