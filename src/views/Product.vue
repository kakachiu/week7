<template>
  <div>單一產品頁</div>
  <h2> {{ product.title }} </h2>
  <img :src="product.imageUrl" alt="">
  <p> {{ product.description }}</p>
</template>

<script>
export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      const id = this.$route.params.id // 取得當前產品 ID
      this.axios.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`)
        .then(res => {
          this.product = res.data.product
        })
        .catch(error => {
          alert(error.response.data.message)
        })
    }
  },
  created () {
    this.getProduct()
  }
}
</script>
