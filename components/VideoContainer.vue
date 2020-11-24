<template>
    <video :autoplay="autoplay" :loop="loop" muted="" webkit-playsinline="" playsinline="">
      <source :src="source" type="video/mp4">
    </video>
</template>

<script>
export default {
  props: {
    source: {
      type: String,
    },
    autoplay: {
      type: String,
      default: 'autoplay'
    },
    loop: {
      type: String,
      default: 'loop'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>