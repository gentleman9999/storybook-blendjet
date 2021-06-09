
<template>
<transition name="fade" >
  <div class="pdp-container" v-if="currentVariant" :style="[!currentVariant ? 'height:100vh': 'auto']">
    <div class="product-select">
      <div class="product-select__controls__mobile-title-container">
        <div class="product-select__controls__title">
          {{ product.title }}
        </div>
        <div class="product-select__controls__rating" >
            <loox-product-rating :product="product" />
        </div>
        <div class="product-select__controls__price">
          <product-price @DisplayPrice="setDisplayPrice" @Currency="setCurrency" v-if="currentVariant" :price="currentVariant.price" :variantId="currentVariant.id"/>
          <product-price v-show="currentVariant.compareAtPrice && currentVariant.compareAtPrice !== currentVariant.price && compareAtPrice !== displayPrice" @CompareAtLocal="setCompareAtPrice"
              :price="currentVariant.compareAtPrice" :strikethrough="true" :variantId="currentVariant.id"/>
	              <div class="product-select__controls__price__installments" v-if="country == 'US'">
            <afterpay-placement
                  data-locale="en_US"
                  :data-currency="currency"
                  :data-amount="displayPrice"
                  data-modal-theme="white"
                  data-size="xs"
                  data-logo-type="lockup"
              ></afterpay-placement>
          </div>

        </div>
      </div>
      <div class="product-select__image-carousel">
        <div v-if="variants.length > 1" class="product-select__image-carousel__prev-variant" @click="decrementVariant">
          <PrevSlide />
        </div>
        <div v-if="variants.length > 1" class="product-select__image-carousel__next-variant" @click="incrementVariant">
          <NextSlide />
        </div>


      <transition name="fade" mode="out-in">
        <picture v-if="currentVariant && currentVariant.featuredMedia">
          <source :srcset="optimizeSource({url: currentVariant.featuredMedia.src })" />
          <img class="product-select__image-carousel__img" :src="optimizeSource({url: currentVariant.featuredMedia.src })" :alt="currentVariant.featuredMedia.altText"/>
        </picture>
      </transition>

      </div>
      <div class="product-select__controls">
        <div class="product-select__controls__title-container">


          <div class="product-select__controls__title">
            {{ product.title }}
          </div>
          <div class="product-select__controls__rating">
              <loox-product-rating :product="product" />
          </div>
          <div class="product-select__controls__price">
            <product-price v-if="currentVariant" :price="currentVariant.price" :variantId="currentVariant.id"/>
            <product-price v-if="currentVariant.compareAtPrice && currentVariant.compareAtPrice !== currentVariant.price && compareAtPrice !== displayPrice"
                :price="currentVariant.compareAtPrice" :strikethrough="true" :variantId="currentVariant.id"/>
	          <div class="product-select__controls__price__installments" v-if="country == 'US'">
              <afterpay-placement
                  data-locale="en_US"
                  :data-currency="currency"
                  :data-amount="displayPrice"
                  data-modal-theme="white"
                  data-size="xs"
                  data-logo-type="lockup"
              ></afterpay-placement>
            </div>

          </div>
        </div>

        <div v-if="variants.length > 1" class="product-select__controls__variant-color">
          <div class="product-select__controls__variant-color__text">
            <span class="product-select__controls__variant-color__text__label">Color: </span><span class="product-select__controls__variant-color__text__selected-color">{{currentVariant.title}}</span>
          </div>
          <div class="product-select__controls__variant-color__swatches" >
            <product-options
              :options="allOptions"
              :variant="selectedVariant"
              @selectedOptionsSet="setSelected"
              :variants="variants"
              @clear="selectedOptions = []"
              :currentOption="currentVariant.selectedOptions[0].value"
              :key="1"
              v-if="!showMobileVariants && !showDesktopHeader"
            />
          </div>
        </div>

        <div class="product-select__controls__add-to-cart">
          <div class="product-select__controls__add-to-cart__button-group">

            <div class="product-select__controls__add-to-cart__quantity-select-container">
              <quantity-selector :quantity.sync="quantity" />
            </div>
            <div class="product-select__controls__add-to-cart__add-to-cart-button">
              <product-add-to-cart-button
                :quantity="quantity"
                :product="product"
                :variant="currentVariant"
                :allOptionsSelected="true"
                :onlyOneOption="true"
                @addedToCart="quantity = 1"
              />
            </div>
          </div>

        </div>


        <div class="product-select__controls__shipping-notification">
          <ShippingTime :country="country"/>
        </div>
        <div class="product-select__controls__payments">
          <div v-if="applePay" class="pay-with-modal__container__apple apple-pay-with" @click="expressCheckout">
               <img :src="optimizeSource({url: '/images/blendjetPDP/applepay.png'})" />
            </div>
          <div v-if="!applePay" role="button" class="product-select__controls__payments__paypal" @click="expressCheckout">
            Pay with <img class="product-select__controls__payments__paypal__logo" :src="optimizeSource({url: '/images/blendjetPDP/paypal.png'})" alt="Paypal Logo"/>
          </div>
          <div role="button" class="product-select__controls__payments__more-options" @click="$modal.show('pay-with-modal')">
            More payment options
          </div>
        </div>
        <div class="product-select__controls__value-props">
          <div class="product-select__controls__value-props__guarantee" @click="$modal.show('guarantee-modal')">
              <Guarantee :size="'40px'" /> <span class="product-select__controls__value-props__guarantee__text">30 day money back guarantee</span>
          </div>
          <div class="product-select__controls__value-props__badges">
            <a target="_blank" rel="noopener noreferrer nofollow" class="product-select__controls__value-props__badges__img"
               :href="mcafeeLink">
                  <img :src="optimizeSource({ url: '/images/blendjetPDP/TrustedSite.svg' })" alt="TrustedSite Seal" style="border: 1px solid #ccc;border-radius: 3px;" />
            </a>
            <a target="_blank" rel="noopener noreferrer nofollow" class="product-select__controls__value-props__badges__img"
               :href="nortonLink">
              <img :src="optimizeSource({url: '/images/blendjetPDP/nortonsiteseal.svg'})" alt="Norton Secured Logo"/>
            </a>
            <a target="_blank" rel="noopener noreferrer nofollow" class="product-select__controls__value-props__badges__img"
               :href="bbbLink">
              <img :src="optimizeSource({url: '/images/blendjetPDP/BBB-Seal.svg'})" alt="Better Business Bureau Logo"/>
            </a>
          </div>
        </div>

        <transition name="fade">
          <div class="product-select__controls__add-to-cart__mobile-float" v-show="showMobileHeader">
            <div class="product-select__controls__add-to-cart__button-group">
              <!-- <transition name="expand" > -->
                <div v-if="variants.length > 1" class="product-select__controls__add-to-cart__selected-swatch mobile-swatch"  @click.prevent="toggleMobileVariants">
                  <product-option-swatch
                    :value="currentVariant.selectedOptions[0].value"
                    :optionName="'Color'"
                    :swatchStyle="'bubble'"
                    :class="{selected: true}"
                    :variants="variants"
                    :selectedOptions="currentVariant.selectedOptions"
                  />
                </div>
              <!-- </transition> -->

              <div class="product-select__controls__add-to-cart__quantity-select-container">
                <quantity-selector :quantity.sync="quantity" />
              </div>
              <div class="product-select__controls__add-to-cart__add-to-cart-button">
                <product-add-to-cart-button
                  :quantity="quantity"
                  :product="product"
                  :variant="currentVariant"
                  :allOptionsSelected="true"
                  :onlyOneOption="true"
                  @addedToCart="quantity = 1"
                />
              </div>
            </div>

          </div>
        </transition>
        <transition name="fade">
          <div class="mobile-variant-select" v-if="showMobileVariants ">
            <div class="mobile-variant-select__close" @click="toggleMobileVariants">
              <Close />
            </div>
            <div class="product-select__controls__variant-color__text">
              <span class="product-select__controls__variant-color__text__label">Color: </span><span class="product-select__controls__variant-color__text__selected-color">{{currentVariant.title}}</span>
            </div>
            <product-options
              :options="allOptions"
              :variant="selectedVariant"
              @selectedOptionsSet="setSelected"
              :variants="variants"
              @clear="selectedOptions = []"
              :currentOption="currentVariant.selectedOptions[0].value"
              :key="3"
            />
            <div class="mobile-variant-select__shipping">
          <ShippingTime :country="country"/>
            </div>
          </div>
        </transition>

        <modal name="guarantee-modal" width="414px" height="auto" :adaptive="true">
          <div class="guarantee-modal__container">
            <div slot="top-right" @click="$modal.hide('guarantee-modal')">
              <Close />
            </div>
            <Guarantee />
            <div class="guarantee-modal__container__heading">
              30-day Money Back Guarantee
            </div>
            <div class="guarantee-modal__container__text">
              We believe in 100% customer satisfaction and that is why we are offering all customers a 30 day money-back guarantee! If you are not satisfied with your BlendJet blender, you may return the item within 30 days from the order date for a full refund. If you don't like your product, get a full refund within 30 days, no questions asked. <br/>
              — <br />
              Please <a class="guarantee-modal__container__text__contact-link" >contact our customer happiness</a> team to start your return process.
            </div>
          </div>
        </modal>

        <modal name="pay-with-modal" width="414px" height="auto" :adaptive="true">
          <div class="pay-with-modal__container">
            <div slot="top-right" @click="$modal.hide('pay-with-modal')">
              <Close />
            </div>
            <div class="pay-with-modal__container__text">
              Pay with
            </div>

            <div class="pay-with-modal__container__amazon" @click="expressCheckout">
              <img :src="optimizeSource({url: '/images/blendjetPDP/amazonpay.png'})" />
            </div>
            <div v-if="applePay" class="pay-with-modal__container__apple" @click="expressCheckout">
              <img :src="optimizeSource({url: '/images/blendjetPDP/applepay.png'})" />
            </div>
            <div class="pay-with-modal__container__paypal" @click="expressCheckout">
              <img class="pay-with-modal__container__paypal__logo" :src="optimizeSource({url: '/images/blendjetPDP/paypal.png'})" />
            </div>
          </div>
        </modal>
      </div>
    </div>

    <div v-if="page && page.fields.headerText" class="blendjet-banner">
      <div class="blendjet-banner__content-block">
        <RichTextRenderer :document="page.fields.headerText" />
      </div>
    </div>

    <transition name="fade">
      <div class="header-product-select" v-if="showDesktopHeader">
        <div class="header-product-select__info-container">
          <div class="header-product-select__thumbnail">
            <img class="header-product-select__thumbnail__img" :src="optimizeSource({url: currentVariant.featuredMedia.thumbnailSrc})" />
          </div>
          <div class="header-product-select__title-container">
            <div class="header-product-select__title-container__title">
              {{product.title}}
            </div>
            <div class="header-product-select__title-container__price">
              <product-price v-if="currentVariant" :price="currentVariant.price" :variantId="currentVariant.id"/>
              <product-price v-if="currentVariant.compareAtPrice && currentVariant.compareAtPrice !== currentVariant.price && compareAtPrice !== displayPrice"
                  :price="currentVariant.compareAtPrice" :strikethrough="true" :variantId="currentVariant.id" />
            </div>
          </div>
        </div>
        <div class="header-product-select__controls-container">
        <div v-if="variants.length > 1" class="header-product-select__swatches">

          <div class="dropdown" tabindex="0"  @focusout="showHeaderVariants = false" @click.prevent="toggleHeaderVariants">
            <div class="dropbtn" role="button">
              <div class="dropbtn__swatch">
              <product-option-swatch
                    :value="currentVariant.selectedOptions[0].value"
                    :style={}
                    :optionName="'Color'"
                    :swatchStyle="'bubble'"
                    :class="{selected: false}"
                    :variants="variants"
                    :selectedOptions="currentVariant.selectedOptions"
                  />
              </div>
              <div class="dropbtn__text">
                <div class="dropbtn__text__color">
                  {{currentVariant.title}}
                </div>
                <div class="dropbtn__text__shipping">
                  <ShippingTime :size="'short'" :country="country"/>
                </div>
              </div>
              <div class="dropbtn__caret-down">
                <CaretDown />
              </div>
            </div>
            <transition name="fade">
              <div v-if="showHeaderVariants" class="dropdown-content">
                <div class="dropdown-content__swatches">
                  <product-options
                    :options="allOptions"
                    :variant="selectedVariant"
                    @selectedOptionsSet="setSelected"
                    :variants="variants"
                    @clear="selectedOptions = []"
                    :currentOption="currentVariant.selectedOptions[0].value"
                    :key="2"
                  />
                </div>
              </div>
            </transition>
            </div>
          </div>
          <div class="header-product-select__add-buttons">
            <div class="add-to-cart-buttons">
                <div class="quantity-select-container">
                  <quantity-selector :quantity.sync="quantity" />
                </div>
                <div class="add-to-cart">
                  <product-add-to-cart-button
                    :quantity="quantity"
                    :product="product"
                    :variant="currentVariant"
                    :allOptionsSelected="true"
                    :onlyOneOption="true"
                    @addedToCart="quantity = 1"
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="media-content" >
      <div v-if="heroImages && heroImages.length" class="media-content__carousel">
        <b-carousel class="media-content__carousel"
          :arrow="true"
          :repeat="true"
          :indicator="true"
          :has-drag="true"
          :autoplay="false"
          v-model="heroIndex"
        >
          <b-carousel-item v-for="(image, i) in heroImages" :key="i">
            <section class="`hero is-large`">
              <span class="image">
                <img class="media-content__carousel__img" :src="optimizeSource({url: image})">
              </span>

            </section>
          </b-carousel-item>
        </b-carousel>
      </div>
      <div class="media-content__main" v-if="loadDescription && page && page.fields.features">
        <div class="media-content__main__features">
          <div v-if="page && page.fields.features" class="features-container sticky">
            <div class="features-column">
              <div class="features-heading">
                {{ page.fields.features.fields.title }}
              </div>
              <div v-if="page.fields.features.fields.description" class="features-text">
                <RichTextRenderer :document="page.fields.features.fields.description" />
              </div>
              <div
                v-if="page.fields.features.fields.features"
                v-for="feature in page.fields.features.fields.features"
                class="features-row"
              >
                <div class="features-icon">
                  <ModelIcon :type="feature.fields.icon"/>
                </div>
                <div class="features-text-block">
                  <div class="features-text-block__title">
                    {{ feature.fields.title }}
                  </div>
                  <div class="features-text-block__text">
                    <RichTextRenderer :document="feature.fields.description" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="media-content__main__details">

          <div v-for="(section, i) of description" :key="i" class="media-content__main__details__content-block">
            <div class="media-content__main__details__content-block__heading">
              {{section.heading}}
            </div>
            <div class="media-content__main__details__content-block__text">
                <RichTextRenderer :document="section.text" />
            </div>
            <div v-if="section.video.length && section.video.includes('video')" class="media-content__main__details__content-block__media rounded-video-container" >
              <VideoContainer :source="section.video" class="media-content__main__details__content-block__media__video" />
            </div>
            <div v-if="section.video.includes('images')" class="media-content__main__details__content-block__image">
              <img class="media-content__main__details__content-block__img" :src="optimizeSource({url: section.video})" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="reviews" id="reviews">
      <loox-product-reviews :product="product" />
    </div>

    <div class="jetpacks" v-if="loadDescription">
      <JetpackCrossSell  :heading="'Power up with Jetpacks'" />
    </div>

  </div>
</transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import ProductPrice from '~/components/nacelle/ProductPrice'
const JetpackCrossSell = () => import('~/components/jetpackCrossSell')
const BlendjetFeatures = () => import('~/components/blendjetFeatures')
import ModelIcon from '~/components/ModelIcon'
import ProductVariantSelect from '~/components/nacelle/ProductVariantSelect'

import ProductOptions from '~/components/nacelle/ProductOptions'
import ProductOptionSwatches from '~/components/nacelle/ProductOptionSwatches'
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'
import QuantitySelector from '~/components/nacelle/QuantitySelector'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
import allOptionsSelected from '~/mixins/allOptionsSelected'
import availableOptions from '~/mixins/availableOptions'
import ShippingTime from '~/components/shippingTime'

const VideoContainer = () => import('~/components/VideoContainer')
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

import imageOptimize from '~/mixins/imageOptimize'
import debounce from 'lodash.debounce'

import Guarantee from '~/components/svg/30dayGuarantee'
import Close from '~/components/svg/modalClose'
import Info from '~/components/svg/info'
import CaretDown from '~/components/svg/caretDown'
import BlnExtend from '~/components/svg/blnExtend'
import NextSlide from '~/components/svg/NextSlide'
import PrevSlide from '~/components/svg/PrevSlide'

export default {
  data() {
    return {
      imageStyle: {
        height: '252px',
        width:'auto'
      },
      currentVariant: null,
      quantity: 1,
      variants:[],
      selectedOptions: [],
      showMobileVariants: false,
      showMobileHeader: false,
      showDesktopHeader: false,
      showHeaderVariants: false,
      loadDescription: false,
      scrollY: 0,
      screenWidth: null,
      heroUrl: null,
      imgWidth: 0,
      mcafeeLink: 'https://www.trustedsite.com/verify?host=blendjet.com',
      nortonLink: 'https://seal.digicert.com/seals/popup/?tag=6CDZP5Ti&url=blendjet.com',
      bbbLink: 'https://www.bbb.org/us/ca/concord/profile/online-shopping/blendjet-1116-882016/#sealclick',

      description: [],
      variantMedia: {},
      applePay: false,
      country: 'US',
      currency: 'USD',
      displayPrice: 0,
      compareAtPrice: 0,
      heroIndex: 0,
      variantIndex: 0,
      metaTitle: null,
      metaDescription: null
    }
  },
  components: {
    VideoContainer,
    ProductPrice,
    ModelIcon,
    RichTextRenderer,
    JetpackCrossSell,
    BlendjetFeatures,
    Guarantee,
    Close,
    Info,
    CaretDown,
    ProductVariantSelect,
    ProductOptions,
    ProductOptionSwatches,
    ProductOptionSwatch,
    QuantitySelector,
    ProductAddToCartButton,
    ShippingTime,
    BlnExtend,
    NextSlide,
    PrevSlide
  },
  mixins: [imageOptimize, availableOptions, allOptionsSelected],
  props: {
    product: {
      type: Object,
      default: () => {}
    },
     country: {
      type: Object,
      default: () => {}
    },
    page: {
      type: Object,
      default: () => {}
    }
  },

  head() {
    let productCurrency = this.currency
    let productPrice = this.displayPrice
    let image = this.selectedVariant.featuredMedia ? this.selectedVariant.featuredMedia.src : ''
    let properties = {}
    let meta = []
    let script = [{
        type: 'application/ld+json',
        json: {
          "@context" : "http://schema.org",
          "@type": "Product",
          "name": "BlendJet 2",
          "image": [
            `${image}`
          ],
          "offers": {
            "@type": "Offer",
            "url": "https://blendjet.com/products/blendjet-2",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "price": `${productPrice}`,
            "priceCurrency": `${productCurrency}`,
          }
        }
      }]

    if(this.metaTitle) {
      properties.title = this.metaTitle
    }

    if(this.metaDescription) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: this.metaDescription
      })
    }

    return {
      ...properties, meta, script
    }
  },
  computed: {
    ...mapState('user', ['locale']),
    ...mapGetters('cart', ['cartBalance']),
    // currentVariant() {
    //   if (this.selectedVariant) {
    //     return this.selectedVariant
    //   } else if (
    //     this.product &&
    //     this.product.variants &&
    //     this.product.variants.length
    //   ) {
    //     return this.product.variants[0]
    //   }
    //
    //   return undefined
    // }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    ...mapMutations('cart', ['setCartError']),
    ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem'
    ]),
    ...mapActions('checkout', ['processCheckout']),
    setDefaultVariant() {
      if (this.currentVariant) {
        return this.currentVariant
      } else if (
        this.product &&
        this.product.variants &&
        this.product.variants.length
      ) {
        if(this.$route.query && this.$route.query.variant) {
           let variantId = btoa(`gid://shopify/ProductVariant/${this.$route.query.variant}`)
           return this.product.variants.filter((variant) => {
             return variant.id === variantId
           })[0]
        } else {
          for(let i = 0; i < this.product.variants.length; i++) {
            if(this.product.variants[i].availableForSale === true) {
              return this.product.variants[i]
            }
          }
        }
      }
      return this.product.variants[0]
    },
    setDisplayPrice(data) {
      this.displayPrice = data
    },
    setCompareAtPrice(data) {
      this.compareAtPrice = data
    },
    setCurrency(data) {
      this.currency = data
    },
    handleScroll (event) {
      this.scrollY = window.scrollY;
      if (this.screenWidth > 768) {
        if(window.scrollY > 300) {
          this.showDesktopHeader = true;
        } else {
          this.showDesktopHeader = false;
          this.showHeaderVariants = false;
        }
      } else {
        if(window.scrollY < 900) {
          this.showMobileHeader = false
          if(this.showMobileVariants ) {
            this.showMobileVariants = false
          }

        } else {
          this.showMobileHeader = true
        }
      }

      if(window.scrollY > 300) {
        this.loadDescription = true
      }
    },
    camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
    },
    updateVariant(variant) {
      this.currentVariant = variant
      this.variantIndex = this.variants.findIndex((variant) => {
        return variant.title == this.currentVariant.title
      })
    },
    incrementVariant() {
      if(this.variantIndex === this.variants.length -1) {
        this.variantIndex = 0;
      } else {
         this.variantIndex++
      }
      const newVar = this.variants[this.variantIndex]
      this.updateVariant(newVar)
      // this.currentVariant = {...this.product.variants[this.variantIndex]}
    },
    decrementVariant() {

      if(this.variantIndex === 0) {
        this.variantIndex = this.variants.length - 1
      } else {
        this.variantIndex--
      }
      let newVar = this.variants[this.variantIndex]
      this.updateVariant(newVar)
    },
    toggleMobileVariants() {
      this.showMobileVariants = !this.showMobileVariants
    },
    toggleHeaderVariants() {
      this.showHeaderVariants = !this.showHeaderVariants
    },
    iOS() {
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    },
    productId() {
      if (this.product && this.product.pimSyncSourceProductId) {
        return Buffer.from(this.product.pimSyncSourceProductId, 'base64')
          .toString('binary')
          .split('/')
          .pop()
      }

      return null
    },

    expressAdd() {

      const lineItem = {
          image: this.product.featuredMedia,
          title: this.product.title,
          variant: this.currentVariant,
          quantity: this.quantity || 1,
          productId: this.product.id,
          handle: this.product.handle,
          vendor: this.product.vendor,
          tags: this.product.tags,
          metafields: []
        }

        this.addLineItem(lineItem)

    },

    async expressCheckout() {
      if(this.currentVariant.availableForSale) {
        await this.expressAdd()
        if(this.cartBalance) {
          try {
            await this.processCheckout({
              async beforeCreate() {
                // Allows processing of cart before checkout creation.
              },
              async beforeRedirect() {
                // Allows processing after checkout create and before redirecting.
              }
            })
          } catch(err) {
            console.log(err)
            this.setCartError(err)
            // this.loading = false
          }
        } else {
          this.showCart()
        }
      }
    }
  },
  watch: {
    //Variant from mixin
    selectedVariant() {
      this.updateVariant(this.selectedVariant)
    },
    //Local Variant
    currentVariant() {
      if(this.variantMedia[this.camelize(this.currentVariant.title)]) {
        this.heroImages = this.variantMedia[this.camelize(this.currentVariant.title)].heroImages

      } else {
        this.heroImages = [];
      }
      this.heroIndex = 0

      let variantId = atob(this.currentVariant.id).split('/').pop()
      let path = `${this.$route.path}?variant=${variantId}`
      this.$router.push(path)
    }
  },
  created() {
    // this.currentVariant = this.setDefaultVariant();
  },
  async mounted() {

    if(process.client) {

      this.screenWidth = window.innerWidth
      this.imgWidth = 2600

      this.variants = this.product.variants.filter((variant)=>variant.availableForSale)
      // this.variants = this.product.variants



      if(window.ApplePaySession) {
        this.applePay = true;
      }
      const vm = this

      let entry = this.page

      if (entry && entry.fields) {
        // Product Hero Images
        if (entry.fields.variants) {
          console.log(entry.fields.variants)
          entry.fields.variants.forEach((node) => {
            if (node.fields.heroImages) {
              vm.variantMedia[node.fields.title] = {
                heroImages: node.fields.heroImages.map((image) => {
                  return `${image.fields.file.url}?w=2100`
                })
              }
            }
          })
        }

        // Product Descriptions
        if (entry.fields.productDescription) {
          let sections = entry.fields.productDescription

          vm.description = sections.map((node) => {
            return {
              heading: node.fields.heading,
              text: node.fields.text,
              video: node.fields.video ? node.fields.video.fields.file.url : ''
            }
          })
        }

        // Meta fields
        if(entry.fields.metaTitle) {
          this.metaTitle = entry.fields.metaTitle
        }
        if(entry.fields.metaDescription) {
          this.metaDescription = entry.fields.metaDescription
        }
      }



      this.currentVariant = this.setDefaultVariant()

      this.handleScroll();
      this.handleDebouncedScroll = debounce(this.handleScroll, 0);

      window.addEventListener('scroll', this.handleDebouncedScroll, {
        passive: true
      });
    }
  },
  beforeDestroy() {
    if(process.client) {
      window.removeEventListener('scroll', this.handleDebouncedScroll)
    }

  }
}
</script>

<style lang="scss" scoped>

.price {
  margin-bottom: 1rem;
}

.pdp-container {

}

.product-select {
  display: flex;
  flex-flow: row nowrap;
  min-height: 900px;
  @include respond-to('small') {
    height: auto;
    min-height: none;
    flex-flow: row wrap;
  }

  &__image-carousel {
    background-image: linear-gradient(to bottom, #ededf5 1%, #ffffff 49%);
    width: 65%;
    display: flex;
    justify-content: center;
    height: 900px;
    position: relative;
    background: white;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */

    @include respond-to('small') {
      width: 100%;
      padding-top: 0px;
      height: 400px;
    }

    &__prev-variant {
      position: absolute;
      top: 50%;
      left: 20px;
      cursor: pointer;
      @include respond-to('small') {
        left: 10px;
      }
    }

    &__next-variant {
      position: absolute;
      top: 50%;
      right: 20px;
      cursor: pointer;
      @include respond-to('small') {
        right: 10px;
      }
    }

    picture {
      display: flex;
      align-items: center;
    }

    &__img {
      margin: 0 auto;
      display: block;

      @include respond-to('small') {
        height: auto;
        height: 400px;
      }
    }
  }

  &__controls {
    width: 35%;
    min-width: 550px;
    display: flex;
    flex-flow: column nowrap;
    background-color: $primary-purple-tint;
    text-align: center;
    padding: 0 75px 30px 75px;
    height: 900px;

    @include respond-to('small') {
      padding: 0;
      width: 100%;
      min-width: auto;
      height: auto;
    }

    &__mobile-title-container {
      width: 100%;

      @media screen and (min-width: 768px) {
        display: none
      }
    }

    &__title-container {
      @include respond-to('small') {
        display: none;
      }
    }

    &__title {
      font-family: Medium;
      font-size: 28px;
      line-height: 1.14;
      letter-spacing: 3.5px;
      margin-top: 45px;
      color: $primary-purple;
      margin-bottom: 7px;
      text-align: center;
      text-transform: uppercase;

      @include respond-to('small') {
        font-size: 24px;
        line-height: 1.17;
        margin-top: 4px;
        margin-bottom: 4px;
      }
    }

    &__rating {
      display: flex;
      justify-content: center;
      font-family: Regular;
      font-size: 13px;
      color: $primary-purple;

      margin-bottom: 10px;

      & > a {
        color: $primary-purple;
      }

    }

    &__price {
      color: $primary-purple;
      font-family: Bold;
      font-size: 18px;
      line-height: 0.83;
      letter-spacing: 3.5px;
      margin-bottom: 31px;
      text-align: center;

      @include respond-to('small') {
        font-size: 14px;
        line-height: 1.07;
        letter-spacing: 2.04px;
        margin-bottom: 18px;
      }

      &__installments {
        font-size: 13px;
        font-family: Regular;
        line-height: 1.38;
        letter-spacing: 0.46px;
        margin-top: 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        @include respond-to('small') {
          margin-top: 6px;
        }

        &__logo {
          height: 15px;
          margin-top: 4px;
          margin-left: 7px;
        }
      }
    }

    &__variant-color {

      &__text {
        font-family: Bold;
        font-size: $text-small;
        text-transform: uppercase;
        line-height: 1.33;
        letter-spacing: 1.75px;
        margin-bottom: 20px;

         &__selected-color {
          color: $primary-purple;
        }

        &__label {
          color: $grayscale-gray;
        }

        @include respond-to('small') {
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }


      &__swatches {
        // margin-bottom: 20px;
        // height: 120px;
        // max-width: 390px;
        // ::v-deep
        min-height: 170px;
        @include respond-to('small') {
          height: auto;
          min-height: 115px;
        }
      }
    }

    &__add-to-cart {
      ::v-deep .add-to-cart-button {
        width: 275px;
      }
      @include respond-to('small') {
        // position: fixed;
        // width: 100%;
        // bottom: 0;
        height: 75px;
        // background-color: $primary-purple-tint;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__button-group {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 1s ease-in-out;

        @include respond-to('small') {
          justify-content: space-between;
        }
      }

      &__add-to-cart-button {
        ::v-deep .add-to-cart-button {
          @include respond-to('small') {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      }


      &__mobile-float {
        @include respond-to('small') {
          position: fixed;
          width: 100%;
          bottom: 0;
          background-color: $primary-purple-tint;
          z-index: 10;
          height: 75px;
          // background-color: $primary-purple-tint;

          display: flex;
          align-items: center;
          justify-content: center;
        }

      }

      &__selected-swatch {
        ::v-deep .bubble {
          margin-left: 0;
          margin-bottom: 0;
        }

        @media screen and (min-width: 768px) {
          display: none
        }
      }

      &__quantity-select-container {
        margin-right: 10px;
        @include respond-to('small') {
          margin-right: 5px;
          margin-left: 2px;
        }
      }
    }

    &__shipping-notification {
      font-family: Bold;
      letter-spacing: 1.75px;
      text-align: center;
      line-height: 1.33;
      font-size: $text-small;
      // margin-bottom: 20px;
      margin-top: 20px;

      height: 40px;
      text-transform: uppercase;

      @include respond-to('small') {
        margin-top: 10px;
        margin-bottom: 15px;
        height: auto;
      }

      &__label {
        color: $primary-purple;
      }

      &__countdown {
        color: $secondary-purple-2;
      }
    }

    &__extend-warranty {
      display: flex;
      flex-flow: column nowrap;
      // flex-flow: row nowrap;
      justify-content: center;
      margin-bottom: 25px;
      cursor: pointer;
      @include respond-to('small') {
        margin-bottom: 10px;
      }

      &__text {
        font-family: Regular;
        margin-bottom: 15px;
        color: $primary-purple;
        font-size: 13px;
        letter-spacing: 0.46px;
        line-height: 1.38;
        display: flex;
        justify-content: center;
        align-items: center;
        // margin-top: 25px;

      }

      &__logo {
        margin-left: 7px;
      }

      &__button-group {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
      }

      &__button {

        font-size: 10px;
        letter-spacing: 0.83px;
        line-height: 1.4;
        padding: 0 16px;

        display: flex;
        align-items: center;
        cursor: pointer;

        @include respond-to('small') {
          padding: 0 10px;
        }

        &:first-child {
          margin-right: 7px;
          // cursor: pointer;
        }

        &:last-child {
          margin-left: 7px;
        }
      }
    }

    &__payments {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 20px;

      &__paypal {
        @include button-primary('purple-ghost');
        width: 370px;
        background-color: #ffc51f;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        margin-bottom: 25px;
        border: none;

        @include respond-to('small') {
          // width: 370px;
        }

        @media screen and (max-width: 320px) {
          width: 300px;
        }

        &__logo {
          height: 19px;
          margin-left: 10px;
        }
      }

      &__more-options {
        @include button-primary('purple-ghost');
        width: 370px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        @include respond-to('small') {
          // width: 370px;
        }
         @media screen and (max-width: 320px) {
          width: 300px;
        }
      }
    }

    &__value-props {
      display: flex;
      flex-flow: column nowrap;

      &__guarantee {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        cursor: pointer;

        &__text {
          margin-left: 15px;
          color: $primary-purple;
          text-transform: uppercase;
          font-family: Bold;
          font-size: $text-small;
          letter-spacing: 1.75px;
          line-height: 1.17;
        }
      }

      &__badges {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        &__img {
          &:first-child {
            margin-right: 25px;
          }
          &:last-child {
            margin-left: 25px;
          }
        }
      }
    }
  }
}

.mobile-swatch {
  margin-right: 5px;
   ::v-deep .bubble .inside-color {
      height: 44px;
      width: 44px;
    }
}

.extend-active {
  @include button-primary('purple');
  border: 2px solid #373975;
  height: 30px;
  padding: 0 16px;
  font-size: 10px;
  @include respond-to('small') {
    padding: 0 10px;
  }
}

.extend-inactive {
  @include button-primary('purple-ghost');
  height: 30px;
  padding: 0 16px;
  font-size: 10px;
  @include respond-to('small') {
    padding: 0 10px;
  }
}

.guarantee-modal {

  &__container {
    padding: 40px;

    &__heading {
      color: $primary-purple;
      font-family: Medium;
      font-size: 24px;
      letter-spacing: 3.5px;
      line-height: 1.17;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 23px;
      margin-top: 8px;
    }

    &__text {
      font-family: Regular;
      font-size: 14px;
      line-height: 1.29;
      letter-spacing: 0.58px;
      text-align: center;
      color: #626262;
      margin-bottom: 27px;
    }
  }
}

.extend-modal {

  &__container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 25px;
    font-family: Regular;
    font-size: 14px;
    line-height: 1.33;
    letter-spacing: 0.5px;
    color: $primary-purple;
  }

  &__svg-container {
    margin-bottom: 20px;
  }

  &__text {
    max-width: 340px;

    &__block {
      margin-bottom: 15px;
    }

    &__list {

      &__subheading {
        font-size: 16px;
        font-family: Bold;
        letter-spacing: 2.5px;
        margin-bottom: 15px;
      }

      &__items {
        display: list-item;
        list-style-type: disc;
        text-align: left;
      }
    }

    &__plan-details {
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }

  &__why-choose {

    &__support {
      display: flex;
      align-items: center;

      margin-bottom: 15px;

      &__icon {
        margin-right: 10px;
      }
    }

    &__fees {
      display: flex;
      align-items: center;

      &__icon {
        margin-right: 10px;
      }
    }
  }


}

.apple-pay-with {
  width: 370px;

   @media screen and (max-width: 320px) {
          width: 300px;
        }
}

.pay-with-modal {
  &__container {
    padding: 1rem;
    display: flex;
    justify-content: center;
    // align-items: center;
    flex-flow: column nowrap;


    &__text {
      font-family: Bold;
      color: $primary-purple;
      font-size: $text-small;
      text-transform: uppercase;
      line-height: 1.17;
      letter-spacing: 1.75px;
      margin-bottom: 20px;
      text-align: center;

    }
    &__amazon {
      @include button-primary('white');
      background-color: #FFC51F;
      height: 50px;
      margin-bottom: 15px;
    }

    &__apple {
      @include button-primary('white');
      background-color: black;
      height: 50px;
      margin-bottom: 15px;
    }

    &__paypal {
      @include button-primary('white');
      background-color: #ffc51f;
      height: 50px;

      &__logo {
        height: 19px;
      }
    }
  }
}

.mobile-variant-select {
  position: fixed;
  bottom: 75px;
  background-color: $primary-purple-tint;
  width: 100%;
  // height: 220px;
  z-index: 10;
  padding-top: 20px;

  &__shipping {
    font-size: $text-small;
    font-family: Bold;
    line-height: 1.33;
    letter-spacing: 1.75px;
    text-transform: uppercase;
    color: $secondary-purple-2;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.blendjet-banner {
  height: 205px;
  @include gradient-primary-purple-turquoise(to bottom right);
  display: flex;
  justify-content: center;
  align-items: center;
  // background-image: linear-gradient(350deg, #1e90bb 110%, #373795 14%);


  &__content-block {
    // width: 681px;
    max-width: 700px;
    color: $grayscale-white;
    text-align: center;
    font-family: Medium;

    @include respond-to('small') {
      width: auto;
      padding: 15px;
    }

    h2 {
      font-size: 24px;
      line-height: 1.17;
      letter-spacing: 4px;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    &__content {
      font-size: 16px;
      line-height: 1.25;
      letter-spacing: 0.5px;

    }
  }
}

.header-product-select {
  height: 110px;
  background-color: $grayscale-white;
  display: flex;
  position: fixed;
  width: 100%;
  top: 100px;
  z-index: 10;
  padding-right: 45px;
  padding-left: 45px;

  @include respond-to('small') {
    display: none;
  }

  &__thumbnail {

    &__img {
      height: 75px;
    }
  }

  &__info-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 50%;
  }

  &__controls-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50%;
  }

  &__title-container {
    margin-left: 32px;
    &__title {
      font-family: Medium;
      font-size: 24px;
      line-height: 1.33;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: $primary-purple;
    }

    &__price {
      font-size: $text-small;
      font-family: Bold;
      line-height: 1.17;
      letter-spacing: 1.75px;
      color: $primary-purple;
    }

  }

  &__swatches {
    margin-right: 20px;
  }

  &__add-buttons {

  }
}

.media-content {


  &__carousel {
    height: 800px;
    @include respond-to('small') {
      height: auto;
    }
    &__img {
      height: 800px;
      max-width: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center;
      @include respond-to('small') {
        height: 400px;
      }
    }
  }

  &__hero-banner {

    &__img {
      // height: 600px;
      object-position: center;
      object-fit: cover;
      // width: auto;
    }
  }

  &__main {
    display: flex;
    flex-flow: row wrap;

    &__features {
      // @include gradient-primary-purple-turquoise(to bottom);
      background-color: #33499D;
      width: 50%;
      padding: 50px;

      @include respond-to('small') {
        width: 100%;
        padding: 20px 0 0 0;
      }
    }

    &__details {
      width: 50%;
      background: $primary-purple-tint;
      padding-top: 50px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      @include respond-to('small') {
        width: 100%;
      }

      &__content-block {

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        margin-bottom: 80px;
        width: 520px;
        // &:nth-last-child()

        @include respond-to('small') {
          width: auto;
        }

        &__heading {
          font-size: 24px;
          font-family: Bold;
          letter-spacing: 4px;
          line-height: 1.17;
          text-transform: uppercase;
          text-align: center;
          color: $primary-purple;
          margin-bottom: 15px;
          max-width: 475px;

          @include respond-to('small') {
            font-size: 18px;
            line-height: 1.22;
            letter-spacing: 2.5px;
            padding: 0 15px;
          }
        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.51px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
          padding-right: 15px;
          padding-left: 15px;
        }

        &__media {
          &__video {
            width: 520px;
            object-fit: contain;

            @include respond-to('small') {
              height: auto;
              width: 100%;

              video {
                width: 100%;
              }
            }
          }
        }

        &__image-container {
          display: flex;
          justify-content: center;
        }

        &__img {
          border-radius: 12px;
          object-fit: cover;
          object-position: center;
          @include respond-to('small') {
            border-radius: 0;
          }
        }
      }

      &__specs {

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 520px;
        padding: 0 20px;
        @include respond-to('small') {
          width: auto;
        }
        // padding: 15px;


        &__heading {
          font-size: 24px;
          font-family: Bold;
          letter-spacing: 4px;
          line-height: 1.17;
          text-transform: uppercase;
          text-align: center;
          color: $primary-purple;
          margin-bottom: 15px;

        }

        &__text {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          text-align: center;
          margin-bottom: 35px;
          padding: 0 15px;
        }

        &__list {
          font-family: Regular;
          font-size: 14px;
          letter-spacing: 0.5px;
          line-height: 1.29;
          color: $grayscale-gray;
          // text-align: center;
          // margin-bottom: 35px;
          & ul {
            list-style-type: square;
            padding: 0 35px;
          }
          & li {
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}

.rounded-video-container {
    width: 520px;
    height: 520px;
    border-radius: 12px;
    overflow: hidden;

    @include respond-to('small') {
      width: auto;
      height: auto;
      border-radius: 0;
    }
}

.reviews {
  height: auto;
  padding: 20px;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;

}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}


.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
  z-index: 10;
  width: 100%;

  &__swatch {
    // margin-top: 7px;
    ::v-deep .inside-color {
      width: 30px;
      height: 30px;
    }
  }

  &__caret-down {
    position: absolute;
    right: 15px;
  }
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  color: $primary-purple;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border: 2px solid $grayscale-black;
  border-radius: 25px;
  align-items: center;
  width: 231px;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform:uppercase;
  font-size: $text-small;
  background-color: $grayscale-white;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.dollar-strike {
    text-decoration: line-through;
  opacity: 0.3;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  top: -0.5px;
  background-color: $grayscale-white;
  border-radius: 25px;
  width: 231px;
  min-width: 160px;
  box-shadow: none;
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $grayscale-black;
  border-top: none;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;

  &__swatches {
    margin-top: 60px;
    // ::v-deep .
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

.slide-enter-active {
  animation: slideInLeft;
  animation-duration: 0.6s
}

.slide-leave-active {
  animation: slideOutLeft;
  animation-duration: 0.6s
}

.carousel-arrow .icon {
    background: #f6f5fd !important;

}


.expand-enter-active {
  animation: expand .6s;
}
.expand-leave-active {
  animation: expand .6s reverse;
}
@keyframes expand {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}




.sticky {
  position: sticky;
  top: 260px;
}

.features-container {
  display: flex;
  justify-content: center;
  color: $grayscale-white;


}

.features-heading {
  font-size:24px;
  font-family: Medium;
  letter-spacing: 4px;
  line-height: 1.17;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 48px;
}

.features-column {
  width: 60%;
  display: flex;
  flex-flow: column nowrap;
  @include respond-to('small') {
    width: 80%;
  }
}

.features-row {
  display: flex;
  margin-bottom: 40px;
  @include respond-to('small') {
    flex-flow: column nowrap;
  }
}

.features-icon {
  display: flex;
  justify-content: center;
  align-items: center;

  &__img {
    height: 70px;
    width: 70px;
    max-width: auto;
  }
}

.features-text-block {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin-left: 25px;

  @include respond-to('small') {
    margin-left: 0;
    margin-top: 20px;
  }

  &__title {
    font-family: Bold;
    font-size: $text-small;
    letter-spacing: 1.75px;
    line-height: 1.17;
    text-transform: uppercase;

    @include respond-to('small') {
      text-align: center;
    }
  }

  &__text {
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.29;
    @include respond-to('small') {
      text-align: center;
    }
  }
}
.blendjet-banner__content-block a{
  color:#ffffff
}
.blendjet-banner__content-block a:hover{
  color:#000;
}


</style>
