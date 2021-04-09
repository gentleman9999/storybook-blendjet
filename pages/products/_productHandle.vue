<!--
/****
/* Individual products are loaded with the getProduct mixin.
/* For instructions related to connecting your invetory to
/* Nacelle, please refer to:
/*
/* https://docs.getnacelle.com/getting-started.html#_2-product-settings
/****
-->
<template>
  <div class="product" >
    <!-- <section class="section">
      <div class="container"> -->
        <!-- <transition name="fade"> -->
        <!-- <template v-if="product"> -->
          <div v-if="page && page.fields.productAnnouncement" class="">
            <div v-html="productAnnouncement" class="product-productAnnouncement"></div>
          </div>
          <transition name="fade">
            <BlendjetPDP v-cloak
              v-if="['blendjet-2', 'blendjet-2-influencer-kit','blendjet-2-press-kit','youtube-blendjet-2', 'baileys-blendjet-2'].includes(product.handle)"
              :product="product"
              :page="page"
            />
            <BlendjetOnePDP v-cloak v-else-if="product.handle === 'blendjet-one'" :product="product" :page="page" /> 
            <JetpackVariantPDP v-cloak v-else-if="product.handle.includes('variant')" :product="product" :page="page" />
            <JetpackPDP v-cloak v-else-if="product.handle.includes('jetpack')" :product="product" :page="page" />
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
    </section> -->
  </div>
</template>

<script>
import getProduct from '~/mixins/getProduct'
import ProductDetails from '~/components/nacelle/ProductDetails'
import ProductDetail from '~/components/ProductDetail'
import BlendjetPDP from '~/components/blendJetPDP'
import JetpackPDP from '~/components/jetpackPDP'
import JetpackVariantPDP from '~/components/jetpackVariantPDP'
import BlendjetOnePDP from '~/components/blendJetOnePDP'
import productMetafields from '~/mixins/productMetafields'
import viewEvent from '~/mixins/viewEvent'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    ProductDetail,
    ProductDetails,
    BlendjetPDP,
    JetpackPDP,
    JetpackVariantPDP,
    BlendjetOnePDP
  },
  mixins: [
    getProduct(),
    productMetafields,
    viewEvent('product')
  ],
  computed: {
    ...mapGetters('space', ['getMetatag']),
    productAnnouncement() {
      if (this.page && this.page.fields.productAnnouncement && this.page.fields.productAnnouncement.content[0] && this.page.fields.productAnnouncement.content[0].content[0]) {
        return this.page.fields.productAnnouncement.content[0].content[0].value;
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapActions('events', ['productView'])
  },

  mounted() {
    console.log('product handle', this.product)
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

        // properties.title = fullTitle
        // if(!this.product.handle.includes('blendjet')) {
        //   meta.push({
        //   hid: 'og:title',
        //   property: 'og:title',
        //   content: fullTitle
        // })
        // }
      }

      if(this.product.handle === 'blendjet-2-influencer-kit' ||
        this.product.handle === 'blendjet-2-press-kit' ||
        this.product.handle === 'youtube-blendjet-2') {
          meta.push({
            "name": "robots",
            "content": "noindex"
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
[v-cloak] > * { display:none; }
[v-cloak]::before { content: "loading..."; }
.price {
  margin-bottom: 1rem;
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

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;

}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
