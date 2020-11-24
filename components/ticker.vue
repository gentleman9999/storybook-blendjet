<template>
  <div class="marquee">
    <div class="fade-block fade-block__left">
    </div>
    <div class="as-seen-on">
      As seen on:
    </div>
    <transition name="fade">
    <div v-show="loaded">
      <marquee-text :repeat="2" :duration="45">
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Boston-Globe.png" />
          </span>
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Cosmopolitan.png" />
          </span>
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/delish.png" />
          </span>
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Ellen.png" />
          </span>
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Essence.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Good-Housekeeping.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/HBO.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Health.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Kelly-Clarkson-Show.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Martha-Stewart-Living.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/New-York.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Silicon-Valley.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/The-Doctors.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Today.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Wired.png" />
          </span>
            <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Yahoo-News.png" />
          </span>
      </marquee-text>
    </div>
    </transition>
    <div class="fade-block fade-block__right">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    default: 'asSeenOn'
  },
  data() {
    return {
      repeatTimes: 2,
      loaded: false
    }
  },

  mounted() {

    setTimeout(()=>{
      this.loaded = true;
    }, 1200)
  },

  components: {
    MarqueeText: () =>
    process.client ? import('vue-marquee-text-component') : Promise.resolve({ render: (h) => h('div') }),
  },
}
</script>

<style scoped lang="scss">
.marquee {
  position: relative;
}

.fade-block {
  position: absolute;
  width: 75px;
  top:0;
  bottom: 0;
  z-index: 20;

  &__left {
    left: 0;
    background: -moz-linear-gradient(left,  rgba(58,59,120,0) 0%, rgba(58,59,120,1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(left,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: -o-linear-gradient(left,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: -ms-linear-gradient(left,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: linear-gradient(to left,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
  }

  &__right {
    right: 0;
    background: -moz-linear-gradient(right,  rgba(58,59,120,0) 0%, rgba(58,59,120,1) 70%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0)), color-stop(70%,rgba(255,255,255,1)));
    background: -webkit-linear-gradient(right,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: -o-linear-gradient(right,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: -ms-linear-gradient(right,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
    background: linear-gradient(to right,  rgba(58,59,120,0) 0%,rgba(58,59,120,1) 70%);
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