<template>
  <span v-if="symbol === null" :class="priceStyle">{{ displayPrice + ' ' + currency }}</span>
  <span v-else :class="priceStyle">{{ symbol + displayPrice }}</span>
</template>

<script>
import Vue from 'vue'
// import VueCurrencyFilter from 'vue-currency-filter'
import axios from 'axios'
// Vue.use(VueCurrencyFilter)
export default {
  props: {
    price: [String, Number],
    currencyCode: {
      type: String,
      default: 'USD'
    },
    showCurrencyCode: {
      type: Boolean,
      default: false
    },
    strikethrough: {
      type: Boolean,
      default: false
    },
    variantId: {
      type: String,
      default: ''
    },
    styleClass: {}
  },
  data() {
    return {
      displayPrice: 0,
      symbol: ''
    }
  },
  watch: {
    price() {
      this.getPrice()
    }
  },
  computed: {
    priceStyle() {
      return {
        productPrice: true,
        nacelle: true,
        'strikethrough-price': this.strikethrough
      }
    }
  },
  async mounted() {
    this.getPrice()
  },

  methods: {
    async getPrice() {
      const vm = this

      // If no variant provided, and price is non-numerical, bail
      if (!vm.variantId.length && isNaN(vm.price)) {
        return
      }

      let priceData = [
        {
          Price: vm.price
        }
      ]

      if (vm.variantId.length) {
        let decodedVariantId = atob(this.variantId)
          .split('/')
          .pop()
        if (this.strikethrough) {
          decodedVariantId += ':compare'
        }
        priceData[0]['Tag'] = decodedVariantId
      }
      const price = encodeURIComponent(JSON.stringify(priceData))
      /*
        const config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
        }
*/

      //START OF RYAN MOD to override currency

      //if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      if (document.cookie.includes('_rchcur')) {
        var config = {
          method: 'get',
          url:
            `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=` +
            document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
            `&MerchantPrices=${price}`
        }
      } else {
        var config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
        }
      }
      //END OF RYAN MOD

      await axios(config)
        .then(res => {
          if (!res.data.ConsumerPrices[0]) {
            vm.displayPrice = Number(vm.price).toFixed(2)
          } else {
            vm.displayPrice = res.data.ConsumerPrices[0]
          }

          vm.symbol = res.data.Symbol
          vm.currency = res.data.Currency
          vm.$emit('Country', res.data.Country)
          vm.$emit('DisplayPrice', vm.displayPrice)
          vm.$emit('Currency', res.data.Currency)
          if (vm.strikethrough) {
            vm.$emit('CompareAtLocal', vm.displayPrice)
          }
        })
        .catch(res => {
          console.error('Currency Request Failed')
          console.error(res)
          vm.displayPrice = vm.price
          vm.symbol = '$'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-price {
  margin-bottom: 1rem;
}

.strikethrough-price {
  text-decoration: line-through;
  opacity: 0.3;
}
</style>
