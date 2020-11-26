<template>
  <div class="blendjet-container" v-if="product">
    <div class="text-block">
       Jetsetter Insulated Sleeve<br/> <span style="font-size: 75%;color:gold;">15% off 1 - 20% off 2 - 25% off 3+</span>    </div>
    <div class="blendjet-image">
      <transition name="fade">
        <img class="blendjet-image__img" :src="optimizeSource({url:selectedVariant.featuredMedia.src})"/>
      </transition>
    </div>
    <div class="add-to-cart-controls">
      <div class="blendjet-dropdown">
        <CartDropdown 
          :items="product.variants"
          :product="selectedVariant"
          @update:blendjet="updateVariant"
          :label="'Color'"
          :productType="'blendjet'"
        />
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
        <product-add-to-cart-button
          :product="product"
          :variant="selectedVariant"
          :quantity="quantity"
          :allOptionsSelected="true"
          :onlyOneOption="true"
        />
      </div>
      <div class="subscribe-select">
        
      </div>
    </div>
  </div>
</template>

<script>
import CartDropdown from '~/components/cartDropdown'
import QuantityDropdown from '~/components/quantityDropdown'
import imageOptimize from '~/mixins/imageOptimize'
import ProductAddToCartButton from '~/components/nacelle/ProductAddToCartButton'
export default {
  data() {
    return {
      jetpacks: [],
      product: null,
      selectedVariant: null,
      quantity: 1,
    }
  },
  components: {
    CartDropdown,
    QuantityDropdown,
    ProductAddToCartButton,
  },
  mixins: [imageOptimize],
  async mounted() {
    this.product = await this.$nacelle.data.product({handle: 'jetsetter-insulated-sleeve'})
    this.selectedVariant = this.product.variants[0]
  },
  methods: {
    updateVariant(newVariant) {
      this.selectedVariant = newVariant;
    },
    updateQuantity(newQuantity) {
      this.quantity = newQuantity
    }
  }
  
}
</script>

<style lang="scss" scoped>
.blendjet-container {
  padding-top: 15px;
}
 .text-block {
  font-family: Bold;
  font-size: 24px;
  line-height: 1.17;
  letter-spacing: 0.67px;
  text-align: center;
  color: $grayscale-white;
  margin-bottom: 80px;
  padding: 0 55px;
  padding-top: 80px;

  @include respond-to('small') {
    font-size: 16px;
    margin-bottom: 15px;
    padding-top: 15px;
    padding-left: 37px;
    padding-right: 37px;
  }
}

.blendjet-image {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  &__img {
    height: 300px;
    @include respond-to('small') {
      height: 130px;
    }
  }
  @include respond-to('small') {
    margin-bottom: 15px;
  }
}

.blendjet-dropdown {
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
  @include respond-to('small') {
  }
  ::v-deep .add-to-cart-button {
    @include button-primary('white');
    width: 287px;
  }
}

.quantity-select {
  display: flex;
  justify-content: center;
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
  height: 20px;
  @include respond-to('small') {
    padding-bottom: 17px;
  }
}
</style>
