<template>
  <div class="cart-upsells-item">
    <template v-if="product && selectedVariant">
      <div class="header">
        <nuxt-link :to="productUrl">{{ upsellTitle }}</nuxt-link>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="image" v-if="productImage">
        <img
          :src="optimizeSource({ url: productImage, width: 800 })"
          :alt="selectedVariant.title"
        />
      </div>
      <div class="add-to-cart">
        <CartDropdown
          v-if="variants.length > 1 && allOptions.length <= 1"
          productType="any"
          :label="variantLabel"
          :items="variants"
          :product="selectedVariant"
          @update:any="updateSelectedVariant"
        />
        <CartDropdownMultiOptions
          v-else-if="variants.length > 1 && allOptions.length > 1"
          :options="allOptions"
          :variant="selectedVariant"
          :update="setSelectedOption"
          :variants="variants"
          @clear="selectedOptions = []"
          :currentOption="currentOption"
        />
        <div class="quantity">
          <QuantityDropdown
            :quantity="quantity"
            @update:quantity="updateQuantity"
            label="Quantity"
          />
        </div>

        <div class="add-to-cart-button">
          <button type="button" @click="addProduct" :disabled="justAdded">
            {{ buttonText }}
          </button>
        </div>
        <div class="subscribe-select" v-if="hasSubscription">
          <Checkbox
            color="#fff"
            :label="`Subscribe ${subscribeLabel}`"
            @checked="handleSubscriptionCheck"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { stringify } from 'querystring'

// Components
import CartDropdown from '~/components/cartDropdown'
import QuantityDropdown from '~/components/quantityDropdown'
import Checkbox from '~/components/checkbox'
import CartDropdownMultiOptions from '~/components/cartDropdownMultiOption'

// Mixins
import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import imageOptimize from '~/mixins/imageOptimize'
import availableOptions from '~/mixins/availableOptions'

export default {
  components: {
    CartDropdown,
    QuantityDropdown,
    Checkbox,
    CartDropdownMultiOptions
  },
  mixins: [rechargeProperties, productMetafields, imageOptimize, availableOptions],
  data() {
    return {
      variants: [],
      subscriptionChecked: false,
      selectedVariant: null,
      quantity: 1,
      justAdded: false,
      symbol: '$',
      localized: false,
      imageInterval: null,
      imageIndex: 0,
      subscriptionDiscountVariant: null
    }
  },
  props: {
    title: String,
    subtitle: String,
    product: {
      type: Object,
      required: true
    },
    withVarietyPack: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    subscribeLabel() {
      return this.discountPercentage > 0 ? `& Save ${this.discountPercentage}%` : ''
    },
    currentOption() {
      return this.selectedVariant?.selectedOptions?.[0]?.value || ''
    },
    upsellTitle() {
      return this.title ? this.title : this.product ? this.product.title : ''
    },
    productUrl() {
      return this.selectedVariant?.url ?? `/products/${this.product.handle}`
    },
    productImage() {
      const variant = this.isBundleVariant
        ? this.selectedVariant.subVariants[this.imageIndex]
        : this.selectedVariant
      return variant?.featuredMedia?.src
    },
    variantLabel() {
      return this.product.variants[0].selectedOptions.map(o => o.name).join(', ')
    },
    productPrice() {
      if (!this.selectedVariant) {
        return undefined
      }

      // Single variant prices
      let price = this.localized
        ? this.selectedVariant.localizedPrice ?? this.selectedVariant.price
        : this.selectedVariant.price

      let subscriptionPrice = this.localized
        ? this.selectedVariant.localizedSubscriptionPrice ?? this.selectedVariant.subscriptionPrice
        : this.selectedVariant.subscriptionPrice

      const bundledVariants = this.selectedVariant.subVariants

      // If a bundle is selected, get the price based on total price for all sub-variants
      if (bundledVariants) {
        // Get total price (localized if possible)
        price = bundledVariants.reduce(
          (acc, curr) =>
            this.localized && !isNaN(curr.localizedPrice) && curr.localizedPrice !== null
              ? acc + curr.localizedPrice
              : acc + curr.price,
          0
        )
        // Get total subscription price (localized if possible)
        subscriptionPrice = bundledVariants.reduce(
          (acc, curr) =>
            this.localized &&
            !isNaN(curr.localizedSubscriptionPrice) &&
            curr.localizedSubscriptionPrice !== null
              ? acc + curr.localizedSubscriptionPrice
              : acc + curr.subscriptionPrice,
          0
        )
      }

      return this.subscriptionChecked ? subscriptionPrice : price
    },
    buttonText() {
      const price = `${this.symbol}${(this.productPrice * this.quantity).toFixed(2)}`
      return this.justAdded ? 'Added!' : `Add to Cart${price ? ` - ${price}` : ''}`
    },
    isBundleVariant() {
      return this.selectedVariant?.subVariants?.length
    }
  },
  watch: {
    isBundleVariant(is) {
      if (is) {
        this.imageInterval = setInterval(() => {
          this.imageIndex =
            this.imageIndex === this.selectedVariant.subVariants.length - 1
              ? 0
              : this.imageIndex + 1
        }, 1000)
      } else {
        clearInterval(this.imageInterval)
      }
    }
  },
  mounted() {
    this.variants = this.product?.variants
      ?.filter(v => v.availableForSale)
      ?.map(v => {
        const variantId = atob(v.id)
          .split('/')
          .pop()
        this.subscriptionDiscountVariant =
          this.hasSubscription && this.discountVariantMap && this.discountVariantMap[variantId]
        return {
          ...v,
          discountPercentage: this.discountPercentage,
          plainId: variantId,
          url: `/products/${this.product.handle}?variant=${variantId}`,
          price: parseFloat(v.price),
          subscriptionPrice: this.subscriptionDiscountVariant
            ? parseFloat(this.subscriptionDiscountVariant.discount_variant_price)
            : null
        }
      })

    if (this.withVarietyPack && this.variants.length) {
      this.variants.unshift({
        title: 'Variety Pack',
        subVariants: [...this.variants]
      })
    }

    this.selectedVariant = this.variants?.[0]

    this.initLocalizedPrice()
    this.$emit('ready')
  },
  beforeDestroy() {
    clearInterval(this.imageInterval)
  },
  methods: {
    ...mapActions('cart', ['addLineItem']),
    updateSelectedVariant(newVariant) {
      this.selectedVariant = newVariant
    },
    /**
     * Formats a Storefront API encoded ID to a plain-language variant ID
     * TODO: Move this to a mixin, it's used in like every product-based component...
     */
    formatVariantId(value) {
      const url = atob(value)
      return url.replace('gid://shopify/ProductVariant/', '')
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    handleSubscriptionCheck(check) {
      this.subscriptionChecked = check
    },
    // Set the currentVaraint using the options selected
    // If there is only one option selected, it will take the first varaint with that option
    setSelectedOption(opt) {
      let variant = null

      variant = this.variants.find(v => {
        if (opt.length > 1) {
          return JSON.stringify(v.selectedOptions) === JSON.stringify(opt)
        }
      })

      if (!variant) {
        variant = this.variants.find(v => {
          return v.selectedOptions.some(option => {
            return JSON.stringify(option) === JSON.stringify(Array.isArray(opt) ? opt[0] : opt)
          })
        })
      }

      if (variant) {
        this.selectedVariant = variant
      }
    },
    addProduct() {
      const { handle, title, vendor, tags } = this.product

      // Add a single variant to the cart
      const addVariantToCart = variant => {
        const { featuredMedia, id, metafields } = variant
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
            ? [...metafields, ...this.rechargeMetafields]
            : [...metafields]
        })
      }

      if (this.selectedVariant.subVariants) {
        this.selectedVariant.subVariants.forEach(v => {
          addVariantToCart(v)
          this.elevarAddToCart(v)
        })
      } else {
        addVariantToCart(this.selectedVariant)
        this.elevarAddToCart(this.selectedVariant)
      }

      this.justAdded = true
      setTimeout(() => {
        this.justAdded = false
      }, 2000)
    },
    async initLocalizedPrice() {
      // Create array of all variant prices to get localized values
      const pricesArray = this.variants?.reduce(
        (arr, v) =>
          [
            ...arr,
            v.price && { Price: v.price, Tag: v.plainId },
            v.subscriptionPrice && { Price: v.subscriptionPrice, Tag: v.plainId }
          ].filter(Boolean),
        []
      )

      // Encode prices to send to price localization API
      const priceData = JSON.stringify(pricesArray)

      const baseUrl = 'https://checkout.gointerpay.net/v2.21/localize'

      const search = stringify(
        Object.assign(
          {
            MerchantId: '3af65681-4f06-46e4-805a-f2cb8bdaf1d4',
            MerchantPrices: priceData
          },
          document.cookie.includes('_rchcur') && {
            Currency: document.cookie.match('(^|;)\\s*' + '_rchcur' + '\\s*=\\s*([^;]+)').pop()
          }
        )
      )

      try {
        const res = await fetch(`${baseUrl}?${search}`)
        const data = await res.json()

        if (data?.ConsumerPrices?.length) {
          const returnedPrices = data.ConsumerPrices

          // Get this currency's symbol, or the ISO code
          this.symbol = data.Symbol || data.Currency

          // Create a localized prices map by iterating over the request in twos
          for (let i = 0; i <= pricesArray.length - 1; i += 2) {
            const variantId = pricesArray[i].Tag
            const variant = this.variants.find(v => v.plainId === variantId)

            // If variant is found, update it to contain the localized prices
            if (variant) {
              variant.localizedPrice = returnedPrices[i]
              variant.localizedSubscriptionPrice = returnedPrices[i + 1]
            }
          }

          this.localized = true
        }
      } catch (err) {
        console.error('Currency Request Failed: ', err)
      }
    },
    createUUID() {
      var result = ''
      var length = 16
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
      return result
    },
    elevarAddToCart(variant) {
      window.dataLayer = window.dataLayer || []
      var uuid = this.createUUID()
      var referrer = document.referrer.includes('marketplace') ? document.referrer : ''
      var productId = Buffer.from(this.product.pimSyncSourceProductId, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      var variantId = Buffer.from(variant.id, 'base64')
        .toString('binary')
        .split('/')
        .pop()
      window.dataLayer.push({
        event: 'dl_add_to_cart',
        event_id: uuid,
        ecommerce: {
          currencyCode: this.product.priceRange.currencyCode,
          add: {
            actionField: { list: referrer },
            products: [
              {
                name: this.product.title.replace("'", ''),
                id: (variant && variant.sku) || '',
                product_id: productId,
                variant_id: (variant && variantId) || '',
                image: this.product.featuredMedia.src,
                price: variant.price,
                brand: this.product.vendor.replace("'", ''),
                variant: (variant && variant.title && variant.title.replace("'", '')) || '',
                category: this.product.productType,
                inventory: this.quantity,
                list: referrer,
                source: 'minicart'
              }
            ]
          }
        }
      })
      // console.log('wdl_atc:', window.dataLayer)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-upsells-item {
  background: linear-gradient(to bottom, #373795 0%, #1e90bb 100%);
  padding: 80px 52px 120px;
  min-width: 375px;
  @media (max-width: 1024px) {
    padding: 15px 25px 40px;
    &:last-child {
      padding-bottom: 150px;
    }
  }
}

.header {
  font-family: Bold;
  font-size: 22px;
  letter-spacing: 0.7px;
  text-align: center;
  margin-bottom: 80px;

  a {
    color: #fff;
  }

  p {
    color: #ffd700;
    font-size: 75%;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
}

.image {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;

  img {
    height: 300px;
    object-fit: contain;
  }

  @media (max-width: 1024px) {
    margin-bottom: 15px;
  }
}

.add-to-cart {
  display: grid;
  place-content: center;
  grid-gap: 18px;
}

.quantity {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;

  p {
    font-size: 12px;
    letter-spacing: 0.5px;
    line-height: 1.17;
    margin-right: 14px;
    color: #fff;
  }
}

.add-to-cart-button {
  display: flex;
  justify-content: center;
  padding-top: 14px;

  button {
    border-radius: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 1.75px;
    line-height: 14px;
    padding: 0 2rem;
    font-family: 'Bold';
    text-transform: uppercase;
    cursor: pointer;
    background-color: #ffffff;
    color: #373975;
    border: none;
  }
}

.subscribe-select {
  display: flex;
  justify-content: center;
}
</style>
