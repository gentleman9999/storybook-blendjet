<template>
  <div class="cart-upsells-item">
    <div class="header">
      <p class="upsell-title">{{ title }}</p>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="image" :class="productCount">
      <img
        v-for="bundle in selectedBundle"
        :key="bundle.product.id"
        :src="
          optimizeSource({
            url: bundle.variant
              ? bundle.variant.featuredMedia.src
              : bundle.product.featuredMedia.src,
            width: 200
          })
        "
      />
      <img
        v-if="varietyPackImage[selectedVarieryPackIndex]"
        class="variety-pack"
        :src="optimizeSource({ url: varietyPackImage[selectedVarieryPackIndex], width: 200 })"
      />
    </div>
    <div class="add-to-cart">
      <template v-for="(bundle, index) in selectedBundle">
        <CartDropdown
          v-if="bundle.product.variants.length > 1"
          :key="bundle.product.id"
          productType="any"
          :label="getBundleItemLabel(bundle)"
          :items="bundle.product.variants"
          :product="bundle.variant"
          @update:any="updateSelectedVariant($event, index)"
        />
        <!-- <CartDropdownMultiOptions
          v-else-if="
            bundle.product.variants.length > 1 && bundle.variant.selectedOptions.length > 1
          "
          :key="bundle.product.id"
          :options="getAllOptions(bundle.product.variants)"
          :variant="bundle.variant"
          @clear="selectedOptions = []"
        /> -->
      </template>
      <CartDropdownVarietyPack
        v-if="bundleVarietyPack.length > 1"
        label="Variety"
        :items="varietyPackSelectorOptions"
        :current-option="selectedVarieryPackIndex"
        @update="updateVarietyPack"
      />
      <div class="quantity">
        <p>Quantity:</p>
        <QuantityDropdown :quantity="quantity" @update:quantity="updateQuantity" />
      </div>
      <ProductAddToCartButton
        :quantity="quantity"
        :product="{}"
        :allOptionsSelected="true"
        :onlyOneOption="true"
        @addedToCart="quantity = 1"
        :bundles="selectedBundle"
        :bundle-variety-pack="selectedBundleVarietyPack[selectedVarieryPackIndex]"
        :only-bundle="true"
      />
    </div>
  </div>
</template>

<script>
// Components
import QuantityDropdown from '~/components/quantityDropdown'
import CartDropdown from '~/components/cartDropdown'
import CartDropdownVarietyPack from '~/components/CartDropdownVarietyPack'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'

// Mixins
import productMetafields from '~/mixins/productMetafields'
import imageOptimize from '~/mixins/imageOptimize'
import availableOptions from '~/mixins/availableOptions'
import { cloneDeep } from 'lodash'
export default {
  components: {
    QuantityDropdown,
    CartDropdown,
    ProductAddToCartButton,
    CartDropdownVarietyPack
  },
  mixins: [productMetafields, imageOptimize, availableOptions],
  props: {
    title: String,
    subtitle: String,
    withBundle: {
      type: Boolean,
      default: false
    },
    bundles: {
      type: Array,
      default: () => []
    },
    bundleVarietyPack: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      quantity: 1,
      justAdded: false,
      imageInterval: null,
      imageIndex: 0,
      varietyPackImage: [],
      selectedVarieryPackIndex: 0,
      selectedBundle: cloneDeep(this.bundles),
      selectedBundleVarietyPack: cloneDeep(this.bundleVarietyPack),
      varietyPackSelectorOptions: []
    }
  },
  computed: {
    productCount() {
      let count = 0
      count += this.bundles.length
      if (this.bundleVarietyPack?.length) {
        count++
      }
      if (count === 1) {
        return 'one'
      } else if (count === 2) {
        return 'two'
      } else if (count === 3) {
        return 'three'
      } else if (count === 4) {
        return 'four'
      }
      return ''
    }
  },
  created() {
    // this.imageInterval = setInterval(() => {
    //   this.imageIndex =
    //     this.imageIndex ===
    //     this.bundleVarietyPack?.[this.selectedVarieryPackIndex]?.variants.length - 1
    //       ? 0
    //       : this.imageIndex + 1
    //   this.varietyPackImage = this.bundleVarietyPack?.[this.selectedVarieryPackIndex]?.variants[
    //     this.imageIndex
    //   ]?.featuredMedia.src
    // }, 1000)
    this.updateVarietyPackOptions()
  },
  methods: {
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    },
    updateSelectedVariant(newVariant, index) {
      this.$set(this.selectedBundle, index, { ...this.selectedBundle[index], variant: newVariant })
    },
    updateVarietyPack(index) {
      this.selectedVarieryPackIndex = index
    },
    getBundleItemLabel(bundle) {
      const optionName = bundle.variant.selectedOptions[0].name
      let productName = bundle?.product?.title
      if (productName?.toLowerCase().includes('blendjet')) {
        productName = 'Blendjet 2'
      } else if (productName?.toLowerCase().includes('sleeve')) {
        productName = 'Sleeve'
      } else if (productName?.toLowerCase().includes('tote')) {
        productName = 'Tote'
      }
      return productName + ' ' + optionName
    },
    updateVarietyPackOptions() {
      const imageIndex = []
      for (let i = 0; i < this.selectedBundleVarietyPack?.length; i++) {
        imageIndex[i] = 0
      }
      this.selectedBundleVarietyPack.forEach(({ variants }, index) => {
        this.$set(
          this.varietyPackImage,
          index,
          variants?.[(imageIndex[index] + 1) % variants.length]?.featuredMedia.thumbnailSrc
        )
        imageIndex[index]++
      })
      clearInterval(this.imageInterval)
      this.imageInterval = setInterval(() => {
        this.selectedBundleVarietyPack.forEach(({ variants }, index) => {
          this.$set(
            this.varietyPackImage,
            index,
            variants?.[(imageIndex[index] + 1) % variants.length]?.featuredMedia.thumbnailSrc
          )
          imageIndex[index]++
        })
      }, 1000)

      this.varietyPackSelectorOptions = []
      this.selectedBundleVarietyPack.forEach(({ product, variants }, index) => {
        let title = product?.title
        if (title?.toLowerCase()?.includes('protein')) {
          title = variants.length + ' JETPACK PROTEIN SMOOTHIES'
        } else if (title?.toLowerCase()?.includes('jetpack')) {
          title = variants.length + ' JETPACK SMOOTHIES'
        }
        this.varietyPackSelectorOptions.push({
          title: title,
          image: this.varietyPackImage[index]
        })
      })
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
    padding: 15px 40px 40px;
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

  .upsell-title {
    color: #fff;
  }

  .subtitle {
    color: #ffd700;
    font-size: 75%;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
}

.image {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: space-around;
  position: relative;
  margin-bottom: 30px;
  &:after {
    content: '+';
    color: white;
    font-size: 40px;
    left: calc(50% - 12px);
    position: absolute;
  }
  &.one:after {
    content: '';
    display: none;
  }
  &.two:after {
    top: calc(50% - 40px);
  }
  &.three:after {
    top: 96px;
  }
  &.four:after {
    top: 122px;
  }

  img {
    height: 140px;
    width: 140px;
    margin-bottom: 30px;
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
