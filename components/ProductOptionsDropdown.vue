<template>
  <div v-if="option && option.values.length">
    <div
      :class="{
        'dropdown-upsell': upsellStyle,
        dropdown: !upsellStyle
      }"
      tabindex="0"
      @focusout="isOpen = false"
      :style="styleObj"
    >
      <!-- MENU TRIGGER -->
      <div class="option-name" v-if="upsellStyle">{{ option.name }}:</div>
      <div
        :class="{
          'dropbtn-upsell': upsellStyle,
          dropbtn: !upsellStyle
        }"
        role="button"
        @click.prevent="toggleOpen"
        v-show="!isOpen"
      >
        <!-- VARIANT IMAGE -->
        <div
          v-if="showVariantImages && getImageForOption(selectedOptionValue)"
          class="dropdown-thumb"
        >
          <img class="dropdown-thumb-image" :src="getImageForOption(selectedOptionValue)" />
        </div>

        <!-- LABEL -->
        <span>{{ selectedOptionValue }}</span>
        <!-- DROPDOWN INDICATOR -->
        <CaretDown
          :styleObj="{ marginLeft: upsellStyle ? '16px' : '30px' }"
          :color="upsellStyle ? 'white' : '#373975'"
        />
      </div>
      <!-- MENU -->
      <transition name="fade">
        <ul
          v-if="isOpen"
          :class="{
            'dropdown-content-upsell': upsellStyle,
            'dropdown-content': !upsellStyle,
            'dropdown-content__up': this.direction === `up`
          }"
        >
          <li class="cart-title" v-if="upsellStyle">
            <span>{{ option.name }}</span>
          </li>
          <li
            v-for="(optionItem, i) in option.values"
            :key="i"
            @click.prevent="setOptionValue(optionItem.value)"
          >
            <!-- THUMBNAIL - Variant Image -->
            <div
              v-if="showVariantImages && getImageForOption(optionItem.value)"
              class="dropdown-thumb"
            >
              <img class="dropdown-thumb-image" :src="getImageForOption(optionItem.value)" />
            </div>
            <span>{{ optionItem.value }}</span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import CaretDown from '~/components/svg/caretDown'

export default {
  props: {
    upsellStyle: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object
    },
    variants: {
      type: Array
    },
    selectedOptions: {
      type: Array
    },
    clearOptionValue: {
      type: Boolean
    },
    updatedOptionValue: {
      type: String,
      default: ''
    },
    currentOption: {
      type: String,
      default: ''
    },
    styleObj: {
      type: Object,
      default: () => {}
    },
    direction: {
      type: String,
      default: 'down',
      validator(value) {
        return ['up', 'down'].indexOf(value) !== -1
      }
    },
    showVariantImages: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CaretDown
  },
  mixins: [imageOptimize],
  data() {
    return {
      isOpen: false,
      selectedOptionValue: this.currentOption
    }
  },
  computed: {
    getAvailableOptions() {
      if (this.variantsWithOptionValue() && this.variantsWithOptionValue().length >= 1) {
        let values = []
        this.variantsWithOptionValue().map(variant => {
          let option = variant.selectedOptions.filter(option => {
            return option.name == 'Size'
          })

          if (values.length >= 1) {
            for (var i = 0; i < values.length; i++) {
              if (values[i].value != option[0].value) {
                values.push({ value: option[0].value })
                break
              }
            }
          } else {
            values.push({ value: option[0].value })
          }
        })
        return { name: 'Size', values: values }
      } else {
        return { name: 'Size', values: [] }
      }
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    setOptionValue(value) {
      this.selectedOptionValue = value
      this.isOpen = false
      if (this.option.name !== 'Size') this.$emit('updateOptions', this.getAvailableOptions)
    },
    variantsWithOptionValue() {
      if (this.variants) {
        let vm = this
        return this.variants.filter(variant => {
          return (
            variant.selectedOptions.filter(option => {
              if (option.name !== 'Size') {
                return option.value == vm.selectedOptionValue
              }
            }).length > 0
          )
        })
      }
    },
    /**
     * Provided an option value, fetches the variant image for the first
     * variant that has the option set to that value.
     */
    getImageForOption(optionValue) {
      if (!Array.isArray(this.variants) || !this.option) return undefined

      // Get all variants that have the argument as an option value
      const variantsWithOption = this.variants.filter(v =>
        v.selectedOptions.some(
          o => o.name === this.option.name && o.value === this.selectedOptionValue
        )
      )

      // Filter for those with an image
      const variantWithImage = variantsWithOption.find(
        v => v && v.featuredMedia && v.featuredMedia.src
      )

      // Return the first image (assuming one was found)
      return variantWithImage ? variantWithImage.featuredMedia.src : undefined
    }
  },
  watch: {
    selectedOptionValue(newVal) {
      if (newVal != null) {
        this.$emit('optionSet', { name: this.option.name, value: newVal })
      }
    },
    clearOptionValue(newVal) {
      if (newVal == true) {
        this.selectedOptionValue = null
        this.$emit('clearedOptionValue')
      }
    },
    updatedOptionValue(newVal) {
      this.setOptionValue(newVal)
    },
    currentOption(newVal) {
      this.setOptionValue(newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Dropdown Button */
.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
}

.dropbtn-upsell {
  display: flex;
  flex-direction: row;
}
.option-name {
  margin-right: 10px;
  font-family: Regular;
  font-size: 12px;
  letter-spacing: 0.5px;
  line-height: 1.17;
  color: #ffffff;
  text-transform: capitalize;
}

.not-available {
  text-decoration: line-through;
  border: 1px dashed rgb(219, 219, 219);
  color: rgb(219, 219, 219);
  cursor: not-allowed;
}
.cart-title {
  margin-left: 17px;
  color: $grayscale-gray;
  text-transform: uppercase;
  align-items: right;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  color: $primary-purple;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border: 2px solid $secondary-purple-4;
  border-radius: 25px;
  align-items: center;
  width: 360px;
  min-width: 160px;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  font-size: $text-small;
  background-color: $grayscale-white;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  @media screen and (max-width: 360px) {
    width: 300px;
  }
}

.dropdown-upsell {
  position: relative;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: center;
  width: 360px;
  min-width: 160px;
  font-family: Bold;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  font-size: $text-small;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  @media screen and (max-width: 360px) {
    width: 300px;
  }
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  top: -3px;
  background-color: $primary-purple-tint;
  border-radius: 25px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $secondary-purple-4;
  z-index: 1;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;

  &__up {
    top: unset;
    bottom: 3px;
  }

  & > li {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:last-child {
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
    }
    &:hover {
      @include hover-transition;
    }
  }
}

.dropdown-content-upsell {
  position: absolute;
  top: -3px;
  background-color: $primary-purple-tint;
  border-radius: 25px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $secondary-purple-4;
  z-index: 1;
  font-family: Bold;
  text-transform: uppercase;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  color: $primary-purple;
  z-index: 3;

  &__up {
    top: unset;
    bottom: 3px;
  }

  & > li {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:last-child {
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
    }
    &:hover {
      @include hover-transition;
    }
  }
}

.dropdown-thumb {
  margin-right: 20px;
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
  border-radius: 25px;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background: transparent;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.6s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.6s;
}
</style>
