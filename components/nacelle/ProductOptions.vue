<template>
  <div v-if="options" class="options nacelle">
    <div class="option" v-for="option in options" :key="option.name">
      <product-option-swatches
        @optionSet="setSelectedOptions"
        :option="option"
        :variants="variants"
        :selectedOptions="selectedOptions"
        :clearOptionValue="clearOptionValue"
        :currentOption="currentOption"
      />
    </div>
  </div>
</template>

<script>
import ProductOptionSwatches from '~/components/nacelle/ProductOptionSwatches'
export default {
  props: {
    options: {
      type: Array
    },
    variants: {
      type: Array
    },
    variant: {
      type: Object
    },
    currentOption: {
      type: String,
      default: ''
    } 
  },
  data() {
    return {
      selectedOptions: [],
      clearOptionValue: false
    }
  },
  components: {
    ProductOptionSwatches
  },
  watch: {
    clearOptionValue(val) {
      if (val == true) {
        setTimeout(() => {
          this.clearOptionValue = false
          this.$emit('clear')
        }, 100)
      }
    }
  },
  watch: {
    allOptionsSelected(val) {
      if (val == true) {
        this.$emit('selectedOptionsSet', this.selectedOptions)
      }
    },
  },
  computed: {
    isChildOfModal() {
      if (this.$parent.$options._componentTag == 'interface-modal') {
        return true
      } else {
        return false
      }
    },
    allOptionsSelected() {
      let vm = this
      if (this.options.length == 1 && this.options[0].values.length == 1) {
        return true
      } else {
        let optionsSelected = this.options.map(option => {
          let searchOptions = this.selectedOptions.filter(selected => {
            return selected.name == option.name
          })
          if (searchOptions.length == 1) {
            return true
          } else if (option.values.length == 1) {
            return true
          } else {
            return false
          }
        })

        if (
          optionsSelected.every(option => {
            return option == true
          })
        ) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    setSelectedOptions(selectedOption) {
      let vm = this
      let searchOptions = this.selectedOptions.filter(option => {
        return option.name == selectedOption.name
      })
      if (searchOptions.length == 0) {
        vm.selectedOptions.push(selectedOption)
      } else {
        let index = vm.selectedOptions.findIndex(option => {
          return option.name == selectedOption.name
        })
        vm.selectedOptions.splice(index, 1, selectedOption)
      }
    },
    confirmSelection() {
      this.$emit('confirmedSelection')
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;

}

.swatches {
  display: flex;
  justify-content: center;
}

.reset-options {
  margin-bottom: 2rem;
}

.option-label {
  font-weight: 600;
  text-transform: uppercase;
}

.selected {
  background: red;
}
</style>
