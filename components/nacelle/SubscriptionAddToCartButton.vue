<template>
  <div>
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      class="add-to-cart-button button nacelle"
      @click="addToCart"
    >
      <span
        v-if="
          !variantInLineItems && !allOptionsSelected && product.availableForSale
        "
      >Select Options</span>
      <span
        v-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems &&
            allOptionsSelected &&
            variant.availableForSale === false) ||
            !product.availableForSale
        "
      >Out of Stock</span>
      <span
        v-if="
          !variantInLineItems &&
            allOptionsSelected &&
            variant &&
            variant.availableForSale == true
        "
      >Add to Cart</span>
      <span v-if="variantInLineItems">Added!</span>
    </button>
   <button
      class="add-to-cart-button"
      :style="styleObj"
      @click="addToCart"
      v-else
      :disabled="disableAtcButton"
      :class="buttonClass"
    >
      <slot>
        <span v-if="!onlyOneOption && product.availableForSale"
          >Select Options</span
        >
        <span class="inner-text"
          v-if="subPrice"
          >{{buttonText}}</span
        >
        <span
          v-if="
            (!variantInLineItems &&
              allOptionsSelected &&
              variant == undefined) ||
              (!variantInLineItems &&
                allOptionsSelected &&
                variant.availableForSale === false) ||
              !product.availableForSale
          "
          >Out of Stock</span
        >
        <!-- <span v-if=""></span> -->
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import productMetafields from '~/mixins/productMetafields'
import Axios from 'axios'
// import ProductPrice from '~/components/nacelle/Pric'

export default {
  mixins: [productMetafields],
  props: {
    product: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bundle: {
      type: Array,
      default: () => []
    },
    variant: {
      type: Object,
      default: () => {
        return {}
      }
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },
    showPrice: {
      type: Boolean,
      default: false
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    quantity: { type: Number, default: 1 },
    allOptionsSelected: { type: Boolean, default: false },
    confirmedSelection: { type: Boolean, default: false },
    onlyOneOption: { type: Boolean, default: false }
  },
  data() {
    return {
      subPrice: 0,
      defaultText: `Add to Cart - ${this.displayPrice}`,
      buttonText: `Add to Cart - ${this.displayPrice}`,
      buttonClass: ''
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    ...mapGetters('cart', ['checkoutLineItems']),
    variantInLineItems () {
      const vm = this
      if (vm.variant != null) {
        const lineItem = vm.lineItems.findIndex(lineItem => {
          return lineItem.variant.id === vm.variant.id
        })
        if (lineItem !== -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    
    isProductVariantSelectChild () {
      return this.$parent.$options._componentTag === 'product-variant-select'
    },
    isSubscription () {
      return !!this.metafields.find(meta => meta.key === 'charge_interval_frequency')
    },
    disableAtcButton () {
      return (
        !this.allOptionsSelected ||
        (this.allOptionsSelected && this.variant === undefined) ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant.availableForSale !== true)
      )
    },
    discountVariantMap () {
      return JSON.parse(this.metafieldsObj.subscriptions.original_to_hidden_variant_map)
    },
    subscriptionVariant () {
      // Deep clone object without references to state.
      const _variant = JSON.parse(JSON.stringify(this.variant))
      const variantDiscount = this.discountVariantMap[this.decodeBase64VariantId(_variant.id)]

      if (variantDiscount) {
        _variant.price = variantDiscount.discount_variant_price
      }

      return _variant
    }
  },
  watch: {
    confirmedSelection () {
      this.addToCart()
    },
    variant() {
      this.getDisplayPrice()
    },
    subPrice() {
    },
    subscriptionVariant() {
      this.getDisplayPrice()
    },
    quantity() {
      this.getDisplayPrice()
    },
  },

  mounted() {
    this.getDisplayPrice(true)
  },
  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem',
      'getLineItems'
    ]),
    ...mapMutations('cart', ['showCart']),
    decodeBase64VariantId (encodedId) {
      const decodedId = atob(encodedId)
      return decodedId.split('gid://shopify/ProductVariant/')[1]
    },
    async getDisplayPrice(init = false) {
      let _vprice = this.isSubscription ? this.subscriptionVariant.price : this.variant.price;
      if(init) {
        _vprice = this.subscriptionVariant.price
      }
      const vm = this;
      const price = encodeURIComponent(JSON.stringify(
          [{"Price": _vprice, 
            "Tag": atob(this.variant.id).split('/').pop()
          }]
        ))

		//START OF RYAN MOD to override currency

        //See if currency override exists in URL in param _rchcur
        if (new URLSearchParams(window.location.search).has('_rchcur')) {
			document.cookie = '_rchcur=' + new URLSearchParams(window.location.search).get('_rchcur');
        }

        //See if currency override exists in URL in param currency     
        if (new URLSearchParams(window.location.search).has('currency')) {
			document.cookie = '_rchcur=' + new URLSearchParams(window.location.search).get('currency');
        }        
       
        //if cookie for _rchcur is found 
		if(document.cookie.includes('_rchcur')){
			var config = {
			    method: 'get',
			    url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=`+document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop()+`&MerchantPrices=${price}`,
		    }
		}
		else {
			var config = {
		    	method: 'get',
				url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
		    }			
		}
		//END OF RYAN MOD

        const localPrice = await Axios(config)
          .then((res) => {
            if(!res.data.ConsumerPrices[0]) {
              vm.subPrice = `${res.data.Symbol}${(Number(_vprice) * this.quantity).toFixed(2)}`
            } else {

				if(res.data.Symbol == null){
					vm.subPrice = `${(Number(res.data.ConsumerPrices[0]) * vm.quantity).toFixed(2)} ${res.data.Currency}`
				}
				else {
					vm.subPrice = `${res.data.Symbol}${(Number(res.data.ConsumerPrices[0]) * vm.quantity).toFixed(2)}`
	            }
            }
	            this.defaultText = `Add to Cart - ${vm.subPrice}`,
	            this.buttonText = `Add to Cart - ${vm.subPrice}`         
          })
          .catch((res) => {
            console.error('Currency Request Failed', res)
            this.subPrice = `$${this.variant.price}`
          })
    },
    setButtonText() {
      if(this.onlyOneOption &&
        !this.variantInLineItems &&
        this.variant.availableForSale == true) {
          this.butttonText = this.defaultText
      } else if(this.onlyOneOption && this.variantInLineItems) {
        this.buttonText = 'Added!'
        this.buttonClass = 'clicked'
        setTimeout(()=> {
          this.buttonText = this.defaultText
          this.buttonClass = 'unclicked'
        }, 2000)
      }
    },
    encodeBase64VariantId (decodedId) {
      return btoa(`gid://shopify/ProductVariant/${decodedId}`)
    },
    addToCart () {
      if (this.allOptionsSelected && this.product.availableForSale) {
        const variant = this.isSubscription ? this.subscriptionVariant : this.variant
        const cartMeta = this.metafields.filter((field) => {
          return !field.id && field.id !== null
        })
        const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: cartMeta
        }

        this.setButtonText()
        this.addLineItem(lineItem)
        this.showCart()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .button {
    &:disabled {
      @include button-primary('purple');
      opacity: 0.5;
    }
  }

  .add-to-cart-button {
    @include button-primary('purple');

    &:hover {
      @include button-primary('purple');
    }
  }

  .clicked {
    @include hover-transition;
    width: 217.58px;
  }

  .unclicked {}
</style>


