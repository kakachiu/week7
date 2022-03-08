<template>
  <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" v-if="temp.title" id="delProductModalLabel"><span>刪除產品</span></h5>
          <h5 class="modal-title" v-if="temp.create_at" id="delOrderModalLabel"><span>刪除訂單</span></h5>
          <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="temp.title"> 是否刪除<strong class="text-danger"> {{ temp.title }}</strong> 商品(刪除後將無法恢復)。</div>
        <div class="modal-body" v-if="temp.create_at"> 是否刪除<strong class="text-danger"> {{ temp.create_at }}</strong> 訂單(刪除後將無法恢復)。</div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">取消</button>
          <button class="btn btn-danger" type="button" v-if="temp.title" @click="delProduct(temp.id)">確認刪除</button>
          <button class="btn btn-danger" type="button" v-if="temp.create_at" @click="delOrder(temp.id)">確認刪除</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ['temp', 'delModel'],
  methods: {
    // 刪除單一產品
    delProduct (id) {
      this.axios
        .delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${id}`)
        .then(res => {
          alert(res.data.message)
          this.delModel.hide()
          this.$emit('getProducts')
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    },
    // 刪除單一訂單
    delOrder (id) {
      this.axios.delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${id}`)
        .then(res => {
          alert(res.data.message)
          this.delModel.hide()
          this.$emit('getOrders')
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    }
  }
}
</script>
