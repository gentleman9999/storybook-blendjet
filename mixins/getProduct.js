import { mapMutations } from 'vuex'
import { createClient } from '~/plugins/contentful.js'
const client = createClient()

function getBundledProductsFromFile(bundles, productObj, fs, title) {
  console.log('getBundledProductsFromFile')
  const bundlesPromise = []
  bundles.forEach(bundle => {
    const productHandle = bundle?.fields?.product?.fields?.handle
    const variantId = bundle?.fields?.variant?.fields?.title
    bundlesPromise.push(
      new Promise((resolve, reject) => {
        try {
          const file = fs.readFileSync(
            `./static/data/products/${productHandle}--${productObj.locale}/static.json`,
            'utf-8'
          )
          const bundledProduct = JSON.parse(file)
          const bundledVariant = bundledProduct?.variants?.filter(variant => {
            if (
              variant &&
              variant?.title?.toLowerCase()?.replace(/\s/g, '') === variantId.toLowerCase()
            ) {
              return variant
            }
          })
          if (
            bundledProduct?.availableForSale &&
            bundledVariant?.length &&
            bundledVariant[0]?.availableForSale
          ) {
            return resolve({
              product: bundledProduct,
              variant: bundledVariant.length ? bundledVariant[0] : {},
              title: title
            })
          }
        } catch (err) {
          reject(err)
        }
      })
    )
  })
  return bundlesPromise
}

function getbundledProductsFromNacelle(bundles, allBundledProductList, title) {
  const bundledProducts = []
  bundles.forEach(async bundle => {
    const productHandle = bundle?.fields?.product?.fields?.handle
    const variantId = bundle?.fields?.variant?.fields?.title
    let bundledProduct = allBundledProductList.filter(item => {
      return productHandle === item.handle
    })
    bundledProduct = bundledProduct.length ? bundledProduct[0] : {}
    const bundledVariant = bundledProduct?.variants?.filter(variant => {
      if (
        variant &&
        variant?.title?.toLowerCase()?.replace(/\s/g, '') === variantId.toLowerCase()
      ) {
        return variant
      }
    })
    if (
      bundledProduct?.availableForSale &&
      bundledVariant?.length &&
      bundledVariant[0]?.availableForSale
    ) {
      bundledProducts.push({
        product: bundledProduct,
        variant: bundledVariant.length ? bundledVariant[0] : {},
        title: title
      })
    }
  })
  return bundledProducts
}

export default (config = {}) => {
  return {
    data() {
      return {
        handle: null,
        product: null,
        bundles: [],
        allBundledProductList: [],
        variantSpecificBundles: {},
        noProductData: false,
        bundleProductMissing: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { productHandle } = params

      // TODO: This should be using nacelle content
      const page = await client
        .getEntries({
          content_type: 'product',
          'fields.handle': params.productHandle,
          include: 4
        })
        .then(async res => {
          const data = res.items[0]
          if (data && data.fields.features) {
            const features = await client.getEntry(data.fields.features.sys.id).then(async res => {
              data.fields.features = res
            })
          }
          return data
        })

      const productObj = {
        productHandle: config.productHandle || productHandle,
        product: null,
        locale: config.locale || $nacelle.locale,
        bundles: [],
        allBundledProductList: [],
        variantSpecificBundles: {}
      }

      if (process.server) {
        const fs = require('fs')
        try {
          const file = fs.readFileSync(
            `./static/data/products/${productObj.productHandle}--${productObj.locale}/static.json`,
            'utf-8'
          )
          productObj.product = JSON.parse(file)
        } catch (err) {
          productObj.noProductData = true
        }

        if (page?.fields?.bundles?.fields?.bundleGroup?.length) {
          // get product data for bundled products
          const bundles = page?.fields?.bundles?.fields?.bundleGroup
          try {
            const resolvedBundles = await Promise.all(
              getBundledProductsFromFile(
                bundles,
                productObj,
                fs,
                page?.fields?.bundles?.fields?.title
              )
            )
            productObj.bundles = resolvedBundles
          } catch (err) {
            productObj.bundleProductMissing = true
          }
        }

        if (page?.fields?.variants?.length) {
          // get product data for bundled products per variant
          page.fields.variants.forEach(async variant => {
            const bundles = variant?.fields?.bundles?.fields?.bundleGroup
            if (bundles?.length) {
              Promise.all(
                getBundledProductsFromFile(
                  bundles,
                  productObj,
                  fs,
                  variant?.fields?.bundles?.fields?.title
                )
              ).then(res => {
                productObj.variantSpecificBundles[variant.fields.title.toLowerCase()] = res
              })
            }
          })
        }
      } else {
        productObj.product = await $nacelle.data
          .product({
            handle: productObj.productHandle,
            locale: productObj.locale
          })
          .catch(() => {
            productObj.noProductData = true
          })

        if (page?.fields?.bundles?.fields?.bundleGroup?.length) {
          // get product data for bundled products
          const productHandles = []
          const bundles = page?.fields?.bundles?.fields?.bundleGroup
          bundles.forEach(bundle => {
            // Get productIds of the main product bundle
            if (bundle?.fields?.product?.fields?.handle) {
              productHandles.push(bundle?.fields?.product?.fields?.handle)
            }
          })
          // get productIds of variant specific bundles
          if (page?.fields?.variants?.length) {
            bundles.forEach(variant => {
              const bundles = variant?.fields?.bundles?.fields?.bundleGroup
              // Get productIds of the main product bundle
              if (bundles?.fields?.product?.fields?.handle) {
                productHandles.push(bundles?.fields?.product?.fields?.handle)
              }
            })
          }

          productObj.allBundledProductList = await $nacelle.data
            .products({
              handles: productHandles,
              locale: productObj.locale
            })
            .catch(() => {
              productObj.bundleProductMissing = true
            })
          productObj.bundles = getbundledProductsFromNacelle(
            bundles,
            productObj.allBundledProductList,
            page?.fields?.bundles?.fields?.title
          )

          if (page?.fields?.variants?.length) {
            // Form variant specific bundles data
            page.fields.variants.forEach(variant => {
              const bundles = variant?.fields?.bundles?.fields?.bundleGroup
              if (bundles?.length) {
                productObj.variantSpecificBundles[
                  variant.fields.title.toLowerCase()
                ] = getbundledProductsFromNacelle(
                  bundles,
                  productObj.allBundledProductList,
                  variant?.fields?.bundles?.fields?.title
                )
              }
            })
          }
        }
      }

      return {
        ...productObj,
        page
      }
    },
    async created() {
      if (this.product) {
        this.setProduct(this.product)
      }

      this.unsubscribe = this.$store.subscribe(async (mutation, state) => {
        if (mutation.type === 'user/setLocale') {
          this.locale = mutation.payload.locale

          this.product = await this.$nacelle.data
            .product({
              handle: this.productHandle,
              locale: this.$nacelle.locale
            })
            .catch(() => {
              this.noProductData = true
            })
        }
      })
    },
    methods: {
      ...mapMutations('product', ['setProduct'])
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
}
