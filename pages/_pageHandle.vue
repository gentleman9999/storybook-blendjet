<template>
  <div class="page" v-if="page">
    <div class="page__container">
      <h1 class="page__title">{{ page.title }}</h1>
      <div class="page__body">
        <RichTextRenderer :document="page.fields.body" />
      </div>
    </div>
  </div>
</template>

<script>
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import getPage from '~/mixins/getPage'

export default {
  components: {
    RichTextRenderer
  },
  mixins: [getPage()]
}
</script>

<style lang="scss" scoped>

.page {
  @include gradient-primary-light-purple(to bottom);

  &__container {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 50px;
    min-height: 100vh;
  }

  &__title {
    font-family: Medium;
    font-size: 38px;
    text-transform: uppercase;
    color: $grayscale-gray;
    line-height: 1.29;
    letter-spacing: 6px;
    padding-top: 60px;
    margin-bottom: 60px;
    text-align: center;

    @include respond-to('small') {
      font-size: 28px;
      letter-spacing: 3.5px;
      margin-top: 35px;
      margin-bottom: 35px;
    }
  }

  &__body {
    color: $grayscale-gray;
  }

  p {
    font-family: Regular;
    font-size: 16px;
    letter-spacing: 0.5px;
    line-height: 1.21;
    margin-bottom: 20px;
  }

  li {
    list-style-type: disc;
    margin-left: 20px;
  }

  h2 {
    font-family: Bold;
    font-size: 24px;
    line-height: 1.33;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }
}

</style>
