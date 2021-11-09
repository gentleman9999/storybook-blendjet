<template>
  <ul class="variety-dropdown-content">
    <li v-for="(optionItem, i) in options" :key="i" @click.prevent="setOptionValue(i)">
      <span v-if="optionItem.product.featuredMedia.src" class="dropdown-thumb">
        <img class="dropdown-thumb-image" :src="optionItem.product.featuredMedia.src" />
      </span>
      {{ getOptionTitle(optionItem.product.title) }}
    </li>
  </ul>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
export default {
  props: {
    options: {
      type: Array
    }
  },
  mixins: [imageOptimize],
  methods: {
    setOptionValue(index) {
      this.$emit('updateOptions', index)
    },
    getOptionTitle(title) {
      if(title?.toLowerCase()?.includes('protein')) {
        return '6 JETPACK PROTEIN SMOOTHIES'
      } else if(title?.toLowerCase()?.includes('jetpack')) {
        return '6 JETPACK SMOOTHIES'
      } else {
        return title
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* Dropdown Content (Hidden by Default) */
.variety-dropdown-content {
  position: relative;
  border-radius: 25px;
  background-color: $primary-purple-tint;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  z-index: 1;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;
  min-width: 340px;
  font-size: 12px;
  color: $primary-purple;
  border: 2px solid $secondary-purple-4;
  overflow: hidden;

  &__up {
    top: unset;
    bottom: 3px;
  }

  & > li {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:hover {
      @include hover-transition;
    }
  }
}

.dropdown-thumb {
  margin-right: 20px;
  margin-left: 20px;
}

.dropdown-thumb-image {
  height: 35px;
  width: auto;
}

/* Links inside the dropdown */
.dropdown-content a {
  text-decoration: none;
  color: $primary-purple !important;
}

.menu-item {
  color: $primary-purple;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background: transparent;
}
</style>
