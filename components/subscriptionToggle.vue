<template>
  <div>
    <div v-if="!checkbox" class="toggle-container">
      <div class="text-container">
        <!-- TODO - This should pull the discount dynamically from the Shopify metafields for this product/variant... -->
        <div class="text-container__option subscription">
          Subscribe &amp; <br />
          Save 25%
        </div>
        <div class="text-container__option onetime">
          One-time <br />
          Purchase
        </div>
      </div>
      <div class="toggle" :class="[this.state_class]" @click="onClick">
        <div class="draggable" :style="style"></div>
      </div>
    </div>

    <div class="checkbox-container" v-if="checkbox">
      <Checkbox
        :color="color"
        :initialCheck="true"
        :label="'Subscribe & Save 25%'"
        @checked="handleCheck"
      />
    </div>
  </div>
</template>

<script>
import rechargeProperties from '~/mixins/rechargeMixin'
import productMetafields from '~/mixins/productMetafields'
import Checkbox from '~/components/checkbox'

export default {
  props: {
    // Boolean value representing whether the toggle is active or not
    value: {
      type: Boolean,
      default: true
    },
    // Shopify product data
    product: {
      type: Object,
      default: () => {
        return {
          priceRange: {
            min: '0',
            max: '0'
          },
          title: '',
          category: '',
          featuredMedia: {
            src: '',
            thumbnailSrc: ''
          },
          description: '',
          id: '',
          handle: '',
          variants: [],
          options: [],
          metafields: []
        }
      }
    },
    // Toggle to true to have toggle appear as normal checkbox <input />
    checkbox: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'purple'
    }
  },
  components: {
    Checkbox
  },
  mixins: [rechargeProperties, productMetafields],
  data() {
    return {
      width: 100,
      pressed: 0,
      position: 0,
      isChecked: this.value // Internal property to hold 'checked' state. Based on the current `value` to avoid competing with parent passing prop down
    }
  },
  mounted() {},
  computed: {
    productType() {
      return this.value ? 'subscription' : 'onetime'
    },
    style() {
      return {
        transform: `translateX(${this.pos_percentage})`
        // transition: 'all 3s'
      }
    },
    pos_percentage() {
      return `${(this.position / this.width) * 100}%`
    },
    state_class() {
      if (this.state) {
        return 'active'
      }
    }
  },
  watch: {
    // Position of the toggle
    position() {
      this.isChecked = this.position >= 50
    },
    product() {
      if (this.value) {
        this.purchaseType = 'subscription'
      } else {
        this.purchaseType = 'onetime'
      }
    }
  },
  methods: {
    // Main handler for when the toggle state is changed
    handleCheck(checked) {
      this.purchaseType = checked ? 'subscription' : 'onetime'
      this.isChecked = !!checked
      this.$emit('subscriptionChanged', this.isChecked)
    },
    onClick() {
      this.toggle(!this.isChecked)
    },
    toggle(state) {
      this.isChecked = !!state ?? !this.isChecked // set equal to state, or opposite of current if undefined
      this.position = this.isChecked ? 0 : 100

      // emit event indicating toggled state has changed.
      // TODO - 'check' and 'toggle' should route through the same method...
      this.$emit('input', this.isChecked)
    },

    // In progress for mobile drag interface
    dragging(e) {
      const pos = e.clientX - this.$el.offsetLeft
      const percent = (pos / this.width) * 100
      this.position = percent <= 0 ? 0 : percent >= 100 ? 100 : percent
    },
    dragStart(e) {
      this.startTimer()
      window.addEventListener('mousemove', this.dragging)
      window.addEventListener('mouseup', this.dragStop)
    },
    dragStop() {
      window.removeEventListener('mousemove', this.dragging)
      window.removeEventListener('mouseup', this.dragStop)
      this.resolvePosition()
      clearInterval(this.$options.interval)
      if (this.pressed < 30) {
        this.toggle(!this.isChecked)
      }
      this.pressed = 0
    },
    startTimer() {
      this.$options.interval = setInterval(() => {
        this.pressed++
      }, 1)
    },
    resolvePosition() {
      this.position = this.isChecked ? 100 : 0
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 360px;
$background: #fff;
$background-active: #fff;
$border-color: $secondary-purple-3;
$button-size: 180px;
$button-color: $secondary-purple-4;

$checkbox-checkmark-color: $grayscale-white;
$checkbox-border-color: $grayscale-white;
.toggle-container {
  position: relative;
  height: 50px;

  @media screen and (max-width: 360px) {
    width: 302px;
  }
}
.text-container {
  position: absolute;
  background: transparent;
  z-index: 2;
  display: flex;
  pointer-events: none;
  cursor: pointer;

  @media screen and (max-width: 360px) {
    width: 302px;
  }

  &__option {
    width: 180px;
    text-align: center;
    padding-top: 11px;
    color: $primary-purple;
    font-family: Bold;
    line-height: 1.17;
    letter-spacing: 1.75px;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;

    @media screen and (max-width: 360px) {
      font-size: 10px;
      padding-top: 14px;
    }
  }
}

.toggle {
  width: $width;
  height: 100%;
  background: $background;
  border: 1px solid $border-color;
  border-radius: 200px;
  transition: background 0.6s;
  position: relative;
  cursor: pointer;

  @media screen and (max-width: 360px) {
    width: 302px;
  }

  .draggable {
    width: $button-size;
    height: 100%;
    background: $button-color;
    border-radius: 200px;
    border: 2px solid $primary-purple;
    transform: translateX(0%);
    transition: transform 0.5s ease-in-out;
    cursor: pointer;

    @media screen and (max-width: 360px) {
      width: 151px;
    }
  }

  &.active {
    background: $background-active;
    transition: background 0.6s;
  }
}
</style>
