import localforage from 'localforage'
const isFunc = func => typeof func === 'function'

export const state = () => ({
  id: null,
  url: null
})

export const mutations = {
  setId(state, payload) {
    localforage.setItem('checkout-id', payload)
    state.id = payload
  },

  setUrl(state, payload) {
    localforage.setItem('checkout-url', payload)
    state.url = payload
  },

  setCheckout(state, { id, url }) {
    localforage.setItem('checkout-id', id)
    localforage.setItem('checkout-url', url)
    state.id = id
    state.url = url
  }
}

export const actions = {
  async initializeCheckout({ commit, dispatch }) {
    const id = await localforage.getItem('checkout-id')
    const url = await localforage.getItem('checkout-url')
    if (id && url) {
      const { completed } = await this.$nacelle.checkout.get({ id, url })
      if (completed) {
        await dispatch('resetCheckout')
      } else {
        commit('setCheckout', { id, url })
      }
    }
  },

  async resetCheckout({ commit, dispatch }) {
    commit('setCheckout', { id: null, url: null })
    await dispatch('cart/resetLineItems', null, { root: true })
  },

  async processCheckout({ dispatch }, { beforeCreate, beforeRedirect }) {
    if (isFunc(beforeCreate)) {
      await beforeCreate()
    }
    await dispatch('checkoutCreate')
    await dispatch('addCheckoutParams')
    if (isFunc(beforeRedirect)) {
      await beforeRedirect()
    }
    dispatch('checkoutRedirect')
  },

  async checkoutCreate({ commit, dispatch, state, rootState, rootGetters }) {
    const cartItems = rootGetters['cart/checkoutLineItems']
    const checkoutId = state.id || ''

    if (cartItems.length === 0) {
      throw new Error('Cannot checkout with an empty cart')
    }

    //fix for uBlock breaking checkout recommended by CJ from Nacelle
    const recartMetafields = this.$recart.getMetafieldsForCheckout() || []

    // __capi__.metafields are provided by Outsmartly for first-party tracking
    const outsmartlyMetafields = (typeof window !== "undefined" && window.__capi__ && Array.isArray(__capi__.metafields)) ? __capi__.metafields : []

    let checkout = await this.$nacelle.checkout.process({
      cartItems,
      checkoutId,
      metafields: [...recartMetafields, ...outsmartlyMetafields]
    })
    if (checkout && checkout.completed) {
      checkout = await this.$nacelle.checkout.process({ cartItems, checkoutId: '' })
    }

    if (!checkout || !checkout.id || !checkout.url) {
      throw new Error('Checkout Failure')
    }

    // Intercept ReCharge checkout hostname URL to 'checkout.blendjet.com'
    // if(checkout.url.includes('rechargeapps.com')){
    //   const url = new URL(checkout.url)
    //   url.hostname = 'checkout.blendjet.com'
    //   checkout.url = url.toString()
    // }

    if (rootState.events) {
      dispatch('events/checkoutInit', { cart: rootState.cart.lineItems }, { root: true })
    }

    commit('setCheckout', checkout)
  },

  async addCheckoutParams({ commit, dispatch, state, rootState }) {
    const queryOperator = state.url.includes('?') ? '&' : '?'
    const linkerParam = await dispatch('getLinkerParam')
    await commit(
      'setUrl',
      `${state.url}${queryOperator}c=${JSON.stringify(rootState.user.userData)}&${linkerParam}`
    )
  },

  async getLinkerParam() {
    return new Promise((resolve, reject) => {
      const gaClient = process.browser ? window.ga : undefined

      if (typeof gaClient !== 'undefined') {
        gaClient(tracker => resolve(tracker.get('linkerParam')))
      }

      // if no ga resolve with empty string
      resolve('')
    })
  },

  async checkoutRedirect({ state }) {
    if (process.browser) {
      const discountCode = await localforage.getItem('discount')
      let url = state.url
      if (url.includes('rechargeapps.com')) {
        url = url.replace(
          'checkout.rechargeapps.com',
          'checkout.blendjet.com'
        )
      }
      window.location = discountCode ? url + '&discount=' + discountCode : url
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
