<template>
  <component 
    :is="tag"
    v-bind="linkProps()"
    class="cta-button button nacelle"
    @click="(event) => $emit('clicked', event)"
  >
    <slot></slot>
  </component>
</template>

<script>
  export default {
    props: {
      to: {
        type: String,
        required: true
      },

    },
    computed: {
      isExternalLink() {
        return this.to.match(/^(http(s)?|ftp):\/\//)
      },
      tag() {
        return this.isExternalLink ? 'a' : 'button'
      }
    },
    methods: {
      linkProps() {
        if (this.isExternalLink) {
          return {
            href: this.to,
            target: '_blank',
            rel: 'noopener'
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">

.cta-button {
  @include button-primary;
  width: 240px;
}

</style>