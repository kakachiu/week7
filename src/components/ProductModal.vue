<template>
  <div>
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="productModalLabel"><span v-if="newTemp.id">編輯產品</span><span v-else>新增產品</span></h5>
            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-2">
                  <div class="mb-3">
                    <label class="form-label" for="imageUrl">輸入圖片網址</label>
                    <input class="form-control" type="text" placeholder="請輸入圖片連結" v-model="newTemp.imageUrl" />
                  </div><img class="img-fluid" :src="newTemp.imageUrl" alt="" />
                  <!-- 單圖上傳 input -->
                  <input type="file" class="mb-3"  ref="fileInput" @change="upload($event,'single')" >
                </div>
                <div v-if="newTemp.imagesUrl">
                  <!-- 跑 v-for 印出陣列內容-->
                  <h2 v-if="newTemp.imagesUrl.length">更多圖片</h2>
                  <div class="mb-1" v-for="(image, index) in newTemp.imagesUrl" :key="index">
                    <div class="mb-3">
                      <label class="form-label" for="imageUrl">圖片網址</label>
                      <input class="form-control mb-2" v-model="newTemp.imagesUrl[index]" type="text" placeholder="請輸入圖片連結" />
                    </div><img class="img-fluid mb-2" :src="image" />
                    <!-- 多圖上傳 input -->
                    <input type="file" class="mb-3" ref="morefileInput"  @change="upload($event,'morePic',index)" >
                    <input class="btn btn-outline-danger w-100" type="button" value="刪除圖片" @click="delImage(index)" />
                  </div>
                  <!-- 如果陣列為空或是當前陣列長度-1就顯示新增圖片按鈕-->
                  <div v-if="!newTemp.imagesUrl.length || newTemp.imagesUrl[newTemp.imagesUrl.length - 1]">
                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="newTemp.imagesUrl.push('')">新增圖片</button>
                  </div>
                </div>
                <!-- 當沒有 imagesUrl 陣列時顯示新增圖片按鈕-->
                <div v-else>
                  <button class="btn btn-outline-primary btn-sm d-block w-100 " @click="createImages">新增圖片</button>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label class="form-label" for="title">標題</label>
                  <input class="form-control" id="title" type="text" placeholder="請輸入標題" v-model="newTemp.title" />
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="category">分類</label>
                    <input class="form-control" id="category" type="text" placeholder="請輸入分類" v-model="newTemp.category" />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="price">單位</label>
                    <input class="form-control" id="unit" type="text" placeholder="請輸入單位" v-model="newTemp.unit" />
                  </div>
                </div>
                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="origin_price">原價</label>
                    <input class="form-control" id="origin_price" type="number" min="0" placeholder="請輸入原價" v-model.number="newTemp.origin_price" />
                  </div>
                  <div class="mb-3 col-md-6">
                    <label class="form-label" for="price">售價</label>
                    <input class="form-control" id="price" type="number" min="0" placeholder="請輸入售價" v-model.number="newTemp.price" />
                  </div>
                </div>
                <hr />
                <div class="mb-3">
                  <label class="form-label" for="description">產品描述</label>
                  <textarea class="form-control" id="description" type="text" placeholder="請輸入產品描述" v-model="newTemp.description">                    </textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="content">說明內容</label>
                  <textarea class="form-control" id="description" type="text" placeholder="請輸入說明內容" v-model="newTemp.content">                    </textarea>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" id="is_enabled" type="checkbox" :true-value="1" :false-value="0" v-model="newTemp.is_enabled" />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">取消</button>
            <button class="btn btn-primary" type="button" @click="checkEdit">確認</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newTemp: {}
    }
  },
  props: ['temp', 'productModal'],
  // eslint 不允許使用 props 傳入的值直接使用在 v-model 上面，將傳入的值存到新變數上並持續監聽
  watch: {
    temp () {
      this.newTemp = JSON.parse(JSON.stringify(this.temp))
    }
  },
  methods: {
    upload (e, value, index) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)

      this.axios
        .post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/upload`, formData)
        .then(res => {
          alert('上傳成功')
          if (value === 'single') {
            this.newTemp.imageUrl = res.data.imageUrl // 單圖
            this.$refs.fileInput.value = '' // 清空值
          } else {
            this.newTemp.imagesUrl[index] = res.data.imageUrl // 多圖
            this.$refs.morefileInput[index].value = ''
            this.$refs.morefileInput.value = '' // 清空值
          }
        })
        .catch(() => {
          alert('上傳失敗')
        })
    },
    createImages () {
      this.newTemp.imagesUrl = []
      this.newTemp.imagesUrl.push('')
    },
    delImage (id) {
      this.newTemp.imagesUrl.splice(id, 1)
    },
    checkEdit () {
      if (!this.newTemp.id) {
        this.axios
          .post(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/`, { data: this.newTemp })
          .then(res => {
            alert(res.data.message)
            this.productModal.hide()
            this.$emit('getProducts')
          })
          .catch(error => {
            alert(error.response.data.message)
          })
      } else {
        this.axios
          .put(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.newTemp.id}`, {
            data: this.newTemp
          })
          .then(res => {
            alert(res.data.message)
            this.productModal.hide()
            this.$emit('getProducts')
          })
          .catch(error => {
            alert(error.response.data.message)
          })
      }
    }
  }
}
</script>
