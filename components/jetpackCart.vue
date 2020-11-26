<template>
  <div class="jetpack-container" v-if="product && jetpacks">
    <div class="text-block">
                               <a href="/products/banana-blueberry-jetpack-ready-to-blend-smoothie" style="color:white;">Try JetPack Variety Pack</a><br/> <span style="font-size: 75%;color:gold;">8 Ready-to-Blend Smoothies</span>
    </div>
    <div class="jetpack-image">
      <transition name="fade">
        <img class="jetpack-image__img" :src="optimizeSource({url:varietyPack.media[0].src})"/>
      </transition>
    </div>
    <div class="add-to-cart-controls">
      <div class="jetpack-dropdown">
        <!-- <CartDropdown 
          :items="jetpacks"
          :product="product"
          @update:jetpacks="updateJetpack"
          :label="'Flavor'"
          :productType="'jetpacks'"
        /> -->
      </div>
      <div class="quantity-select">
        <div class="quantity-select__label">Quantity:</div> 
        <div class="quantity-select__dropdown-container">
          <QuantityDropdown 
            :quantity="quantity"
            @update:quantity="updateQuantity"
          />
        </div>
      </div>
      <div class="add-to-cart-container">
        <div class="variety-button" v-if="variety" @click="addVarietyPackToCart">
          Add to cart -&nbsp; {{symbol}}{{(displayPrice * this.quantity).toFixed(2)}}
        </div>
        <!-- <SubscriptionAddToCartButton
          :product="product"
          :bundle="jetpacksCol"
          :variant="product.variants[0]"
          :metafields="product.metafields"
          :all-options-selected="true"
          :only-one-option="true"
          :quantity="quantity"
          :showPrice="true"
        /> -->
      </div>
      <div class="subscribe-select">
        <Checkbox v-if="variety" :color="'white'" :initialCheck="true" :label="'Subscribe & Save 25%'" @checked="handleCheck"/>
        <!-- <SubscriptionSelect 
            v-if="jetpacks.length"
            :products="jetpacks"
            :_product="jetpacks[0]"
            :metafields="product.metafields"
            :checkbox="true"
        /> -->
       
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CartDropdown from '~/components/cartDropdown'
import QuantityDropdown from '~/components/quantityDropdown'
import imageOptimize from '~/mixins/imageOptimize'
import SubscriptionToggle from '~/components/subscriptionToggle'
import SubscriptionSelect from '~/components/subscriptionSelect'
import SubscriptionAddToCartButton from '~/components/nacelle/SubscriptionAddToCartButton';
import ProductPrice from '~/components/nacelle/ProductPrice'

import Axios from 'axios'

// import rechargeProperties from '~/mixins/rechargeMixin'
// import productMetafields from '~/mixins/productMetafields'

import Checkbox from '~/components/checkbox'
export default {
  data() {
    return {
      jetpacks: null,
      product: null,
      quantity: 1,
      frequency: null,
      variety: true,
      subUnitDisplayPrice: 2.99,
      unitDisplayPrice: 3.99,
      subscriptionChecked: true,
      displayPrice: 23.92,
      localizedUnitPrice: '2.99',
      symbol: '$'
    }
  },
  components: {
    CartDropdown,
    ProductPrice,
    QuantityDropdown,
    SubscriptionToggle,
    SubscriptionSelect,
    SubscriptionAddToCartButton,
    Checkbox
  },
  mixins: [imageOptimize],
  async mounted() {
    this.jetpacks = await this.$nacelle.data.collectionPage({ 
      handle: 'jetpack-ready-to-blend-smoothies',
      paginate: false,
    }).then((results) => {
      return results.filter((item) => {
        return item.availableForSale
      })
    })
    this.varietyPack = await this.$nacelle.data.product({
      handle: 'variety-jetpack-ready-to-blend-smoothie'
    })

    this.getDisplayPrice()

    this.product = this.jetpacks[0]
  },
  methods: {
     ...mapActions('cart', [
      'addLineItem',
      'removeLineItem',
      'incrementLineItem',
      'decrementLineItem',
      'getLineItems'
    ]),
    formatTitle(title) {
      return title.split('-')[0].trim()
    },
    updateJetpack(jetpack) {
      this.product = jetpack;
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    handleCheck(check) {
      if(check) {
        this.toggleSubscriptions(true)
        this.subscriptionChecked = true
        this.displayPrice = (this.subUnitDisplayPrice * 8) 
      } else {
        this.toggleSubscriptions(false)
        this.subscriptionChecked = false
        this.displayPrice = (this.unitDisplayPrice * 8) 
      }
    },
    toggleSubscriptions(sub) {
      if(sub) {
        this.jetpacks.forEach((jetpack) => {
          const rechargeFields = [
            {
              key: "charge_interval_frequency",
              value: "30"
            },
            {
              key: "order_interval_frequency",
              value: "30"
            },
            {
              key: "order_interval_unit",
              value: "day"
            }
          ]
          let metafields = jetpack.metafields
          let newMeta = metafields.concat(rechargeFields)
          jetpack.metafields = newMeta
        })
        
      } else {
        this.jetpacks.forEach((jetpack) => {
          const updatedMeta = jetpack.metafields.filter((metafield) => metafield.id === null)
          jetpack.metafields = [...updatedMeta]
        })

      }
    }, 
    decodeBase64VariantId (encodedId) {
      console.log('encodedId', encodedId)
      const decodedId = atob(encodedId)
      return decodedId.split('gid://shopify/ProductVariant/')[1]
    },
    isSubscription (item) {
      return !!item.metafields.find(meta => meta.key === 'charge_interval_frequency')
    },
    subscriptionVariant (item) {
      // Deep clone object without references to state.
      const _variant = JSON.parse(JSON.stringify(item))
      _variant.price = "2.99"

      return _variant
    },
     discountVariantMap (item) {
       const metafieldsObj = 

          item.metafields.reduce((obj, metafield) => {
          const { namespace, key, value } = metafield

          if (obj[namespace]) {
            obj[namespace][key] = value
          } else {
            obj[namespace] = {}
            obj[namespace][key] = value
          }
          console.log('metaFieldsObj', obj)
          return obj
        }, {})
      return JSON.parse(metafieldsObj.subscriptions.original_to_hidden_variant_map)
    },

    async getDisplayPrice() {
      let variantId = atob(this.jetpacks[0].variants[0].id).split('/').pop()
      const price = encodeURIComponent(JSON.stringify(
          [
            {
              "Price": 2.99,
              "Tag": variantId
            },
            {
              "Price": 3.99,
              "Tag": variantId
            }
          ]
        ))

        const config = {
          method: 'get',
          url: `https://checkout.gointerpay.net/v2.21/localize?MerchantId=3af65681-4f06-46e4-805a-f2cb8bdaf1d4&MerchantPrices=${price}`,
        }
        const localPrice = await Axios(config)
          .then((res) => {
            // console.log(res)
            if(!res.data.ConsumerPrices[0]) {
            } else {
              this.symbol = res.data.Symbol
              this.subUnitDisplayPrice = res.data.ConsumerPrices[0]
              this.unitDisplayPrice = res.data.ConsumerPrices[1]
              this.subscriptionChecked ? this.displayPrice = this.subUnitDisplayPrice * 8 : this.displayPrice = this.unitDisplayPrice * 8
            }
          })
          .catch((res) => {
            console.error('Currency Request Failed', res)
            this.displayPrice = `$${this.variant.price}`
          })
    },
    addVarietyPackToCart() {
      this.jetpacks.forEach((jetpack) => {
        
        const variant = this.isSubscription(jetpack) ? this.subscriptionVariant(jetpack.variants[0]) : jetpack.variants[0]
        const cartMeta = jetpack.metafields.filter((field) => {
          return !field.id && field.id !== null
        })

        const lineItem = {
          image: jetpack.featuredMedia,
          title: jetpack.title,
          variant,
          quantity: 2 * this.quantity,
          productId: jetpack.id,
          handle: jetpack.handle,
          vendor: jetpack.vendor,
          tags: jetpack.tags,
          metafields: cartMeta
        }
        this.addLineItem(lineItem)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .text-block {
  font-family: Bold;
  font-size: 24px;
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
    // margin-top: 0;
  }
}

.jetpack-container {
  padding-top: 15px;
}

.variety-button {
  @include button-primary('white')
}

.jetpack-image {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  &__img {
    height: 300px;
    object-fit: contain;
    @include respond-to('small') {
      height: 130px;
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
  // align-items: center;
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
  // ::v-deep .b-checkbox.checkbox input[type=checkbox]:checked + .check {
  //   border-color: $grayscale-white;
  // };
  @include respond-to('small') {
    padding-bottom: 17px;
  }
}
</style>
