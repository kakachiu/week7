<template>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>訂單細節</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-4">
            <h3>用戶資料</h3>
            <table class="table">
              <tbody v-if="newTemp.user">
                <tr>
                  <th style="width: 100px">姓名</th>
                  <td>{{ newTemp.user.name }}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{{ newTemp.user.email }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ newTemp.user.tel }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ newTemp.user.address }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-8">
            <h3>訂單細節</h3>
            <table class="table">
              <tbody>
                <tr>
                  <th style="width: 100px">訂單編號</th>
                  <td>{{ newTemp.id }}</td>
                </tr>
                <tr>
                  <th>下單時間</th>
                  <td>{{ date(newTemp.create_at) }}</td>
                </tr>
                <tr>
                  <th>付款時間</th>
                  <td>
                    <span v-if="newTemp.paid_date">
                      {{ date(newTemp.paid_date) }}
                    </span>
                    <span v-else>時間不正確</span>
                  </td>
                </tr>
                <tr>
                  <th>付款狀態</th>
                  <td>
                    <strong v-if="newTemp.is_paid" class="text-success"
                      >已付款</strong
                    >
                    <span v-else class="text-muted">尚未付款</span>
                  </td>
                </tr>
                <tr>
                  <th>總金額</th>
                  <td>
                    {{ convertToAmount(newTemp.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <h3>選購商品</h3>
            <table class="table">
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                <tr v-for="item in newTemp.products" :key="item.id">
                  <th>
                    {{ item.product.title }}
                  </th>
                  <td>{{ item.qty }} / {{ item.product.unit }}</td>
                  <td class="text-end">
                    {{ convertToAmount(item.final_total) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-end">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  v-model="newTemp.is_paid"
                />
                <label class="form-check-label" for="flexCheckDefault">
                  <span v-if="newTemp.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="edidPay(newTemp.id)"
        >
          修改付款狀態
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newTemp: {
        total: ''
      }
    }
  },
  props: ['temp', 'orderModal'],
  // 將傳進來的值賦予到新變數內並持續監聽它
  watch: {
    temp () {
      this.newTemp = JSON.parse(JSON.stringify(this.temp))
    }
  },
  methods: {
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
    // 編輯訂單
    edidPay (id) {
      this.axios.put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${id}`, { data: this.newTemp })
        .then(res => {
          alert(res.data.message)
          this.orderModal.hide()
          this.$emit('getOrders')
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    }
  }
}
</script>
