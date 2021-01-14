<template>
  <div>
    <div class="page-container">
      <content-hero-banner
      id="hero-banner"
      :imageUrl="optimizeSource({ url: page.fields.heroImageDesktop.fields.file.url + '?w=2000' })"
      :mobileBackgroundImgUrl="optimizeSource({ url: page.fields.heroImageMobile.fields.file.url + '?w=450' })"
      backgroundAltTag="Brand Ambassador Hero Image"
      :title="page.fields.heading"
      :superHeading="page.fields.superHeading"
      :shortDescription="page.fields.heroBannerContent.content[0].content[0].value"
      :ctaUrl="page.fields.heroApplyButtonLink"
      :ctaText="'Apply'"
      :ctaTwoUrl="page.fields.heroLoginButtonLink"
      :ctaTwoText="'Login'"
      :location="'brand-ambassador'"
      :textColor="'white'"
      />

      <div class="image-tile--section">
        <div class="image-tile--section-heading">
          <RichTextRenderer :document="page.fields.perksContent" />
        </div>
        <div class="image-tile--list">
          <div class="image-tile" v-for="(tile, index) in page.fields.imageTile">
            <img class="image-tile--image" :src="optimizeSource({ url: tile.fields.image.fields.file.url })" />
            <h4 class="image-tile--heading">{{ tile.fields.title }}</h4>
          </div>
        </div>
      </div>
      <div class="works-section">
        <div class="image-tile--section-heading">
          <h3>{{ page.fields.workSectionTitle}}</h3>
        </div>
        <div class="works-section--tiles">
          <div class="works-section--single-tile" v-for="(tile, index) in page.fields.workSectionTiles">
            <img class="works-section--single-tile--image" :src="optimizeSource({ url: tile.fields.image.fields.file.url })">
            <h4 class="works-section--single-tile-heading">{{ tile.fields.title }}</h4>
            <div class="works-section--single-tile-content">
              <RichTextRenderer :document="tile.fields.text" />
            </div>
          </div>
        </div>
        <div class="single--actions">
          <p class="cta-container">
              <cta-button :to="page.fields.heroApplyButtonLink">Apply</cta-button>
              <cta-button :to="page.fields.heroLoginButtonLink">Login</cta-button>
            </p>
        </div>
      </div>
      <div class="meet-section">
        <div class="image-tile--section-heading">
          <h3>{{ page.fields.ambassadorsTileSectionHeading}}</h3>
        </div>

        <transition name="fade">
          <div class="meet-carousel" v-if="ambassadors.length">
            <b-carousel-list 
              v-model="ambassadorsIndex" 
              :data="ambassadors" 
              :items-to-show="itemsToShow"
              :indicator="true"
              :arrow-hover="false"
              :arrows="true"
              :repeat="true" 
              :progress="false"
              :has-drag="true"
              
              style="box-shadow:none"
              >
              <template slot="item" slot-scope="props">
                <div class="card" :style="cardStyle">
                  <div class="card-image">
                    <figure class="image" :style="cardContentStyle">
                      <img :style="imageStyle" :src="props.fields.image.fields.file.url">
                    </figure>
                  </div>
                  <div class="card-content" >
                    <div class="content">
                      <p class="title is-6 jetpack-title" :style="titleStyle" >{{ props.fields.title }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </b-carousel-list>
          </div>
        </transition>

        <div class="single--actions">
          <p class="cta-container">
            <cta-button :to="page.fields.heroApplyButtonLink">Apply</cta-button>
            <cta-button :to="page.fields.heroLoginButtonLink">Login</cta-button>
          </p>
        </div>
      </div>
      <div class="faq--section brand-ambassador-faqs">
        <div class="image-tile--section-heading">
          <h3>FREQUENTLY ASKED QUESTIONS</h3>
        </div>
        <div class="faq-container">
          <div class="faq-section">
            <details>
              <summary>
                Who Can Become a part of the BlendJet Ambassador Program?
                <svg class="plus" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>+</title>
                  <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                          <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                              <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                                  <g id="+" transform="translate(340.000000, 19.000000)">
                                      <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                      <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                <svg class="minus" width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>BG Copy</title>
                  <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                          <g id="Cart" transform="translate(1046.000000, 0.000000)">
                              <g id="Products" transform="translate(17.000000, 54.000000)">
                                  <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                      <g id="Qty" transform="translate(96.000000, 54.000000)">
                                          <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </summary>
              <b>We look for the following characteristics in our ambassadors:</b>
              <p><span>1.</span> A social media presence that portrays a positive outlook and desire to share healthy habits with the world through high-quality images and videos.</p>
              <p><span>2.</span> A minimum of 10,000 followers on Instagram, YouTube, or Facebook, or a minimum of 4,000 followers on Tik-Tok.</p> 
              <p><span>3.</span> An average engagement rate of 4% per post.</p>
            </details>
          </div>
          <div class="faq-section">
            <details>
              <summary>
                How do I receive my first free BlendJet?
                <svg class="plus" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>+</title>
                  <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                          <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                              <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                                  <g id="+" transform="translate(340.000000, 19.000000)">
                                      <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                      <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                <svg class="minus" width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>BG Copy</title>
                  <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                          <g id="Cart" transform="translate(1046.000000, 0.000000)">
                              <g id="Products" transform="translate(17.000000, 54.000000)">
                                  <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                      <g id="Qty" transform="translate(96.000000, 54.000000)">
                                          <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </summary>
              <p><span>1.</span> After receiving your acceptance email, register at the BlendJet Ambassadors <a href="https://blendjet.brandchamp.io/register" target="_blank">Portal.</a></p>
              <p><span>2.</span> If you've already registered, you can access the portal from the <a href="https://blendjet.brandchamp.io/login" target="_blank">Login Page.</a></p> 
              <p><span>3.</span> Once inside, fill out your Ambassador <a href="https://blendjet.brandchamp.io/login?next=%2Fedit%2Fprofile" target="_blank">Profile.</a> When you have completed your profile, and it has been approved, you will see a code to order your FREE BlendJet + 3 JetPack Smoothies <a href="https://blendjet.brandchamp.io/login?next=%2Frewards%2Fcatalog" target="_blank">HERE!</a></p>
            </details>
          </div>
          <div class="faq-section">
            <details>
              <summary>
                How do I complete activities and earn points?
                <svg class="plus" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>+</title>
                  <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                          <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                              <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                                  <g id="+" transform="translate(340.000000, 19.000000)">
                                      <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                      <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                <svg class="minus" width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>BG Copy</title>
                  <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                          <g id="Cart" transform="translate(1046.000000, 0.000000)">
                              <g id="Products" transform="translate(17.000000, 54.000000)">
                                  <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                      <g id="Qty" transform="translate(96.000000, 54.000000)">
                                          <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </summary>
              <p><span>1.</span> First, register in the BlendJet Ambassadors <a href="https://blendjet.brandchamp.io/register" target="_blank">Portal.</a> and fill out your Ambassador <a href="https://blendjet.brandchamp.io/login?next=%2Fedit%2Fprofile" target="_blank">Profile.</a> to receive your Free BlendJet. </p>
              <p><span>2.</span> <a href="https://blendjet.brandchamp.io/login" target="_blank">Login.</a> and click on the <a href="https://blendjet.brandchamp.io/login?next=%2Frewards%2Fcatalog" target="_blank">Activities</a> tab to complete and submit fun BlendJet Ambassador activities. Be sure to read and follow all instructions! </p> 
              <p><span>3.</span> When you've completed an activity and it's been approved, you'll be credited with reward points! </p>
              <p><span>4.</span> Redeem your rewards points for exclusive products and cash bonuses in our <a href="https://blendjet.brandchamp.io/#/rewards/catalog" target="_blank">Rewards Store!</a> (New rewards are being added all the time!)</p>
            </details>
          </div>
          <div class="faq-section">
            <details>
              <summary>
                How do I receive a commission on referrals?
                <svg class="plus" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>+</title>
                  <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                          <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                              <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                                  <g id="+" transform="translate(340.000000, 19.000000)">
                                      <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                      <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                <svg class="minus" width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>BG Copy</title>
                  <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                          <g id="Cart" transform="translate(1046.000000, 0.000000)">
                              <g id="Products" transform="translate(17.000000, 54.000000)">
                                  <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                      <g id="Qty" transform="translate(96.000000, 54.000000)">
                                          <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </summary>
              <p><span>1.</span> After you have been accepted into the program, you will receive an email that includes your personal discount code and link to share with your followers. You can also find your code and link <a href="https://blendjet.brandchamp.io/#/referrals" target="_blank">HERE.</a></p>
              <p><span>2.</span> Every time someone uses your code, or follows your link, and makes a purchase on www.blendjet.com, you will receive $5 per qualifying order, as long as they do not return the item in 30 days! Keep track of all your referral sales <a href="https://blendjet.brandchamp.io/#/referrals" target="_blank">HERE.</a></p> 
              <p><span>3.</span> Payments for approved referral commissions are made through PayPal by the 5th business day of every month (there may be occasional delays due to holidays). Make sure to add your PayPal account email address when you register so that your payment is not delayed! If you do not have a PayPal account, head to paypal.com to create your free account.</p>
            </details>
          </div>
          <div class="faq-section">
            <details>
              <summary>
                What are the terms and conditions?
                <svg class="plus" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>+</title>
                  <g id="User-Guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="M-BlendJet-UserGuide-2-BlendJet-GLow" transform="translate(-360.000000, -3708.000000)" fill="#373795">
                          <g id="A-Mode" transform="translate(20.000000, 2999.000000)">
                              <g id="Pulse-Mode-" transform="translate(0.000000, 690.000000)">
                                  <g id="+" transform="translate(340.000000, 19.000000)">
                                      <rect id="Rectangle" x="6" y="0" width="2" height="14"></rect>
                                      <rect id="Rectangle-Copy-2" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000) " x="6" y="0" width="2" height="14"></rect>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
                <svg class="minus" width="10px" height="14px" viewBox="0 0 10 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>BG Copy</title>
                  <g id="Cart" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="D-BlendJet-Cart" transform="translate(-1191.000000, -138.000000)" fill="#373795">
                          <g id="Cart" transform="translate(1046.000000, 0.000000)">
                              <g id="Products" transform="translate(17.000000, 54.000000)">
                                  <g id="BlendJet" transform="translate(22.000000, 19.000000)">
                                      <g id="Qty" transform="translate(96.000000, 54.000000)">
                                          <rect id="BG-Copy" x="10" y="11" width="10" height="2"></rect>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </summary>
              <p>Please read the <a href="https://blendjet.com/ambassador-agreement">terms & conditions</a> you must agree to in order to be a part of the BlendJet Brand Ambassador Program.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeroBanner from '~/components/nacelle/ContentHeroBanner'
import imageOptimize from '~/mixins/imageOptimize'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import CtaButton from '~/components/nacelle/CtaButton'
import Collapse from '~/components/collapse'
import { createClient } from '~/plugins/contentful.js'
const client = createClient()

export default {
  data() {
    return {
      ambassadors: [],
      screenWidth: null,
      ambassadorsIndex: 0,
      itemsToShow: 1,
      carouselStyle: {
        boxShadow: 'none'
      },
      cardStyle: {
        background: 'transparent',
        boxShadow: 'none'
      },
      cardContentStyle: {
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      imageStyle: {
        height: '280px',
        width: 'auto',
        borderRadius: '10px'
      },
      titleStyle: {
        textAlign: 'center',
        color: '#000000',
        fontSize: '16px',
        fontFamily: 'Bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.17',
        letterSpacing: '1.75px',
        textTransform: 'uppercase'
      },
      metaTitle: '',
      metaDescription: ''
    }
  },
  methods: {
    back() {
      this.ambassadorsIndex > 0 ? this.ambassadorsIndex-- : this.ambassadorsIndex = 0; 
    },
    forward() {
      this.ambassadorsIndex < this.jetpacks.length ? this.ambassadorsIndex++ : this.ambassadorsIndex = 0;
    },
    setWidthData() {
      if(window.innerWidth < 600) {
      this.itemsToShow = 1
      } else if(window.innerWidth >= 600 && window.innerWidth <= 1024) {
        this.itemsToShow = 2
      } else if (window.innerWidth > 1024 && window.innerWidth < 1200) {
        this.itemsToShow = 3
      } else {
        this.itemsToShow = 4
      }
    },
  },
  components: {
    ContentHeroBanner,
    RichTextRenderer,
    CtaButton,
    Collapse
  },
  mixins: [imageOptimize],
  head() {
    let properties = {}
    let meta = []
    const mdescription = this.metaDescription
    const title = this.metaTitle
    if(title.length) {
      properties.title = title
    }

    if(mdescription.length) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: mdescription
      })
    }
    
    return {...properties, meta}
    
  },
  async mounted() {
    this.screenWidth = window.innerWidth;
    const vm = this
    this.ambassadors = await client.getEntry('2Vziod8PXesNjq3SAZwh20')
    .then((res) => {
      this.metaTitle = res.fields.metaInfo.fields.metaTitle
      this.metaDescription = res.fields.metaInfo.fields.metaDescription
      let arr = res.fields.ambassadorsTiles;
      return arr
    })

    this.setWidthData()
    window.addEventListener('resize', function() {
    if(window.innerWidth < 600) {
      vm.itemsToShow = 1
      } else if(window.innerWidth >= 600 && window.innerWidth < 1024) {
        vm.itemsToShow = 3
      } else {
        vm.itemsToShow = 4
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
  },
  async asyncData() {

    let brandAmbassador = await client.getEntry('2Vziod8PXesNjq3SAZwh20')

    return { page: brandAmbassador }
  },
}
</script>

<style lang="scss" scoped>
.image-tile--section {
  padding: 140px 0;
  @media (max-width: 600px) {
    padding: 70px 15px;
  }
}

.image-tile--section-heading {
  text-align: center;
  max-width: 570px;
  margin: 0 auto;
  font-family: 'Regular';
}

.image-tile--section-heading h3 {
  font-size: 28px;
  color: #000;
  text-transform: uppercase;
  font-family: 'Medium';
  letter-spacing: 1.5px;
  margin: 0 0 20px;
}

.image-tile--list {
  max-width: 900px;
  margin: 0 auto;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-tile {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 33.3333%;
  @media (max-width: 600px) {
    flex-basis: 50%;
  }
  text-align: center;
  margin-top: 60px;
}

.image-tile--image {
  max-height: 60px;
  margin-bottom: 15px;
}

.image-tile--heading {
  font-family: 'Medium';
  font-size: 16px;
}

.works-section {
  padding: 140px 0;
  @media (max-width: 600px) {
    padding: 70px 15px;
  }
  background-color: $primary-purple-tint;
  text-align: center;
}

.works-section--tiles {
  max-width: 1200px;
  margin: 60px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.works-section--single-tile {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 25%;
  @media (max-width: 1024px) {
    flex-basis: 50%;
    padding: 0 60px;
    margin-bottom: 30px;
  }
  @media (max-width: 600px) {
    flex-basis: 100%;
  }
  padding: 0 15px;
}

.works-section--single-tile--image {
  display: block;
  width: 170px;
  height: 170px;
  margin: 0 auto 30px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.works-section--single-tile-heading {
  display: inline-block;
  margin: 0 auto 30px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 18px;
  color: #fff;
  background-color: $primary-purple;
  line-height: 45px;
  font-family: 'Medium';
}
.works-section--single-tile-content {
  font-family: 'Regular';
}
.works-section--single-tile-content h4 {
  font-size: 16px;
  font-family: 'Medium';
  text-transform: uppercase;
  margin-bottom: 10px;
}
.single--actions .cta-container {
  display: flex;
  justify-content: center;
  @media (max-width: 600px) {
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }
}

.single--actions {
  margin-top: 60px;
}

.single--actions .cta-container .cta-button {
  background-color: $primary-purple;
  color: #fff;
  letter-spacing: 2.5px;
  font-family: 'Bold';
}

.single--actions .cta-container .cta-button:last-child {
  margin-left: 20px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 20px;
  }
}
.meet-section {
  padding: 140px 0;
  @media (max-width: 600px) {
    padding: 70px 15px;
  }
}

.faq--section {
  padding: 0 15px 140px;
  @media (max-width: 600px) {
    padding: 0 15px 70px 15px;
  }
}

.meet-carousel {
  margin: 60px auto 0;
  max-width: 1200px;
}

.faq--section.brand-ambassador-faqs .faq-container {
  max-width: 1000px;
  margin: 60px auto 0;
  background-color: #f6f5fd;
  border-radius: 20px;
  padding: 50px;
  @media (max-width: 767px) { 
    padding: 25px;
  }
}

summary::-webkit-details-marker {
  display: none;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details summary {
  text-transform: uppercase;
  font-size: 18px;
  font-family: 'Bold';
  color: $primary-purple;
  letter-spacing: 2px;
  padding: 25px 0;
  @media (max-width: 600px) {
    font-size: 16px;
  } 
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details {
  background-color: transparent;
  border-bottom: 1px solid #e0e0ff;
  border-radius: 0;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section:first-child details summary {
  padding-top: 0;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section:last-child details {
  border-bottom: none;
  summary {
    padding-bottom: 0;
  }
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details summary:focus {
  outline: none;
}

.faq--section.brand-ambassador-faqs .faq-container .faq-section details summary .minus {
  display: none;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details[open] summary .plus {
  display: none;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details[open] summary .minus {
  display: inline;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details p,
.faq--section.brand-ambassador-faqs .faq-container .faq-section details b {
  font-size: 14px;
  font-weight: 400;
  color: #000;
  font-family: 'Regular';
  margin: 0 0 15px;
}
.faq--section.brand-ambassador-faqs .faq-container .faq-section details b {
  font-size: 16px;
  display: block;
  font-family: 'Bold';
}

</style>