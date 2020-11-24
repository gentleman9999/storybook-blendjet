<template>
  <div
    :class="[swatchStyle, availableClass, swatchNameClass]"
    class="option-swatch nacelle no-select"
    @click="emitValue"
  >
    <div
      v-if="swatchStyle == 'bubble'"
      :class="swatchClass"
      :style="swatchBg"
      class="inside-color"
    />
    <span v-if="swatchStyle != 'bubble'">{{value}}</span>
  </div>
</template>

<script>
import flattenDeep from 'lodash.flattendeep'
export default {
  props: {
    value: {
      type: String
    },
    optionName: {
      type: String
    },
    swatchStyle: {
      type: String
    },
    swatchSrc: {
      type: String
    },
    selected: {
      type: Boolean
    },
    variants: {
      type: Array
    },
    selectedOptions: {
      type: Array
    }
  },
  methods: {
    emitValue() {
      if (this.optionAvailable) {
        this.$emit('swatchValue', this.value)
      }
    }
  },
  computed: {
    swatchClass() {
      if (this.value && this.optionName == 'Color') {
        const color = String(this.value).replace(/\s+/g, '-').toLowerCase()
        return `swatch-color__${color}`
      }

      return ''
    },
    swatchBg() {
      if (this.swatchSrc) {
        return {
          background: `url(${this.swatchSrc})`
        }
      }

      return null
    },
    variantsWithOptionValue() {
      if (this.variants) {
        let vm = this
        return this.variants.filter(variant => {
          if (
            variant.selectedOptions.filter(option => {
              return option.value == vm.value
            }).length > 0 &&
            variant.availableForSale
          ) {
            return true
          } else {
            return false
          }
        })
      }
    },

    optionAvailable() {
      let vm = this
      if (
        vm.variantsWithOptionValue &&
        vm.variantsWithOptionValue.length == 1 &&
        vm.selectedOptions.length > 0
      ) {
        let matches = flattenDeep(
          vm.variantsWithOptionValue[0].selectedOptions.map(option => {
            if (option.name != vm.optionName) {
              return vm.selectedOptions.map(selectedOption => {
                if (selectedOption.name == option.name) {
                  if (selectedOption.value == option.value) {
                    return true
                  } else {
                    return false
                  }
                }
              })
            }
          })
        )
        if (matches.includes(false)) {
          return false
        } else {
          return this.variantsWithOptionValue[0].availableForSale
        }
        // this is the last piece. for the variant that remains, determine whether or not its options are selected
        //
      } else if (
        vm.variantsWithOptionValue &&
        vm.variantsWithOptionValue.length == 1 &&
        vm.selectedOptions.length == 0
      ) {
        return true
      } else if (
        vm.variantsWithOptionValue &&
        this.variantsWithOptionValue.length > 1
      ) {
        // return this.variantsWithOptionValue.filter(variant =>{
        //   if(vm.selectedOptions.filter(option=>{
        //     if(option.name )
        //   }))
        // })
        return true
      } else {
        return false

        // IF MULTIPLE DIMENSIONS ////////////////////////////////
        // let variantsWithThisOptionValue = this.variants.filter(variant => {
        //   if (
        //     variant.selectedOptions.filter(option => {
        //       return option.value == vm.value
        //     }).length > 0
        //   ) {
        //     return true
        //   } else {
        //     return false
        //   }
        // })
        // if (variantsWithThisOptionValue.length == 1) {
        //   return variantsWithThisOptionValue[0].availableForSale
        // } else if (variantsWithThisOptionValue.length > 1) {
        //   return true
        // } else {
        //   return false
        // }

        // if (variants.length == 1) {
        //   return variants[0].availableForSale
        // } else {
        //   let availableVariants = variants.filter(variant => {
        //     return variant.availableForSale == true
        //   })

        //   if (availableVariants.length > 0 && vm.selectedOptions.length > 0) {
        //     let variantsWithThisOption = vm.selectedOptions.filter(option => {
        //       return option.value == vm.value
        //     })
        //     console.log(variantsWithThisOption)
        //     if (variantsWithThisOption.length > 0) {
        //       return true
        //     } else {
        //       return variantsWithThisOption[0].availableForSale
        //     }
        //   } else if (availableVariants.length > 0) {
        //     return true
        //   } else {
        //     return false
        //   }
        // }
      }
    },
    availableClass() {
      if (this.optionAvailable) {
        return 'available'
      } else {
        return 'not-available'
      }
    },
    swatchNameClass() {
      if (this.optionName) {
        let formattedOptionName = this.optionName.replace(' ', '-')
        return `swatch-color__${this.optionName}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bubble,
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 6px;
  @include respond-to('small') {
    margin: 3px;
  }
}

.bubble {
  border: 2px solid transparent;
  border-radius: 35px;
  padding: 2px;
  .inside-color {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    border: 1px solid lightgray
  }
}
.not-available {
  display: none;
  .inside-color {
    opacity: 0.5;
  }
}

.bubble.selected {
  transition: border 0.1s ease;
  border: 2px solid $grayscale-black;
}

.tab {
  transition: background-color 0.2s ease;
  border: 1px solid #a9a8a8;
  border-radius: 2px;
  padding: 0 0.5rem;
  height: 2rem;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9pt;
  text-transform: uppercase;
}

.tab.selected {
  background-color: #a9a8a8;
  color: white;
  font-weight: bold;
}


.swatch-color {
  &__black {
    background-color: black;
  }

  &__ocean { 
    background-color:  #49a9e3;
  }

  &__royal-blue {
    background-color: #21479E;
  }

  &__sky-blue {
    background-color: #A2DCD9;
  }

  &__purple {
    background-color: #633186;
  }

  &__mint {
    background-color: #b8eaf1;
  }

  &__lime {
    background-color: #C1D671;
  }

  &__seafoam {
    background-color: #ADD8AA;
  }

  &__orange {
    background-color: #FEA500
  }

  &__pink {
    background-color: #e57e85;
  }

  &__white {
    background-color: #FFF;
  }

  &__lavender {
    background-color: #C4BAF0
  }

  &__lemon {
    background-color: #fff467;
  }

  &__red {
    background-color: #F5012B;
  }

  &__coral {
    background-color: #EB5753;
  }

  &__hot-pink {
    background-color: #F82395;
  }

  &__blush {
    background-color: #E4ACD3;
  }

  &__blue {
    background-color: #58C4ED
  }

  &__green {
    background-color: #A6E748
  }

  
}

.not-available {
  text-decoration: line-through;
  border: 1px dashed rgb(219, 219, 219);
  color: rgb(219, 219, 219);
  cursor: not-allowed;
}
</style>
