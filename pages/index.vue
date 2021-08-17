<template>
  <div class="page">
    <div v-if="this.noPageData">
      <div class="section section__hero-banner">
        <div class="section__hero-banner__cta">
          <div class="section__hero-banner__cta__text">
            <transition name="slideRight">
              <div v-if="loaded" class="section__hero-banner__cta__text__line1">
                The Original
              </div>
            </transition>
            <transition name="slideLeft">
              <div v-if="loaded" class="section__hero-banner__cta__text__line2">
                Portable Blender
              </div>
            </transition>
          </div>
          <transition name="slideUp">
            <div
              v-if="loaded"
              class="section__hero-banner__cta__button"
              role="button"
              @click="$router.push('/products/blendjet-2')"
            >
              Get Yours Today
            </div>
          </transition>
        </div>
        <div class="section__hero-banner__media">
          <div class="section__hero-banner__media__desktop">
            <video
              class="section__hero-banner__media__desktop__video"
              v-if="loaded"
              autoplay="autoplay"
              loop="loop"
              muted=""
              webkit-playsinline=""
              playsinline=""
            >
              <source :src="externalDesktopVideoUrl" type="video/mp4" />
            </video>
          </div>
          <div class="section__hero-banner__media__mobile">
            <video
              class="section__hero-banner__media__mobile__video"
              v-if="loaded"
              autoplay="autoplay"
              loop="loop"
              muted=""
              webkit-playsinline=""
              playsinline=""
            >
              <source :src="externalMobileVideoUrl" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <!-- START BFCM -->
      <!-- <div class="outer-canvas-bfcm" style="margin-bottom: unset;">
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

<!-- <div class="outer-canvas-bfcm" style="margin-bottom: unset;">
  <div class="canvas-bfcm">
    <div class="col-bfcm">
      <span class="entry-title-bfcm">Back to School Sale</span>
      <span class="content-split-element-bfcm">Free JetPack Protein Smoothies</span>
      
      
      <span class="simple-text-bfcm">With Each BlendJet <b class="b-hide-bfcm">|</b> <span>Discount Applied at Checkout</span></span>
    </div>
  </div>
</div> -->

      <!-- END BFCM -->

      <div class="section section__as-seen-on">
        <Ticker type="asSeenOn" />
      </div>
      <div class="section section__blendjet-demo">
        <BlendJetDemo :demo="demoImg" />
      </div>
      <div class="section section__free-shipping">
        <FreeShippingMarquee />
      </div>

      <div class="section section__jetpacks">
        <transition name="fade">
          <Jetpacks />
        </transition>
      </div>

      <div class="section section__jetpacks">
        <transition name="fade">
          <Jetsetter />
        </transition>
      </div>

      <div class="section section__recipes">
        <div class="section__recipes__list">
          <RecipesList />
        </div>
        <div class="section__recipes__explore">
          <div class="section__recipes__explore__container">
            <picture>
              <img
                class="section__recipes__explore__image"
                :src="optimizeSource({ url: `${images.blendEndlessly}?w=800` })"
                alt="BlendJet 2 - The Portable Blender in different colors"
              />
            </picture>
            <div class="section__recipes__explore__content">
              <div class="section__recipes__explore__content__text">
                Blend
                <div class="section__recipes__explore__content__text__line2">Endlessly</div>
              </div>
              <n-link to="/recipes" class="section__recipes__explore__content__cta-button">
                Explore Recipes
              </n-link>
            </div>
          </div>
        </div>
      </div>

      <div class="section section__instagram">
        <Instagram />
      </div>
    </div>
  </div>
</template>

<script>
import nmerge from 'nuxt-merge-asyncdata'
import getPage from '~/mixins/getPage'
import { mapMutations } from 'vuex'
import getCollection from '~/mixins/getCollection'
import PageContent from '~/components/nacelle/PageContent'
import Ticker from '~/components/ticker'
import debounce from 'lodash.debounce'
import JetpacksProtein from '~/components/jetpacksProtein'
import Jetpacks from '~/components/jetpacks'
import Jetsetter from '~/components/jetsetter'
import RecipesList from '~/components/recipes-list'
import BlendJetDemo from '~/components/blendjetDemo'
import imageOptimize from '~/mixins/imageOptimize'
import FreeShippingMarquee from '~/components/freeShippingMarquee'

import { createClient } from '~/plugins/contentful.js'
const Instagram = () => import('~/components/instagram')
const client = createClient()

export default nmerge({
  data() {
    return {
      blendJetPDPData: {},
      loaded: false,
      screenWidth: null,
      scrollY: null,
      jetpackLoaded: false,
      client: null,
      blendEndlesslyUrl: null,
      images: {},
      videos: {},
      metaTitle: '',
      metaDescription: ''
    }
  },
  components: {
    PageContent,
    Ticker,
    RecipesList,
    Jetpacks,
    JetpacksProtein,
    Jetsetter,
    Instagram,
    BlendJetDemo,
    FreeShippingMarquee
  },
  computed: {
    name() {
      return this.$store.state.space.name
    }
  },

  head() {
    const properties = {}
    const meta = []
    const mdescription = this.metaDescription
    const title = this.metaTitle
    if (title.length) {
      properties.title = title
    }

    if (mdescription.length) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: mdescription
      })
    }

    return { ...properties, meta }
  },
  async asyncData() {
    // hard reference hero image for now
    const demoImg = await client
      .getAsset('2826IGPC4SeJ3ZxguhTAZ4')
      .then(val => val.fields?.file.url)

    return { demoImg }
  },
  methods: {
    ...mapMutations('cart', ['showCart']),
    test() {
      console.log('click')
    },

    setWindowSize() {
      this.screenWidth = window.innerWidth
    },

    scrollLoad() {
      this.scrollY = window.scrollY
    },
    handleScroll(event) {
      this.scrollY = window.scrollY
      if (this.screenWidth <= 768) {
        if (this.scrollY >= 911) {
          this.jetpackLoaded = true
        }
      }

      if (this.screenWidth > 768) {
        if (this.scrollY >= 1281) {
          this.jetpackLoaded = true
        }
      }
    },
    mountScrollWatch() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 0)
      window.addEventListener('scroll', this.handleDebouncedScroll, {
        passive: true
      })
    },
    removeScrollWatch() {
      window.removeEventListener('scroll', this.handleDebouncedScroll)
    }
  },
  async mounted() {
    if (process.client) {
      this.setWindowSize()
      this.handleScroll()
      this.mountScrollWatch()
      this.client = createClient()

      await this.client.getEntry('YvRGvKeTPPzBNES6g7Hle').then(entry => {
        this.metaTitle = entry.fields.metaTitle
        this.metaDescription = entry.fields.metaDescription
        this.externalDesktopVideoUrl = entry.fields.externalDesktopVideoUrl
        this.externalMobileVideoUrl = entry.fields.externalMobileVideoUrl

        entry.fields.blnPageImages.forEach(node => {
          this.images[node.fields.title] = `${node.fields.file.url}`
        })

        entry.fields.blnPageVideos.forEach(node => {
          this.videos[node.fields.title] = `${node.fields.file.url}`
        })

        this.loaded = true
      })

      window.onresize = this.setWindowSize()

      if (this.$route.query && this.$route.query.cart) {
        this.showCart()
      }
    }
  },

  beforeDestory() {
    window.onresize = null
    this.removeScrollWatch()
  },
  jsonld() {
    return {
      '@context': 'http://www.schema.org',
      '@type': 'Organization',
      name: 'BlendJet',
      url: 'https://blendjet.com/',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          telephone: '+1 844-588-1555',
          email: 'support@blendjet.com'
        }
      ],
      sameAs: [
        'https://www.facebook.com/blendjet/',
        'https://www.instagram.com/BlendJet/',
        'https://twitter.com/BlendJet',
        'https://www.pinterest.com/blendjet/',
        'https://www.youtube.com/channel/UCYCxpRsXpNh2REeyATMo_8w'
      ],
      logo:
        'https://cdn.shopify.com/s/files/1/0066/4433/4658/files/BlendJet-2-logo.png?v=1616611844',
      image:
        'https://images.ctfassets.net/strhx3d94c40/1YTbF5tGizsjmmGtmDf7tx/c3593da25daef024771437dac2589dfb/BLENDJET-2-HERO-LANDSCAPE-CROP-BLACK.jpeg?w=2100',
      description:
        "The BlendJet 2 portable blender packs big blender power on the go. It crushes ice or almost anything. It even cleans itself. It's USB-C rechargeable and water-resistant too. Get your BlendJet 2 today!"
    }
  },
  mixins: [
    getPage({ pageHandle: 'homepage' }),
    getCollection({ collectionHandle: 'homepage' }),
    imageOptimize
  ]
})
</script>

<style scoped lang="scss">
.page {
  overflow-x: hidden;
}
.section {
  width: 100%;
  padding: 0;

  &__hero-banner {
    position: relative;
    @include gradient-primary-purple-turquoise('to bottom');
    @include respond-to('small') {
      height: auto;
    }
    &__cta {
      position: absolute;
      width: 100%;
      margin: 0 auto;
      top: 47%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      z-index: 100;

      &__text {
        color: $grayscale-white;
        text-align: center;
        text-shadow: 0px 0px 10px #7a7a7a;

        &__line1 {
          font-family: Medium;
          font-size: 54px;
          line-height: 1;
          letter-spacing: 10px;
          margin-bottom: 10px;

          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
          }
        }

        &__line2 {
          font-family: BoldItalic;
          font-size: 54px;
          line-height: 1;
          letter-spacing: 10px;
          margin-bottom: 21px;

          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
          }
        }
      }

      &__button {
        @include button-primary('white');
        height: 40px;
        width: 240px;
        box-shadow: 0px 0px 10px #7a7a7a;
      }
    }

    &__media {
      transition: all 1s ease;
      @include respond-to('small') {
        min-height: 400px;
      }

      &__desktop {
        @include respond-to('small') {
          display: none;
        }
        &__video {
          width: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }
      }

      &__mobile {
        min-height: 400px;
        @media screen and (min-width: 1024px) {
          display: none;
        }
        &__video {
          height: 400px;
          display: block;
          object-fit: cover;
          object-position: center;
          width: 100%;
        }
      }
    }
  }

  &__as-seen-on {
    height: 135px;
    background-color: $primary-purple;
    padding-top: 25px;
  }

  &__jetpacks {
    background-color: $primary-purple-tint;
    min-height: 730px;
    @include respond-to('small') {
      height: auto;
    }
  }

  &__recipes {
    height: 680px;
    display: flex;
    flex-flow: row wrap;
    @media screen and (max-width: 768px) {
      height: auto;
    }

    &__list {
      width: 50%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }

    &__explore {
      width: 50%;
      @media screen and (max-width: 768px) {
        width: 100%;
      }

      &__container {
        position: relative;
        width: 100%;
        height: 680px;
      }

      &__image {
        object-fit: cover;
        object-position: center;
        width: 100%;
        height: 680px;
      }

      &__content {
        position: absolute;
        width: 100%;
        margin: 0 auto;
        top: 47%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        z-index: 100;

        @include respond-to('small') {
        }

        &__text {
          color: $grayscale-white;
          font-size: 54px;
          line-height: 54px;
          letter-spacing: 10px;
          text-transform: uppercase;
          text-align: center;
          font-family: Medium;
          @include respond-to('small') {
            font-size: 28px;
            line-height: 1.14;
            letter-spacing: 3.5px;
            display: flex;
          }

          &__line2 {
            font-family: BoldItalic;
            @include respond-to('small') {
              margin-left: 9px;
            }
          }
        }

        &__cta-button {
          margin-top: 1.5rem;
          text-align: center;
          @include button-primary('white-ghost');
        }
      }
    }
  }

  &__instagram {
    @include gradient-primary-light-purple(to top);
    @media screen and (max-width: 768px) {
      height: auto;
    }
  }

  &__free-shipping {
    @include gradient-primary-purple-turquoise(to left);
    height: 80px;
    display: flex;
    align-items: center;
    @include respond-to('small') {
      height: 55px;
    }
  }
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 1.2s;
}

.fade-leave-active {
  animation: fadeOut;
  animation-duration: 1.2s;
}

.slideRight-enter-active {
  animation: slideInRight;
  animation-duration: 1.2s;
}

.slideLeft-enter-active {
  animation: slideInLeft;
  animation-duration: 1.2s;
}

.slideUp-enter-active {
  animation: slideInUp;
  animation-duration: 1.2s;
}
</style>
