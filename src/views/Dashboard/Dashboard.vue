<template>
  <Navbar></Navbar>
  <div class="container mt-5">
    <!-- 如果驗證成功才出現 router-view 的內容 -->
    <router-view v-if="checkSuccess"></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
// 主要畫面是由 router-view 控制切換呈現的內容，可以利用 v-if 來控制是否有驗證成功，有就會呈現畫面出來
export default {
  data () {
    return {
      checkSuccess: false // 一剛開始預設為驗證不成功
    }
  },
  components: {
    Navbar
  },
  methods: {
    checkAuth () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.axios.defaults.headers.common.Authorization = token

      this.axios.post(`${process.env.VUE_APP_API}/api/user/check`)
        .then(() => {
          this.checkSuccess = true // 驗證成功就將 checkSuccess 改成 true
        })
        .catch(error => {
          alert(error.response.data.message)
          this.$router.push('/login') // 如果驗證不成功或是 token 過期就返回登入頁面
        })
    }
  },
  created () {
    this.checkAuth()
  }
}
</script>
