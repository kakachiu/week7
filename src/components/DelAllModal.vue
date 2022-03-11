<template>
  <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="delAllOrderModal" v-if="delText==='delAll'"><span>刪除訂單</span></h5>
          <h5 class="modal-title" id="delAllCartModal" v-else><span>刪除購物車</span></h5>
          <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="delText==='delAll'"><strong class="text-danger">是否刪除全部訂單</strong>(刪除後將無法恢復)。</div>
        <div class="modal-body" v-else> 是否刪除<strong class="text-danger">全部購物車</strong> (刪除後將無法恢復)。</div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">取消</button>
          <button class="btn btn-danger" type="button" v-if="delText==='delAll'" @click="delAllOrder">確認刪除</button>
          <button class="btn btn-danger" type="button" v-else >確認刪除</button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ['delText'],
  methods: {
    delAllOrder () {
      this.emit('delAllOrder')
    }
  }
}
</script>
