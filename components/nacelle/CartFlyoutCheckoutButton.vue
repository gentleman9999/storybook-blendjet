<template>
  <div
    class="checkout-button" role="button"
    :class="{ 'is-loading': loading }"
    @click="checkout"
    
  >
    {{ checkoutText }}
    <span class="subtotal" v-if="cartSubtotal > 0 && showPrice && displayPrice">&nbsp;—&nbsp;{{displayPrice}}</span>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Axios from 'axios'
export default {
  props: {
    checkoutText: {
      type: String,
      default: 'Checkout'
    },
    showPrice: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      displayPrice: 0
    }
  },
  watch: {
    cartSubtotal() {
      this.getDisplayPrice()
    }
  },
  async mounted() {
    this.getDisplayPrice()
  },
  computed: {
    ...mapGetters('cart', ['cartSubtotal']),
     ...mapState('cart', ['lineItems'])
  },
  methods: {
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('checkout', ['processCheckout']),
    async getDisplayPrice() {
      
      let _price = this.cartSubtotal;

      let priceData = []

      this.lineItems.forEach((item) => {
        priceData.push({
          "Price": item.variant.price,
          "Tag": atob(item.variant.id).split('/').pop()
        })
      })
      
      const price = encodeURIComponent(JSON.stringify(
          priceData
        ))
      
      const config = {
        method: 'get',
        url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
      }
      const localPrice = await Axios(config)
        .then((res) => {
          if(!res.data.ConsumerPrices[0]) {
            this.displayPrice = `${res.data.Symbol}${_price.toFixed(2)}`
          } else {
            let localSubtotal = res.data.ConsumerPrices.reduce((acc, item, i) => {
              let quantTotal = Number(item * this.lineItems[i].quantity)
              return acc + quantTotal
            }, 0)
            this.displayPrice = `${res.data.Symbol}${localSubtotal.toFixed(2)}`
          }

          this.$emit('Country', res.data.Country)
          this.$emit('DisplayPrice', this.displayPrice)
         
        })
        .catch((res) => {
          console.error('Currency Request Failed', res)
          this.displayPrice = `$${this._price}`
        })
    },
    async checkout() {
      this.loading = true
      try {
        await this.processCheckout({
          async beforeCreate() {
            // Allows processing of cart before checkout creation.
          },
          async beforeRedirect() {
            // Allows processing after checkout create and before redirecting.
          }
        })
      } catch(err) {
        console.log(err)
        this.setCartError(err)
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout-button {
  @include button-primary('purple');
  height: 50px;
}

.subtotal {
  // margin-left: 7px;
}
</style>
