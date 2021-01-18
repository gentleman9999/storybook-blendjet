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
    styleClass: {
      
    }
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

      let priceData = [
        {
          "Price": vm.price
        },
      ]

      if(vm.variantId.length) {
        let decodedVariantId = atob(this.variantId).split('/').pop()
        if(this.strikethrough) {
          decodedVariantId += ':compare'
        }
        priceData[0]["Tag"] = decodedVariantId
      }
      const price = encodeURIComponent(JSON.stringify(priceData))
/*
        const config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
        }
*/

        //RYAN MOD - Set cookie for USD_only if USD in the URL - for Google feed reviewers
        if (window.location.href.indexOf("USD") > -1) {
			document.cookie = 'USD_only';
        }
       
        //RYAN MOD - if cookie for USD_only is found - block Reach from changing the prices from USD - this is a hack that should be fixed
		if(!document.cookie.includes('USD_only')){
			var config = {
		    	method: 'get',
				url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
		    }
		}
		else {
			var config = null;
		}
		//END OF RYAN MOD

      let localPrice = await axios(config)
        .then((res) => {
          if(!res.data.ConsumerPrices[0]) {
            vm.displayPrice = Number(vm.price).toFixed(2)
          } else {
            vm.displayPrice = res.data.ConsumerPrices[0]
          }
          
          vm.symbol = res.data.Symbol
          vm.currency = res.data.Currency
          vm.$emit('Country',  res.data.Country)
          vm.$emit('DisplayPrice', vm.displayPrice)
          vm.$emit('Currency', res.data.Currency)
          if(vm.strikethrough) {
            vm.$emit('CompareAtLocal', vm.displayPrice)
          }
        })
        .catch((res) => {
          console.error('Currency Request Failed', res)
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
