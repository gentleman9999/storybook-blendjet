import createShopifyCheckoutClient from '@nacelle/shopify-checkout'

export default function (context, inject) {
  const checkoutClient = createShopifyCheckoutClient({
    myshopifyDomain: context.$config.myshopifyDomain,
    storefrontApiVersion: context.$config.shopifyStorefrontApiVersion,
    storefrontCheckoutToken: context.$config.shopifyStorefrontCheckoutToken
  })

  inject('shopifyCheckout', checkoutClient)
}
