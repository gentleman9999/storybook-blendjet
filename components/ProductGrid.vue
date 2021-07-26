<template>
  <div
    class="product-grid"
    v-bind:class="{ 'product-grid--no-results': !products.length }"
    :style="{ '--columns': section.columns }"
  >
    <!-- If the collection has in-stock, available products, render a product card grid -->
    <template v-if="loading">
      <!-- Loading...-->
    </template>
    <template v-else-if="products.length">
      <template v-if="section.variantBased && variants.length > 1">
        <ProductCard
          v-for="{ product, ...variant } in variants"
          :key="product.title + variant.title"
          :product="product"
          :variant="variant"
          :variantBased="section.variantBased"
        />
      </template>
      <template v-else>
        <ProductCard
          v-for="product in products"
          :key="product.title"
          :product="product"
          :variant="product.variants[0]"
          :variantBased="section.variantBased"
          isRolledUp
        />
      </template>
    </template>

    <!-- Otherwise, render a message -->
    <template v-else>
      <div class="product-grid__no-results">
        No products available in your area.
      </div>
    </template>
  </div>
</template>

<script>
import ProductCard from '~/components/ProductCard'
import productShippingEligibility from '~/mixins/productShippingEligibility'

export default {
  data() {
    return {
      products: [],
      loading: true
    }
  },
  mixins: [productShippingEligibility],
  components: {
    ProductCard
  },
  props: {
    section: Object
  },
  computed: {
    variants() {
      return this.products.map(p => p.variants.map(v => ({ ...v, product: p }))).flat()
    }
  },
  async mounted() {
    this.products = await this.$nacelle.data
      .collectionPage({ handle: this.section.shopifyCollectionHandle, paginate: false })
      .then(
        results =>
          results
            .filter(product => product.availableForSale) // get in-stock products
            .map(product => ({
              ...product,
              variants: product.variants.filter(v => v.availableForSale)
            })) // get in-stock variants
            .filter(this.checkProductShippingEligibility) // get products that can be shipped to the user
      )
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.product-grid {
  --card-size: calc(calc(1400px - calc(2rem * calc(var(--columns) - 1))) / var(--columns));
  padding: 5rem 2rem;
  max-width: calc(1400px + 4rem);
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-size), 1fr));
  grid-gap: 2rem;

  @include respond-to('small') {
    grid-template-columns: 1fr;
  }

  &--no-results {
    display: block;
    text-align: center;
  }
}
</style>
