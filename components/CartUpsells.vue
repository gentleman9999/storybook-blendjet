<template>
  <transition name="fade">
    <div
      v-if="ready && (!isMobile || showUpsell)"
      :class="['cart-upsells', { 'cart-upsells--mobile': isMobile }]"
    >
      <!-- UPSELL HEADER -->
      <div>
        <div class="cart-upsells__header" v-if="title">
          {{ title }}
          <Close v-if="isMobile" color="white" :onClick="closeUpsellModal" />
        </div>
      </div>

      <!-- UPSELL CONTENT -->
      <div class="cart-upsells__products">
        <UpsellItem
          v-for="upsell in items"
          :key="upsell.shopifyProductHandle"
          :title="upsell.title"
          :subtitle="upsell.subtitle"
          :product="upsell.product"
          :with-variety-pack="upsell.withVarietyPack"
        />
      </div>

      <!-- UPSELL FOOTER -->
      <div class="cart-upsells__footer">
        <!-- CHECKOUT CTA (Mobile Only) -->
        <div class="cart-upsells__scroll-indicator">
          <BiChevron color="#fff" :size="16" />
          SCROLL FOR MORE
          <BiChevron color="#fff" :size="16" />
        </div>

        <!-- CHECKOUT CTA (Mobile Only) -->
        <CartFlyoutCheckoutButton
          v-if="isMobile"
          :checkoutText="'Continue to Checkout'"
          :showPrice="false"
          :class="[checkoutDisabled ? 'checkout-disabled' : null]"
          :key="1"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import UpsellItem from '~/components/CartUpsellsItem'
import BiChevron from '~/components/svg/BiChevron'
import CartFlyoutCheckoutButton from '~/components/nacelle/CartFlyoutCheckoutButton'
import Close from '~/components/svg/modalClose'

// Mixins
import productShippingEligibility from '~/mixins/productShippingEligibility'

export default {
  components: { UpsellItem, BiChevron, Close, CartFlyoutCheckoutButton },
  data() {
    return {
      observer: null,
      ready: false,
      title: '',
      items: []
    }
  },
  mixins: [productShippingEligibility],
  props: {
    closeUpsellModal: {
      type: Function,
      required: true
    },
    checkoutDisabled: {
      type: Boolean,
      required: true
    },
    showUpsell: {
      type: Boolean,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    }
  },
  async mounted() {
    const handle = this.getNacelleMetafield('cart_upsells', 'queue_handle')
    if (handle) {
      const queue = await this.$nacelle.data
        .content({
          type: 'queue',
          handle: handle
        })
        .catch(err => {
          console.warn(`Error fetching upsells with handle: ${handle}`)
        })

      if (queue) {
        this.title = queue.title

        // Get the queue's `items` array, filtering for just those with a shopifyProductHandle configured
        const items = Array.isArray(queue?.fields?.items) // if `items` is an array...
          ? queue.fields.items.filter(p => p?.fields?.shopifyProductHandle) // filter for only the product references
          : [] // otherwise set it equal to an empty array

        // Fetch the products for those handles.
        const products = await this.$nacelle.data.products({
          handles: items.map(itm => itm.fields.shopifyProductHandle)
        })

        // Assemble a complete `items` array, with product data attached.
        this.items = items.reduce((acc, curr, index) => {
          const product = products[index]
          const hasValidProduct = // product is valid if...
            product && // product exists
            product.id && // product id isn't null (aka empty nacelle object)
            product.availableForSale && // product isn't sold out
            this.checkProductShippingEligibility(product) // product is available for the user's locale
          return hasValidProduct
            ? [
                ...acc,
                {
                  ...curr.fields,
                  product: products[index]
                }
              ]
            : acc
        }, [])
      }

      this.observeScroll()
      this.ready = true
    }
  },
  beforeDestroy() {
    this.observer && this.observer.disconnect()
  },
  watch: {
    showUpsell(value) {
      if (value) {
        this.observeScroll()
      } else {
        this.observer && this.observer.disconnect()
      }
    }
  },
  computed: {
    ...mapGetters('space', { getNacelleMetafield: 'getMetafield' })
  },
  methods: {
    // On scroll, determine if the last element is still below the fold
    observeScroll() {
      setTimeout(() => {
        this.observer = new IntersectionObserver(([entry]) => {
          const scrollIndicator = document.querySelector('.cart-upsells__footer')

          if (!scrollIndicator) return

          scrollIndicator.classList.toggle(
            'cart-upsells__footer--scroll-complete',
            entry.isIntersecting
          )
        })

        this.observer.observe(document.querySelector('.cart-upsells-item:last-child'))
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-upsells {
  max-width: 440px;
  position: relative;
  z-index: 99;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    max-width: none;
    width: 100%;
    height: 100%; // Don't change this height prop to VH units — causes an iOS bug where the footer (and checkout CTA) goes below the iOS hardware layer menu!  Prevents users from being able to checkout!
  }
}

.cart-upsells__products {
  overflow-y: auto;
  height: 100%;
  padding-top: 60px;
}

.cart-upsells__header {
  position: absolute;
  width: 100%;
  top: 0;
  text-transform: uppercase;
  text-align: center;
  height: 60px;
  font-size: 24px;
  font-family: 'Bold';
  line-height: 60px;
  background-color: rgb(30, 144, 187);
  color: white;
  z-index: -10; // negative to hide it behind the scrollbar

  @media (max-width: 768px) {
    background-color: #000;
    z-index: 10; // positive, bc close button in the header must remain clickable.
  }
}

.cart-upsells__footer {
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  height: auto;
  height: 120px;
  z-index: 10000000;
  font-size: 18px;
  font-family: 'Medium';
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  pointer-events: none;

  // The checkout CTA is present in the upsells on mobile, so reset the pointer events
  .cart-upsells--mobile & {
    pointer-events: initial;
  }

  // Gradient
  &:after {
    content: '';
    bottom: 0;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(30, 144, 187, 0), rgb(30, 144, 187) 75%);
    pointer-events: none;
  }
}

.cart-upsells__scroll-indicator {
  transition: opacity 1s ease;
  opacity: 1;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
  .cart-upsells__footer--scroll-complete & {
    opacity: 0;
    pointer-events: none;
  }
}

::v-deep {
  .close-container {
    top: 0;
    right: 16px;
  }

  .dropdown-container {
    display: flex;
    justify-content: center;
  }
}
</style>
