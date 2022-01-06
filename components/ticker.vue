<template>
  <div class="marquee">
    <div class="fade-block fade-block__left">
    </div>
    <div class="as-seen-on">
      As seen on:
    </div>
    <transition name="fade">
    <div v-show="loaded">
      <marquee-text :repeat="2" :duration="90">
          <span class="ticker__item">
            <img class="ticker__img" src="/images/asSeenOn/Yahoo-News.png" alt="Yahoo News Logo"/>
          </span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Fox-News.png" alt="Fox News Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/CNN.png" alt="CNN Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/MSN.png" alt="MSN Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/NBC-News.png" alt="NBC News Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/People.png" alt="People Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/USA-Today.png" alt="USA Today Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Jimmy-Kimmel-Live.png" alt="Jimmy Kimmel Live Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/CBS-News.png" alt="CBS News Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Kelly-Clarkson-Show.png" alt="The Kelly Clarkson Show Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Food-Network.png" alt="Food Network Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Bravo.png" alt="Bravo Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Today-Show.png" alt="The Today Show Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Shape.png" alt="Shape Logo"/>
</span>
<!-- <span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Rolling-Stone.png" alt="Rolling Stone Logo"/>
</span> -->
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/HGTV.png" alt="HGTV Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Health.png" alt="Health Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Forbes.png" alt="Forbes Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Good-Morning-America.png" alt="Good Morning America Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/CNET.png" alt="CNET Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Vogue.png" alt="Vogue Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Essence.png" alt="Essence Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Allure.png" alt="Allure Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/New-York.png" alt="New York Magazine Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/GQ.png" alt="GQ Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Refinery29.png" alt="Refinery29 Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Wired.png" alt="Wired Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Parents.png" alt="Parents Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Good-Housekeeping.png" alt="Good Housekeeping Logo"/>
</span>
<span class="ticker__item">
  <img class="ticker__img" src="/images/asSeenOn/Martha-Stewart-Living.png" alt="Martha Stewart Living Logo"/>
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