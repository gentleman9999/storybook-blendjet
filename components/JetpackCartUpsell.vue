<template>
  <div class="jetpack-container" v-if="product && selectedVariant">
    <div class="text-block">
      <nuxt-link :to="productUrl" style="color:white;">
        {{ upsellTitle }}
      </nuxt-link>
      <br />
      <span v-if="subtitle" style="font-size: 75%;color:gold;">{{ subtitle }}</span>
      <br />
    </div>
    <div class="jetpack-image">
      <transition name="fade">
        <img class="jetpack-image__img" :src="optimizeSource({ url: productImage, width: 600 })" />
      </transition>
    </div>
    <div class="add-to-cart-controls">
      <div class="jetpack-dropdown">
        <CartDropdown
          productType="jetpacks"
          :label="product.variants[0].selectedOptions.map(o => o.name).join(', ')"
          :items="variants"
          :product="selectedVariant"
          @update:jetpacks="updateSelectedVariant"
        />
      </div>
      <div class="quantity-select">
        <div class="quantity-select__label">Quantity:</div>
        <div class="quantity-select__dropdown-container">
          <QuantityDropdown :quantity="quantity" @update:quantity="updateQuantity" />
        </div>
      </div>
      <div class="add-to-cart-container">
        <button type="button" class="variety-button" @click="addProduct" :disabled="justAdded">
          {{ buttonText }}
        </button>
      </div>
      <div class="subscribe-select">
        <Checkbox
          color="white"
          label="Subscribe &amp; Save 25%"
          @checked="handleSubscriptionCheck"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Axios from 'axios'
import QuantityDropdown from '~/components/quantityDropdown'
import imageOptimize from '~/mixins/imageOptimize'
import CartDropdown from '~/components/cartDropdown'
import Checkbox from '~/components/checkbox'

import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'

export default {
  props: {
    title: String,
    subtitle: String,
    productHandle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      product: null,
      quantity: 1,
      variants: null,
      selectedVariant: null,
      subscriptionChecked: false,
      localizedPricesMap: null,
      symbol: '$',
      justAdded: false,
      bundleImageIndex: 0,
      bundleImageCycleDelay: 1000,
      localized: false
    }
  },
  components: {
    Checkbox,
    CartDropdown,
    QuantityDropdown
  },
  mixins: [imageOptimize, productMetafields, rechargeProperties],
  async mounted() {
    // Bail if not provided a product handle
    if (!this.productHandle) return

    this.product = this.productHandle
      ? await this.$nacelle.data.product({ handle: this.productHandle })
      : { variants: [] }

    // Filter for applicable variants, map the decoded variant ID + url
    this.variants = this.product.variants
      .filter(v => v.availableForSale)
      .map(v => {
        const variantId = atob(v.id)
          .split('/')
          .pop()
        const subscriptionDiscountVariant =
          this.discountVariantMap && this.discountVariantMap[variantId]
        return {
          ...v,
          plainId: variantId,
          url: `/products/${this.product.handle}?variant=${variantId}`,
          price: parseFloat(v.price),
          subscriptionPrice: subscriptionDiscountVariant
            ? parseFloat(subscriptionDiscountVariant.discount_variant_price)
            : null
        }
      })

    // If the variants array exists and is more than 1 item...
    if (Array.isArray(this.variants) && this.variants.length > 1) {
      // Create an 'all variants' bundle option
      const allVariantsOption = {
        title: 'Variety Pack',
        subVariants: [
          ...this.variants // don't just assign a reference, since it'll also include this bundle.
        ]
      }

      // Add 'all variants' option to end of variants array
      this.variants.unshift(allVariantsOption)
    }

    // Set the module's selected variant to the first variant option.
    this.selectedVariant = this.variants[0]

    this.initLocalizedPrice()
  },
  computed: {
    upsellTitle() {
      return this.title ? this.title : this.product ? this.product.title : ''
    },
    productUrl() {
      const baseUrl = `/products/${this.product.handle}`
      return (this.selectedVariant && this.selectedVariant.url) || baseUrl
    },
    /**
     * Returns the product price (localized, if available) for the currently selected variant.
     */
    productPrice() {
      // Single variant prices
      let price = this.localized
        ? this.selectedVariant.localizedPrice ?? this.selectedVariant.price
        : this.selectedVariant.price
      let subscriptionPrice = this.localized
        ? this.selectedVariant.localizedSubscriptionPrice ?? this.selectedVariant.subscriptionPrice
        : this.selectedVariant.subscriptionPrice

      // If a bundle is selected, get the price based on total price for all sub-variants
      if (this.isBundleVariant) {
        const bundledVariants = this.selectedVariant.subVariants
        // Get total price (localized if possible)
        price = bundledVariants.reduce(
          (acc, curr) => (this.localized ? acc + curr.localizedPrice : acc + curr.price),
          0
        )
        // Get total subscription price (localized if possible)
        subscriptionPrice = bundledVariants.reduce(
          (acc, curr) =>
            this.localized ? acc + curr.localizedSubscriptionPrice : acc + curr.subscriptionPrice,
          0
        )
      }

      return this.subscriptionChecked ? subscriptionPrice : price
    },
    buttonText() {
      const price = `${this.symbol}${(this.productPrice * this.quantity).toFixed(2)}`
      return this.justAdded ? 'Added!' : `Add to Cart${price ? ` - ${price}` : ''}`
    },
    productImage() {
      let variantImage = this.selectedVariant?.featuredMedia?.src

      // If this is a 'bundle', set the current image + a short timeout to
      // update it to the next with a short delay.
      if (this.isBundleVariant) {
        const bundleVariants = this.selectedVariant.subVariants
        const bundleImages = bundleVariants
          .filter(v => v?.featuredMedia?.src)
          .map(v => v.featuredMedia.src)
        variantImage = bundleImages[this.bundleImageIndex]
        // Update the image index
        setTimeout(() => {
          this.bundleImageIndex =
            this.bundleImageIndex + 1 >= bundleImages.length ? 0 : this.bundleImageIndex + 1
        }, this.bundleImageCycleDelay || 1000)
      } else {
        this.bundleImageIndex = 0
      }

      return variantImage
    },
    isBundleVariant() {
      return (
        this.selectedVariant &&
        Array.isArray(this.selectedVariant.subVariants) &&
        this.selectedVariant.subVariants.length > 0
      )
    }
  },
  methods: {
    ...mapActions('cart', ['addLineItem']),
    updateSelectedVariant(newVariant) {
      this.selectedVariant = newVariant
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    handleSubscriptionCheck(check) {
      this.subscriptionChecked = check
    },
    /**
     * Note:
     * This API only returns values when called for non-US locations.
     */
    async initLocalizedPrice() {
      // Create array of all variant prices to get localized values
      const pricesArray = this.variants.reduce(
        (arr, v) =>
          v.price
            ? [
                ...arr,
                { Price: v.price, Tag: v.plainId },
                { Price: v.subscriptionPrice, Tag: v.plainId }
              ]
            : arr,
        []
      )

      // Encode prices to send to price localization API
      const priceData = encodeURIComponent(JSON.stringify(pricesArray))

      // if cookie for _rchcur is found - set in /static/scripts/currencycookie.js
      let url = document.cookie.includes('_rchcur')
        ? 'https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&Currency=' +
          document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop() +
          `&MerchantPrices=${priceData}`
        : `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${priceData}`

      // Fetch price localization data
      await Axios({
        method: 'get',
        url
      })
        .then(({ data }) => {
          // If an array of localized prices is returned...
          if (
            data &&
            Array.isArray(data.ConsumerPrices) &&
            data.ConsumerPrices.length &&
            data.ConsumerPrices[0]
          ) {
            const returnedPrices = data.ConsumerPrices

            // Get this currency's symbol, or the ISO code
            this.symbol = data.Symbol || data.Currency

            // Create a localized prices map by iterating over the request in twos
            for (let i = 0; i <= pricesArray.length - 1; i += 2) {
              const variantId = pricesArray[i].Tag
              const variant = this.variants.find(v => v.plainId === variantId)

              // If variant is found, update it to contain the localized prices
              if (variant) {
                variant['localizedPrice'] = returnedPrices[i]
                variant['localizedSubscriptionPrice'] = returnedPrices[i + 1]
              }
            }
            this.localized = true
          }
        })
        .catch(err => {
          console.error('Currency Request Failed: ', err)
        })
    },
    addProduct() {
      const { handle, vendor, tags } = this.product

      // ReCharge Subscription Metadata
      // TODO - Pull this from mixin
      const rechargeFields = [
        { key: 'charge_interval_frequency', value: '30' },
        { key: 'order_interval_frequency', value: '30' },
        { key: 'order_interval_unit', value: 'day' }
      ]

      // Add a single variant to the cart
      const addVariantToCart = variant => {
        const { featuredMedia, title, id, metafields } = variant
        const price = this.subscriptionChecked ? variant.subscriptionPrice : variant.price
        this.addLineItem({
          image: featuredMedia,
          title,
          quantity: this.quantity,
          productId: id,
          handle,
          vendor,
          tags,
          variant: { ...variant, price },
          metafields: this.subscriptionChecked
            ? [...metafields, ...rechargeFields]
            : [...metafields]
        })
      }

      if (this.isBundleVariant) {
        this.selectedVariant.subVariants.forEach(v => {
          addVariantToCart(v)
        })
      } else {
        addVariantToCart(this.selectedVariant)
      }

      this.justAdded = true
      setTimeout(() => {
        this.justAdded = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  font-family: Bold;
  font-size: 22px;
  line-height: 1.17;
  letter-spacing: 0.67px;
  text-align: center;
  color: $grayscale-white;
  padding-top: 80px;
  margin-bottom: 80px;
  padding-right: 55px;
  padding-left: 55px;

  @include respond-to('small') {
    font-size: 16px;
    margin-bottom: 15px;
    padding-top: 15px;
    padding-left: 37px;
    padding-right: 37px;
  }
}

.jetpack-container {
  padding: 15px 0 40px;
}

.variety-button {
  @include button-primary('white');
}

.jetpack-image {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  &__img {
    height: 300px;
    object-fit: contain;
    @include respond-to('small') {
      height: 250px;
    }
  }
  @include respond-to('small') {
    margin-bottom: 15px;
  }
}

.jetpack-dropdown {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  @include respond-to('small') {
    margin-bottom: 11px;
  }
}

.add-to-cart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  ::v-deep .add-to-cart-button {
    @include button-primary('white');
    width: 287px;
  }
}

.quantity-select {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  &__label {
    font-family: Regular;
    font-size: $text-small;
    letter-spacing: 0.5px;
    line-height: 1.17;
    margin-right: 14px;
    color: $grayscale-white;
    display: flex;
    align-items: center;
    @include respond-to('small') {
      // align-items: normal;
    }
  }

  &__dropdown-container {
    width: 50px;
  }

  @include respond-to('small') {
    margin-bottom: 20px;
  }
}

.subscribe-select {
  display: flex;
  justify-content: center;
}
</style>
