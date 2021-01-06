<template>
  <div>
    <div class="page-container">
      <content-hero-banner
      id="hero-banner"
      :imageUrl="optimizeSource({ url: page.fields.heroImageDesktop.fields.file.url + '?w=2000' })"
      :mobileBackgroundImgUrl="optimizeSource({ url: page.fields.heroImageMobile.fields.file.url + '?w=450' })"
      backgroundAltTag="Brand Ambassador Hero Image"
      :title="page.fields.heading"
      :superHeading="page.fields.superHeading"
      :shortDescription="page.fields.heroBannerContent.content[0].content[0].value"
      :ctaUrl="page.fields.heroApplyButtonLink"
      :ctaText="'Apply'"
      :ctaTwoUrl="page.fields.heroLoginButtonLink"
      :ctaTwoText="'Login'"
      :location="'brand-ambassador'"
      :textColor="'white'"
      />

      <div class="image-tile--section">
        <div class="image-tile--section-heading">
          <RichTextRenderer :document="page.fields.perksContent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeroBanner from '~/components/nacelle/ContentHeroBanner'
import imageOptimize from '~/mixins/imageOptimize'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'
import { createClient } from '~/plugins/contentful.js'
const client = createClient()

export default {
  components: {
    ContentHeroBanner,
    RichTextRenderer
  },
  mixins: [imageOptimize],
  async asyncData() {

    let brandAmbassador = await client.getEntry('2Vziod8PXesNjq3SAZwh20')

    return { page: brandAmbassador }
  },
}
</script>

<style lang="scss" scoped>
.image-tile--section {
  padding: 140px 0;
}

.image-tile--section-heading {
  text-align: center;
  max-width: 570px;
  margin: 0 auto;
}

.image-tile--section-heading h3 {
  font-size: 28px;
  color: #000;
  text-transform: uppercase;
  font-family: Medium;
  letter-spacing: 1.5px;
  margin: 0 0 20px;
}
</style>