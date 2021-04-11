import { mapMutations } from 'vuex'
import { createClient } from '~/plugins/contentful.js'
const client = createClient();

export default (config = {}) => {
  return {
    data() {
      return {
        handle: null,
        product: null,
        noProductData: false
      }
    },
    async asyncData(context) {
      const { params, app } = context
      const { $nacelle } = app
      const { productHandle } = params

      // TODO: This should be using nacelle content 
      let page = await client.getEntries({
        content_type: 'product',
        'fields.handle': params.productHandle,
      })
      .then(async (res) => {
        const data = res.items[0]
        if (data && data.fields.features) {
          let features = await client.getEntry(data.fields.features.sys.id)
            .then(async (res) => {
              data.fields.features = res
            })
        }
        return data
      })

      const productObj = {
        productHandle: config.productHandle || productHandle,
        product: null,
        locale: config.locale || $nacelle.locale
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
      } else {
        productObj.product = await $nacelle.data.product({
          handle: productObj.productHandle,
          locale: productObj.locale
        }).catch(() => {
          productObj.noProductData = true
        })
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

          this.product = await this.$nacelle.data.product({
            handle: this.productHandle,
            locale: this.$nacelle.locale
          }).catch(() => {
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
