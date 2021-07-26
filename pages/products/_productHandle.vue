<!--
/****
/* Individual products are loaded with the getProduct mixin.
/* For instructions related to connecting your inventory to
/* Nacelle, please refer to:
/*
/* https://docs.getnacelle.com/getting-started.html#_2-product-settings
/****
-->
<template>
  <div class="product" v-if="product">
    <!-- INELIGIBLE COUNTRY WARNING -->
    <ShippingIneligibilityWarning v-if="!isShippableToUser" />

    <!--
      Temporarily removing as part of release 1.1.0
      <div v-if="page && page.fields.productAnnouncement" class="">
        <div v-html="productAnnouncement" class="product-productAnnouncement"></div>
      </div>
    -->
    <!-- START BFCM - TEMP SALE HARDCODED -->
    <!-- <div v-if="product.productType !== 'Jetpack Smoothies'" class="outer-canvas-bfcm" style="margin-bottom: unset;">
    <div class="canvas-bfcm">
      <div class="col-bfcm">
        <span class="entry-title-bfcm">4th of July Sale!</span>
        <span class="content-split-element-bfcm">10% Off 1</span>
        <span class="content-split-element-bfcm">15% Off 2</span>
        <span class="content-split-element-bfcm">20% Off 3+</span>
        <span class="simple-text-bfcm">Last Chance - Ends Soon <b class="b-hide-bfcm">|</b> <span>Automatically Applied at Checkout</span></span>
      </div>
    </div>
    </div> -->
    <!-- END BFCM - TEMP SALE HARDCODED -->
<div style="margin-bottom:10px" class="hide-desktop"></div>
    <transition name="fade">
      <BlendjetPDP
        v-cloak
        v-if="product.productType === 'BlendJet'"
        :product="product"
        :page="page"
      />
      <JetpackVariantPDP
        v-cloak
        v-else-if="
          ['jetpack smoothies'].includes(product.productType && product.productType.toLowerCase())
        "
        :product="product"
        :page="page"
      />
      <!-- TODO: THIS SHOULD BE DELETED AFTER THE REFACTOR IS DONE -->
      <JetpackPDP
        v-cloak
        v-else-if="product.productType === 'Single Jetpack'"
        :product="product"
        :page="page"
      />
      <ProductDetail v-cloak v-else :product="product" :page="page" />
    </transition>
    <!-- </template> -->
    <!-- </transition> -->
    <!-- <recharge-widget
  v-if="isSubscription"
  :product="product"
  :variant="currentVariant"
  :metafields.sync="metafields"
  :frequency.sync="frequency"
/> -->
    <!-- </div>
    </section> -->
    <!-- <section class="section product-meta" v-if="product">
      <div class="container">
        <div class="columns">
          <div class="column is-7">
            <h4 class="title is-4">What You're Getting</h4>
            <div class="content">
              <p>
                Run a manual sweep of anomalous airborne or electromagnetic
                readings. Radiation levels in our atmosphere have increased by
                3,000 percent. Electromagnetic and subspace wave fronts
                approaching synchronization. What is the strength of the ship's
                deflector shields at maximum output? The wormhole's size and
                short period would make this a local phenomenon. Do you have
                sufficient data to compile a holographic simulation?
              </p>
            </div>
          </div>
          <div class="column is-4 is-offset-1 highlight">
            <h4 class="title is-4">Our Products</h4>
            <div class="content">
              <p>
                It indicates a synchronic distortion in the areas emanating
                triolic waves. The cerebellum, the cerebral cortex, the brain
                stem, the entire nervous system has been depleted of
                electrochemical energy.

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
-->
    <!-- END BFCM - TEMP SALE HARDCODED -->

    <!-- PDP Conditional -->
    <div class="product__scroll-pin" />
    <BlendjetPDP
      v-cloak
      v-if="product.productType === 'BlendJet'"
      :product="product"
      :page="page"
    />
    <JetpackVariantPDP
      v-cloak
      v-else-if="
        ['jetpack smoothies'].includes(product.productType && product.productType.toLowerCase())
      "
      :product="product"
      :page="page"
    />
    <ProductDetail v-cloak v-else :product="product" :page="page" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

// Mixins
import getProduct from '~/mixins/getProduct'
import viewEvent from '~/mixins/viewEvent'
import productMetafields from '~/mixins/productMetafields'
import productShippingEligibility from '~/mixins/productShippingEligibility'
// Components
import ProductDetail from '~/components/ProductDetail'
import BlendjetPDP from '~/components/blendJetPDP'
import JetpackVariantPDP from '~/components/jetpackVariantPDP'
import ShippingIneligibilityWarning from '~/components/ProductShippingIneligibilityWarning'

export default {
  components: {
    ProductDetail,
    BlendjetPDP,
    JetpackVariantPDP,
    ShippingIneligibilityWarning
  },
  mixins: [getProduct(), productMetafields, viewEvent('product'), productShippingEligibility],
  computed: {
    ...mapGetters('space', ['getMetatag']),
    productAnnouncement() {
      return this.page?.fields.productAnnouncement?.content?.[0]?.content?.[0]
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView'])
  },

  mounted() {
    if (this.product) {
      this.productView(this.product)
    }
  },
  head() {
    if (this.product) {
      const properties = {}
      const meta = []
      const title = this.getMetatag('title')

      if (this.product.title) {
        let fullTitle = this.product.title

        if (title) {
          fullTitle = `${fullTitle} | ${title.value}`
        }

        properties.title = fullTitle
        if (!this.product.handle.includes('blendjet')) {
          meta.push({
            hid: 'og:title',
            property: 'og:title',
            content: fullTitle
          })
        }
      }

      if (
        this.product.handle === 'blendjet-2-influencer-kit' ||
        this.product.handle === 'blendjet-2-press-kit' ||
        this.product.handle === 'youtube-blendjet-2'
      ) {
        meta.push({
          name: 'robots',
          content: 'noindex'
        })
      }

      return {
        ...properties,
        meta
      }
    }
  }
}
</script>

<style lang="scss" scoped>
[v-cloak] > * {
  display: none;
}
[v-cloak]::before {
  content: 'loading...';
}
.price {
  margin-bottom: 1rem;
}

.product__scroll-pin {
  width: 1px;
  height: 1px;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.product-meta .column {
  padding-bottom: 2rem;

  @media screen and (min-width: 769px) {
    padding-top: 3rem;
    padding-bottom: 0;
  }
}

.column.highlight {
  background-color: #f5f5f5;

  @media screen and (min-width: 769px) {
    padding: 3rem;
  }
}
</style>
