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
    
    <!-- <div class="outer-canvas-bfcm" style="margin-bottom: unset;">
      <div class="canvas-bfcm">
        <div class="col-bfcm">
          <span class="entry-title-bfcm">Back to School Sale</span>
				<span class="content-split-element-bfcm">12% Off 1</span>
				<span class="content-split-element-bfcm">15% Off 2+</span>
				<span class="simple-text-bfcm">Save up to 15% on BlendJets <b class="b-hide-bfcm">|</b> <span>Sale Ends Soon</span></span>
        </div>
      </div>
    </div> -->
    
    <div class="outer-canvas-bfcm" style="margin-bottom: unset;">
        <div class="canvas-bfcm">
          <div class="col-bfcm">
            <span class="entry-title-bfcm">Back to School Sale</span>
            <span class="content-split-element-bfcm">Free JetPack Protein Smoothies</span>
            
            
            <span class="simple-text-bfcm">With Each BlendJet <b class="b-hide-bfcm">|</b> <span>Discount Applied at Checkout</span></span>
          </div>
        </div>
      </div>
  
    <!-- END BFCM - TEMP SALE HARDCODED -->

    <!-- PDP Conditional -->
    <div class="product__scroll-pin" />
    <BlendjetPDP
      v-cloak
      :productType="product.productType"
      v-if="product.productType === 'BlendJet' || product.productType === 'Jetsetter'"
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
