<template>
  <div>
    <button
      v-if="isProductVariantSelectChild"
      :disabled="disableAtcButton"
      :style="styleObj"
      class="add-to-cart-button button nacelle"
      @click="addToCart"
    >
      <span v-if="!variantInLineItems && !allOptionsSelected && product.availableForSale">
        Select Options
      </span>
      <span
        v-if="
          (!variantInLineItems && allOptionsSelected && variant == undefined) ||
            (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
            !product.availableForSale
        "
      >
        Out of Stock
      </span>
      <span
        v-if="
          !variantInLineItems && allOptionsSelected && variant && variant.availableForSale == true
        "
      >
        Add to Cart
      </span>
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
        <span v-if="!onlyOneOption && product.availableForSale">
          Select Options
        </span>
        <span class="inner-text" v-if="subPrice">
          {{ buttonText }}
        </span>
        <span
          v-if="
            (!variantInLineItems && allOptionsSelected && variant == undefined) ||
              (!variantInLineItems && allOptionsSelected && variant.availableForSale === false) ||
              !product.availableForSale
          "
        >
          Out of Stock
        </span>
      </slot>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import productMetafields from '~/mixins/productMetafields'
import rechargeMixin from '~/mixins/rechargeMixin'
import Axios from 'axios'
// import ProductPrice from '~/components/nacelle/Pric'

export default {
  mixins: [productMetafields, rechargeMixin],
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
    isSubscriptionOn: { type: Boolean, default: true },
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
        this.variant === undefined ||
        (!this.variantInLineItems &&
          this.allOptionsSelected &&
          this.variant.availableForSale !== true)
      )
    },
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
        this.hasSubscription &&
        this.discountVariantMap &&
        this.discountVariantMap[decodedId]
      return variantSubscriptionPrice && variantSubscriptionPrice.discount_variant_price
        ? variantSubscriptionPrice.discount_variant_price
        : this.variant.price
    }
  },
  watch: {
    confirmedSelection() {
      this.addToCart()
    },
    variant(newValue, oldValue) {
      if (newValue.id && newValue.id !== oldValue.id) {
        this.getDisplayPrice()
      }
    },
    subscriptionPrice(newValue, oldValue) {
      this.getDisplayPrice()
    },
    isSubscriptionOn(newValue, oldValue) {
      this.getDisplayPrice()
    },
    quantity(newValue, oldValue) {
      this.getDisplayPrice()
    }
  },
  mounted() {
    this.getDisplayPrice()
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
    async getDisplayPrice() {
      // Bail if no variant is specified
      if (!this.variant || !this.variant.id) return undefined

      let _vprice =
        this.hasSubscription && this.isSubscriptionOn && this.subscriptionPrice
          ? this.subscriptionPrice
          : this.variant.price

      const vm = this

      const price = encodeURIComponent(
        JSON.stringify([
          {
            Price: _vprice,
            Tag: this.decodeBase64VariantId(this.variant.id)
          }
        ])
      )

      let config

      // START OF RYAN MOD to override currency

      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      if (document.cookie.includes('_rchcur')) {
        config = {
          method: 'get',
          url:
            'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
            document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
            `&MerchantPrices=${price}`
        }
      } else {
        config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`
        }
      }
      // END OF RYAN MOD

      await Axios(config)
        .then(res => {
          if (!res.data.ConsumerPrices[0]) {
            vm.subPrice = `${res.data.Symbol}${(Number(_vprice) * this.quantity).toFixed(2)}`
          } else {
            if (res.data.Symbol == null) {
              vm.subPrice = `${(Number(res.data.ConsumerPrices[0]) * vm.quantity).toFixed(2)} ${
                res.data.Currency
              }`
            } else {
              vm.subPrice = `${res.data.Symbol}${(
                Number(res.data.ConsumerPrices[0]) * vm.quantity
              ).toFixed(2)}`
            }
          }
          this.defaultText = `Add to Cart - ${vm.subPrice}`
          this.buttonText = `Add to Cart - ${vm.subPrice}`
        })
        .catch(res => {
          console.error('Currency Request Failed', res)
          this.subPrice = `$${this.variant.price}`
        })
    },
    setButtonText() {
      if (
        this.onlyOneOption &&
        !this.variantInLineItems &&
        this.variant.availableForSale === true
      ) {
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
    encodeBase64VariantId(decodedId) {
      return btoa(`gid://shopify/ProductVariant/${decodedId}`)
    },
    addToCart() {
      if (this.allOptionsSelected && this.product.availableForSale) {
        const subscribed = this.isSubscriptionOn && this.hasSubscription

        const rechargeFields = [
          {
            key: 'charge_interval_frequency',
            value: this.getMetafield('subscriptions', 'shipping_interval_frequency')
          },
          {
            key: 'order_interval_frequency',
            value: this.getMetafield('subscriptions', 'shipping_interval_frequency')
          },
          {
            key: 'order_interval_unit',
            value: 'day'
          }
        ]

        const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: subscribed ? { ...this.variant, price: this.subscriptionPrice } : this.variant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: subscribed ? [...rechargeFields] : []
        }

        this.addLineItem(lineItem)
        this.setButtonText()
        this.showCart()
        
        this.elevarAddToCart()
      }
    },
    elevarAddToCart() {
      // console.log('product:', this.product)
      window.dataLayer = window.dataLayer || []
      var uuid = '!QAZxsw22143edfRf'
      var variant = this.variant
      var referrer = document.referrer.includes('marketplace') ? document.referrer : '';
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      var variantId = Buffer.from(variant.id, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      // console.log('v:', variant)
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
            }]
          }
        }
      })
      console.log('wdl_atc:', window.dataLayer)
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
</style>
