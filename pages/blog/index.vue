<!--
/****
/* Blog data is loaded from your CMS with the getBlog mixin.
/* For information about connecting your blog, please refer to:
/*
/* https://docs.getnacelle.com/nuxt/blogs.html#blogs
/****
-->
<template>
  <div class="blog">
    <div class="blog__hero-banner">
      <div class="blog__hero-banner__image-container">
        <picture>
          <img class="blog__hero-banner__image-container__img" :src="optimizeSource({url:heroUrl})" />
        </picture>
      </div>
      <div class="blog__hero-banner__text">
        Blendjet Blog
      </div>
    </div>
    <div class="blog__filters">
      <div class="blog__filters__left">
        <div class="blog__filters__filter">
        </div>
        <div class="blog__filters__filter">
        </div>
      </div>
      <div class="blog__filters__right">
        <div class="blog__filters__filter">
        </div>
      </div>
    </div>
    <!-- <div class="blog__preview-container"> -->
      <div v-if="featuredArticle" class="blog-feature">
        <article-preview
          :title="featuredArticle.title || ''"
          :handle="featuredArticle.handle || ''"
          :excerpt="featuredArticle.excerpt || ''"
          :tags="featuredArticle.tags"
          :featured-media="featuredArticle.featuredMedia"
          :is-featured="true"
          :publishDate="featuredArticle.publishDate"
          :path-fragment="`/${$route.name}/`"
        />
      </div>
      <div class="section preview-grid">
        <!-- <div class="container">
          <div class="columns is-multiline"> -->
            <div
              v-for="article in filteredArticles"
              :key="article.id"

            >
              <article-preview
                :title="article.title || ''"
                :handle="article.handle || ''"
                :excerpt="article.excerpt || ''"
                :tags="article.tags"
                :publishDate="article.publishDate"
                :featured-media="article.featuredMedia"
                :path-fragment="`/${$route.name}/`"
              />
            <!-- </div>
          </div> -->
          <observe-emitter v-on:observe="fetchMore" />
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import getBlog from '~/mixins/getBlog'
import viewEvent from '~/mixins/viewEvent'
import ArticlePreview from '~/components/nacelle/ArticlePreview'
import ObserveEmitter from '~/components/nacelle/ObserveEmitter'
import imageOptimize from '~/mixins/imageOptimize'
import { createClient } from '~/plugins/contentful.js'

export default {
  components: {
    ArticlePreview,
    ObserveEmitter
  },
  mixins: [
    getBlog(),
    viewEvent('blog'),
    imageOptimize
  ],
  data() {
    return {
      heroUrl: null
    }
  },

  computed: {
    ...mapGetters('space', ['getMetatag']),
    blogProducts() {
      if (this.blog && this.blog.products && this.blog.products.length > 0) {
        return this.blog.products
      }

      return null
    },
    featuredArticle() {
      if (this.articles.length > 0) {
        return this.articles[0]
      }

      return null
    },
    filteredArticles() {
      const copy = [...this.articles]
      return copy.splice(1, copy.length - 1)
    }
  },
  async mounted() {
    const client = createClient()
    const asset = await client.getAsset('3QDrYYQGdBtjLI4VQo1PBH')
    this.heroUrl = `https:${asset.fields.file.url}`
    console.log('blog handle');
    console.log(this.$route.name);
    console.log('articles', this.articles)
  },
  head() {
    const properties = {}
    const meta = []
    const title = this.getMetatag('title')

    let fullTitle = 'Blog'

    if (title) {
      fullTitle = `${fullTitle} | ${title.value}`
    }

    properties.title = fullTitle
    meta.push({
      hid: 'og:title',
      property: 'og:title',
      content: fullTitle
    })

    return {
      ...properties,
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
.columns /deep/ .article-preview {
  // padding: 1rem;
  // border: 1px solid #f5f5f5;
}

.blog-feature {
  background-color: #f6f6f6;
}

.blog {
  margin-top: 100px;

  &__hero-banner {
    position: relative;

    &__text {
      position: absolute;
      width: 100%;
      margin: 0 auto;
      top: 47%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      font-family: Medium;
      font-size: 54px;
      line-height: 1;
      letter-spacing: 10px;
      color: $grayscale-white;
      text-transform: uppercase;
    }

    &__image-container {
      transition: all 1s ease;

      &__img {
        object-fit: cover;
        object-position: center;
        height: 400px;
        width: 100%;
      }
    }
  }

  &__filters {
    height: 66px;

  }
}

.preview-grid {
  display: flex;
  flex-flow: row wrap;
  padding:0;
  background-color: $grayscale-white;
  padding: 0 30px;
  @include respond-to('small') {
    padding: 0 20px;
  }
}
</style>
