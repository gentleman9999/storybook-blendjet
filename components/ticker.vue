<template>
  <div class="marquee">
    <div class="fade-block fade-block__left"></div>
    <div class="as-seen-on">
      As seen on:
    </div>
    <div class="ticker__container">
      <marquee-text :repeat="2" :duration="90">
        <span v-for="image in imgList" :key="image.altText" class="ticker__item">
          <img class="ticker__img" :src="image.url" :alt="image.altText" />
        </span>
      </marquee-text>
    </div>
    <div class="fade-block fade-block__right"></div>
  </div>
</template>

<script>
export default {
  props: {
    imgList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      repeatTimes: 2,
      loaded: false
    }
  },

  mounted() {
    setTimeout(() => {
      this.loaded = true
    }, 1200)
  },

  components: {
    MarqueeText: () =>
      process.client
        ? import('vue-marquee-text-component')
        : Promise.resolve({ render: h => h('div') })
  }
}
</script>

<style scoped lang="scss">
.marquee {
  position: relative;
}

.fade-block {
  position: absolute;
  width: 75px;
  top: 0;
  bottom: 0;
  z-index: 20;

  &__left {
    left: 0;
    background: -moz-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -o-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -ms-linear-gradient(left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: linear-gradient(to left, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
  }

  &__right {
    right: 0;
    background: -moz-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -o-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: -ms-linear-gradient(right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
    background: linear-gradient(to right, rgba(58, 59, 120, 0) 0%, rgba(58, 59, 120, 1) 70%);
  }
}

.ticker__item {
  margin: 0px 45px;
  @include respond-to('small') {
    margin: 0 26px;
  }
}

.ticker__img {
  height: 40px;
}

.as-seen-on {
  width: 100%;
  font-size: $text-small;
  color: $secondary-purple-2;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  line-height: 1.17;
  text-align: center;
  margin-bottom: 24px;
}
</style>
