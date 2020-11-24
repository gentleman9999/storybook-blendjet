<template>
  <component :is="modeComponent"></component>
</template>
<script>
import BlendMode from '~/components/svg/BlendMode'
import PulseMode from '~/components/svg/PulseMode'
import LockMode from '~/components/svg/LockMode'
import FlashingRed from '~/components/svg/FlashingRed'
import SolidRedLights from '~/components/svg/SolidRedLights'
import Globe from '~/components/svg/Globe'
import Lightning from '~/components/svg/Lightning'
import Charge from '~/components/svg/Charge'
import Drop from '~/components/svg/Drop'
import Leaf from '~/components/svg/Leaf'

export default {
  props: {
    type: {
      type: String
    }
  },
  computed: {
    modeComponent() {
      let mode = 'BlendMode'
      switch(this.type) {
         case "Blue": {
            mode = 'BlendMode'
            break;
         }
         case "Blue Flashing": {
            mode = 'PulseMode'
            break;
         }
         case "Purple": {
            mode = 'LockMode'
            break;
         }
         case "Red Flashing": {
            mode = 'FlashingRed'
            break;
         }
         case "Red": {
            mode = 'SolidRedLights'
            break;
         }
         case "Globe": {
            mode = 'Globe'
            break;
         }
         case "Lightning": {
            mode = 'Lightning'
            break;
         }
         case "Charge": {
            mode = 'Charge'
            break;
         }
         case "Drop": {
            mode = 'Drop'
            break;
         }
         case "Leaf": {
            mode = 'Leaf'
            break;
         }
      }

      return mode
    }
  },
  components: {
    BlendMode,
    PulseMode,
    LockMode,
    FlashingRed,
    SolidRedLights,
    Globe,
    Lightning,
    Charge,
    Drop,
    Leaf
  }
}
</script>
