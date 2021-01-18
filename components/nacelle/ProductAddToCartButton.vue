<template>
  <div>
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      @click="addToCart"
      class="add-to-cart-button button nacelle"
      
    >
      <span
        v-if="
          !variantInLineItems && !allOptionsSelected && product.availableForSale
        "
        >Select Options</span
      >
      <span
        v-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems &&
              allOptionsSelected &&
              variant.availableForSale === false) ||
            !product.availableForSale
        "
        >Out of Stock</span
      >
      <span
        v-if="
          !variantInLineItems &&
            allOptionsSelected &&
            variant &&
            variant.availableForSale == true
        "
        >{{buttonText}}</span
      >
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
          v-if="displayPrice && variant.availableForSale === true"
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
import ProductPrice from '~/components/nacelle/ProductPrice'
import Axios from 'axios'

export default {
  props: {
    product: {
      type: Object
    },
    components: {
      ProductPrice
    },
    variant: {
      type: Object
    },
    discount: {
      type: Boolean
    },
    metafields: {
      type: Array,
      default: () => {
        return []
      }
    },
    styleObj: {
      type: Object,
      default: () => {}
    },

    warranty: {
      type: Object,
      default: () => {
        return {}
      }
    },



    quantity: { type: Number, default: 1 },
    allOptionsSelected: { type: Boolean, default: true },
    confirmedSelection: { type: Boolean, default: true },
    onlyOneOption: { type: Boolean, default: true }
  },
  data() {
    return {
     
      warrantyPrice: 0,
      displayPrice: 0,
      defaultText: `Add to Cart - ${this.displayPrice}`,
      buttonText: `Add to Cart - ${this.displayPrice}`,
      buttonClass:''
      
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),

    variantInLineItems() {
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

    isProductVariantSelectChild() {
      return this.$parent.$options._componentTag === 'product-variant-select'
    },

    disableAtcButton() {
      return (
        !this.allOptionsSelected ||
        (this.allOptionsSelected && this.variant === undefined) ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant.availableForSale !== true)
      )
    }
  },
  mounted() {
    this.getDisplayPrice()
  },
  watch: {
    confirmedSelection() {
      this.addToCart()
    },

    variant() {
      this.$emit('cartVariant', this.variant)
      this.getDisplayPrice()
    },
   
    quantity() {
      this.getDisplayPrice()
    },
  },

  methods: {
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    ...mapMutations('cart', ['showCart']),
    hasWarranty() {
      return !!Object.keys(this.warranty).length
    },
    async getDisplayPrice() {
      
      let _price = this.variant.price;
      const decodedId = atob(this.variant.id).split('/').pop()
      const price = encodeURIComponent(JSON.stringify(
          [
            {
              "Price": _price,
              "Tag": decodedId
            }
          ]
        ))
        
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
		
        const localPrice = await Axios(config)
          .then((res) => {
	          
            if(!res.data.ConsumerPrices[0]) {
              this.displayPrice = `${res.data.Symbol}${(Number(_price) * this.quantity).toFixed(2)}`
            } else {
	        //Ryan's fix with Michael's help for UAE and some currency symbols	          
				if(res.data.Symbol == null){
					this.displayPrice = `${(Number(res.data.ConsumerPrices[0]) * this.quantity).toFixed(2)} ${res.data.Currency}`
				}
				else {
					this.displayPrice = `${res.data.Symbol}${(Number(res.data.ConsumerPrices[0]) * this.quantity).toFixed(2)}`
            	}
            }
            this.defaultText = `Add to Cart - ${this.displayPrice}`,
            this.buttonText = `Add to Cart - ${this.displayPrice}`          
          })
          .catch((res) => {
            console.error('Currency Request Failed', res)
            this.displayPrice = `$${Number(this.variant.price * this.quantity).toFixed(2)}`
            this.defaultText = `Add to Cart - ${this.displayPrice}`,
            this.buttonText = `Add to Cart - ${this.displayPrice}` 
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
    addToCart() {
      if(this.discount) {
        let _dvar =  JSON.parse(JSON.stringify(this.variant))
        _dvar.price = 0.0
      } else {}
      if (this.allOptionsSelected && this.product.availableForSale) {
        const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: this.variant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: this.metafields
        }
        if(this.hasWarranty()) {
          
          const warrantyItem = {
            image: this.warranty.featuredMedia,
            title: this.warranty.title,
            variant: this.warranty.variants[0],
            quantity: this.quantity || 1,
            productId: this.warranty.id,
            handle: this.warranty.handle,
            vendor: this.warranty.vendor,
            tags: this.warranty.tags,
            metafields: [
              {
                key: 'Ref',
                value: atob(this.variant.id).split('/').pop()
              }
            ]
          }
          this.addLineItem(warrantyItem)
        }
        this.addLineItem(lineItem)
        this.setButtonText()
        this.showCart()
        this.$emit('addedToCart')
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .add-to-cart-button {
    @include button-primary('purple');
    height: 50px;
    width: 264px;
    flex-flow: row nowrap;
    min-width: 202.08px;
    &:disabled {
      opacity: 0.5;
    }

    @include respond-to('small') {
      width: auto;
    }
  }

  .clicked {
    @include hover-transition;
  }

  .unclicked {}

  .inner-text {
    transition: all ease 1s;
  }
</style>
