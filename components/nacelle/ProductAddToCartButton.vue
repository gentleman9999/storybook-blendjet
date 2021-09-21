<template>
  <div>
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      @click="addToCart"
      class="add-to-cart-button button nacelle"
    >
      <span v-if="!variantInLineItems && !allOptionsSelected && product.availableForSale"
        >Select Options</span
      >
      <span
        v-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
            !product.availableForSale
        "
        >Out of Stock</span
      >
      <span
        v-if="
          !variantInLineItems && allOptionsSelected && variant && variant.availableForSale == true
        "
        >{{ buttonText }}</span
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
        <span v-if="!onlyOneOption && product.availableForSale">Select Options</span>
        <span class="inner-text" v-if="displayPrice && variant.availableForSale === true">{{
          buttonText
        }}</span>
        <span
          v-if="
            (!variantInLineItems && allOptionsSelected && variant == undefined) ||
              (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
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
import rechargeMixin from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import Axios from 'axios'

export default {
  components: {
    ProductPrice
  },
  mixins: [rechargeMixin, productMetafields],

  props: {
    product: {
      type: Object
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
    isSubscriptionOn: {
      type: Boolean
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
      buttonClass: ''
    }
  },
  computed: {
    ...mapState('cart', ['lineItems']),
    /**
     * Get the subscription price for the current variant.
     */
    subscriptionPrice() {
      if (!this.variant) {
        return undefined
      }
      const decodedId = this.decodeBase64VariantId(this.variant.id)
      const variantSubscriptionPrice =
        decodedId &&
        this.isSubscriptionOn &&
        this.discountVariantMap &&
        this.discountVariantMap[decodedId]
      return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
        ? variantSubscriptionPrice.discount_variant_price
        : this.variant.price
    },
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
    isSubscriptionOn() {
      this.getDisplayPrice()
    }
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
      if (!this.variant || !this.variant.id) {
        return undefined
      }

      let _price = this.isSubscriptionOn ? this.subscriptionPrice : this.variant.price
  
      const decodedId = atob(this.variant.id)
        .split('/')
        .pop()
      const price = encodeURIComponent(
        JSON.stringify([
          {
            Price: _price,
            Tag: decodedId
          }
        ])
      )

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

      const localPrice = await Axios(config)
        .then(res => {
          if (!res.data.ConsumerPrices[0]) {
            this.displayPrice = `${res.data.Symbol}${(Number(_price) * this.quantity).toFixed(2)}`
          } else {
            //Ryan's fix with Michael's help for UAE and some currency symbols
            if (res.data.Symbol == null) {
              this.displayPrice = `${(Number(res.data.ConsumerPrices[0]) * this.quantity).toFixed(
                2
              )} ${res.data.Currency}`
            } else {
              this.displayPrice = `${res.data.Symbol}${(
                Number(res.data.ConsumerPrices[0]) * this.quantity
              ).toFixed(2)}`
            }
          }
          ;(this.defaultText = `Add to Cart - ${this.displayPrice}`),
            (this.buttonText = `Add to Cart - ${this.displayPrice}`)
        })
        .catch(res => {
          console.error('Currency Request Failed', res)
          this.displayPrice = `$${Number(this.variant.price * this.quantity).toFixed(2)}`
          ;(this.defaultText = `Add to Cart - ${this.displayPrice}`),
            (this.buttonText = `Add to Cart - ${this.displayPrice}`)
        })
    },

    setButtonText() {
      if (this.onlyOneOption && !this.variantInLineItems && this.variant.availableForSale == true) {
        this.butttonText = this.defaultText
      } else if (this.onlyOneOption && this.variantInLineItems) {
        this.buttonText = 'Added!'
        this.buttonClass = 'clicked'
        setTimeout(() => {
          this.buttonText = this.defaultText
          this.buttonClass = 'unclicked'
        }, 2000)
      }
    },
    addToCart() {
      if (this.discount) {
        let _dvar = JSON.parse(JSON.stringify(this.variant))
        _dvar.price = 0.0
      } else {
      }
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
        if (this.hasWarranty()) {
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
                value: atob(this.variant.id)
                  .split('/')
                  .pop()
              }
            ]
          }
          this.addLineItem(warrantyItem)
        }
        this.addLineItem(lineItem)
        this.setButtonText()
        this.showCart()
        this.$emit('addedToCart')
        
        this.elevarAddToCart()
      }
    },
    decodeBase64VariantId(encodedId) {
      // This is wrapped in a try/catch because in some instances it's attempted to be run during
      // the nuxt build (somehow in advance of the browser), therefore the `window.atob` method
      // doesn't exist yet.
      let decodedId = undefined
      try {
        decodedId = atob(encodedId).split('gid://shopify/ProductVariant/')[1]
      } catch (e) {
        // console.warn(`Error decoding variant ID "${encodedId}"`)
      }
      return decodedId
    },
    getSource(){
      var location = window.location;
      
      if(location.pathname.includes('products')){
        return 'productpage'
      }else if( location.pathname.includes('marketplace') ){
        return 'marketplace'
      }else{
        return location.pathname
      }
      
    },
    createUUID() {
        var result = ''
        var length = 16
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
        return result
    },
    elevarAddToCart() {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var variant = this.variant
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
      var source = this.getSource()
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      var variantId = Buffer.from(variant.id, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      window.dataLayer.push({
        "event": "dl_add_to_cart",
        "event_id": uuid,
        "ecommerce": {
          "currencyCode": this.product.priceRange.currencyCode,
          "add": {
            "actionField": {'list': referrer}, 
            "products": [{
              "name": this.product.title.replace("'", ''),
              "id": ((variant && variant.sku) || ""),
              "product_id": productId,
              "variant_id": ((variant && variantId) || ""),
              "image": this.product.featuredMedia.src,
              "price": variant.price,
              "brand": this.product.vendor.replace("'", ''),
              "variant": (variant && variant.title && (variant.title.replace("'", '')) || ""),
              "category": this.product.productType,
              "inventory": this.quantity,
              "list": referrer,
              "source": source,
            }]
          }
        }
      })
      // console.log('wdl_atc:', window.dataLayer)
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

.unclicked {
}

.inner-text {
  transition: all ease 1s;
}
</style>
