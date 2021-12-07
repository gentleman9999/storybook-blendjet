<template>
  <div class="quantity-container">
    <div class="mobile-select-container" v-if="isMobile">
      <div class="select-cover" role="button">
        <span class="select-cover__selected">{{ quantity }}</span>
        <CaretDown :styleObj="{ marginLeft: '16px', marginBottom: '3px' }" :color="'#FFF'" />
      </div>
      <select
        class="mobile-select"
        @change="updateQuantity(selectQuantity)"
        v-model="selectQuantity"
      >
        <option v-for="(item, i) in items" :key="i" :value="item">{{ item }}</option>
      </select>
    </div>

    <div class="dropdown-cart" tabindex="0" @focusout="visible = false" v-if="!isMobile">
      <transition name="fade">
        <ul :is="type.main" v-if="visible" class="dropdown-content-cart">
          <li
            :is="type.item"
            v-for="(item, i) in items"
            :key="i"
            @click.prevent="updateQuantity(item)"
          >
            <span class="check-selected-container">
              <span class="check-selected" v-if="item === quantity">
                <svg
                  width="16px"
                  height="11px"
                  viewBox="0 0 16 11"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <title>Right</title>
                  <g id="PDP" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                      id="D-BlendJet-PDP-BlendJet"
                      transform="translate(-1083.000000, -6832.000000)"
                      fill="#373795"
                    >
                      <g id="Smoothies" transform="translate(0.000000, 6247.000000)">
                        <g id="3" transform="translate(1028.000000, 78.000000)">
                          <g id="Checkbox" transform="translate(53.000000, 503.000000)">
                            <g
                              id="Right"
                              transform="translate(10.000000, 9.500000) scale(-1, 1) rotate(-90.000000) translate(-10.000000, -9.500000) translate(4.500000, 2.000000)"
                            >
                              <polygon
                                id="BG"
                                transform="translate(5.500025, 5.499990) rotate(-45.000000) translate(-5.500025, -5.499990) "
                                points="-0.999966138 4.79998971 12.0000249 4.79998971 12.0000249 6.19998971 -0.999966138 6.19998971"
                              ></polygon>
                              <polygon
                                id="BG-Copy-2"
                                transform="translate(3.500012, 11.449860) scale(1, -1) rotate(-45.000000) translate(-3.500012, -11.449860) "
                                points="2.89919205e-05 10.7498605 6.99999503 10.7498605 6.99999503 12.1498605 2.89919205e-05 12.1498605"
                              ></polygon>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </span>
            <span class="options-cart">{{ item }}</span>
          </li>
          <li :is="type.item" class="selected-option">
            <span class="swatch-container"></span><span class="options-cart">{{ quantity }}</span>
            <span class="caret-container"
              ><CaretDown :styleObj="{ marginRight: '10px', marginLeft: '15px' }"
            /></span>
          </li>
        </ul>
      </transition>

      <div class="dropbtn" role="button" @click.prevent="toggleVisible" v-show="!visible">
        <span class="selected-option">{{ quantity }}</span>
        <CaretDown :styleObj="{ marginLeft: '23px' }" :color="'#FFF'" />
      </div>
    </div>
  </div>
</template>

<script>
import imageOptimize from '~/mixins/imageOptimize'
import CaretDown from '~/components/svg/caretDown'

export default {
  props: {
    items: {
      type: Array,
      default: () => [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    },
    label: {
      type: String,
      default: 'Quantity'
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  components: {
    CaretDown
  },
  mixins: [imageOptimize],
  data() {
    return {
      visible: false,
      type: {
        main: 'ul',
        item: 'li'
      },
      isMobile: false,
      selectQuantity: 0
    }
  },
  watch: {
    quantity(newVal) {
      if (newVal !== this.selectQuantity) {
        this.selectQuantity = newVal
      }
    }
  },
  methods: {
    toggleVisible() {
      this.visible = !this.visible
    },
    updateQuantity(item) {
      console.log('quantity', item)
      this.$emit('update:quantity', item)
      this.visible = false
    }
  },
  mounted() {
    this.selectQuantity = this.quantity
    if (window.innerWidth < 768) {
      this.isMobile = true
    }
  }
}
</script>

<style lang="scss" scoped>
.quantity-container {
  width: 50px;
}

.dropbtn {
  color: $primary-purple;
  outline: none;
  display: flex;
  align-items: center;
}

.dropdown-cart {
  position: relative;
  color: $grayscale-white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  align-items: center;
  font-family: Bold;
  letter-spacing: 1.75px;
  line-height: 1.17;
  font-size: $text-small;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.dropdown-content-cart {
  background-color: $primary-purple-tint;
  border-radius: 12px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-flow: column nowrap;
  border: 2px solid $primary-purple;
  font-family: Bold;
  font-size: 14px;
  letter-spacing: 1.75px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
  z-index: 3;
  position: absolute;
  bottom: -10px;

  & > li {
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:nth-child(even) {
      background-color: $secondary-purple-4;
    }
    &:last-child {
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
}

.mobile-select-container {
  display: flex;
  align-items: center;
  position: relative;
}

.select-cover {
  pointer-events: none;
  display: flex;
  align-items: center;

  &__selected {
    text-align: center;
    color: $grayscale-white;
    border: none;
    box-shadow: none;
    text-transform: uppercase;
    font-family: Bold;
    letter-spacing: 1.75px;
    line-height: 1.17;
    font-size: $text-small;
  }
}

.mobile-select {
  opacity: 0;
  top: 0;
  right: 0;
  position: absolute;
  font-size: 16px;
}

.check-selected-container {
  width: 40px;
}

.check-selected {
  margin-left: 10px;
}

.swatch-container {
  width: 40px;
}

.caret-container {
  transform: rotate(180deg);
}

.options-cart {
  color: $primary-purple;
  &:hover {
    @include hover-transition;
  }
}

.cart-title {
  margin-left: 17px;
  color: $grayscale-gray;
  text-transform: uppercase;
}

.option-label {
  font-family: Regular;
  font-size: $text-small;
  letter-spacing: 0.5px;
  line-height: 1.17;
  margin-right: 14px;
  color: $grayscale-white;
}

.selected-option {
  color: $grayscale-white;
  text-transform: uppercase;
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
