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
  
  &__aqua {
    background-color: #88dbdf
  }  
  
  &__salmon {
    background-color: #FF8674
  }
  
  &__cool-gray {
    background-color: #A7A8A9
  }
  
  &__navy {
    background-color: #003c71
  }
  
  &__forrest-green {
    background-color: #006845
  }
  
  &__cinnamon {
    background-color: #862633
  }
  
  &__white-marble {
background-size: cover !important;	  
background-image : url(data:image/png;base64,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)
  }
  &__cheetah {
background-size: cover !important;
background-image : url(data:image/png;base64,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)
  }                  
}

.not-available {
  text-decoration: line-through;
  border: 1px dashed rgb(219, 219, 219);
  color: rgb(219, 219, 219);
  cursor: not-allowed;
}
</style>
