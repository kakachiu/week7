<template>
  <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header bg-info">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="!newTemp.id">新增優惠卷</span>
            <span v-else>編輯優惠卷</span>
          </h5>
          <button type="button" class="btn-close"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title">標題</label>
            <input type="text" class="form-control" id="title" v-model="newTemp.title"
                placeholder="請輸入標題">
          </div>
          <div class="mb-3">
            <label for="coupon_code">優惠碼</label>
            <input type="text" class="form-control" id="coupon_code" v-model="newTemp.code" placeholder="請輸入優惠碼">
          </div>
          <div class="mb-3">
            <label for="due_date">到期日</label>
            <input type="date" class="form-control" id="due_date"
                v-model="due_date">
          </div>
          <div class="mb-3">
            <label for="price">折扣百分比</label>
            <input type="number" class="form-control" id="price"
            min="0"
                  v-model.number="newTemp.percent" placeholder="請輸入折扣百分比">
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="newTemp.is_enabled" id="is_enabled">
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="checkEdit">
              確認
          </button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ['temp', 'couponModal'],
  data () {
    return {
      newTemp: {},
      due_date: ''
    }
  },
  watch: {
    temp () {
      this.newTemp = this.temp
      // 將時間格式化 YYYY-MM-DD
      const dateAndTime = new Date(this.newTemp.due_date * 1000)
        .toISOString().split('T')
      // 使用 standard 遇到 [ 前面要加上 ;
      ;[this.due_date] = dateAndTime
    },
    // 監聽日期
    due_date () {
      this.newTemp.due_date = Math.floor(new Date(this.due_date) / 1000)
    }
  },
  methods: {
    // 新增與編輯優惠卷
    checkEdit () {
      if (!this.newTemp.id) {
        this.axios
          .post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`, { data: this.newTemp })
          .then(res => {
            alert(res.data.message)
            this.couponModal.hide()
            this.$emit('getCoupons')
          })
          .catch(error => {
            alert(error.response.data.message)
          })
      } else {
        this.axios
          .put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.temp.id}`, {
            data: this.newTemp
          })
          .then(res => {
            alert(res.data.message)
            this.couponModal.hide()
            this.$emit('getCoupons')
          })
          .catch(error => {
            alert(error.response.data.message)
          })
      }
    }
  }
}
</script>
