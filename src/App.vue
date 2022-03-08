<template>
  <router-view></router-view>
</template>

<script>
export default {
  watch: {
    $route (to) {
      const nowTitle = to.meta.title
      document.title = nowTitle
    }
  }
}
</script>

<style lang="scss">
@import "bootstrap";
</style>
