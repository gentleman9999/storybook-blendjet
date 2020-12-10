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
import Diamond from '~/components/svg/Diamond'
import Mountain from '~/components/svg/Mountain'
import Pocket from '~/components/svg/Pocket'
import Snowflake from '~/components/svg/Snowflake'
import Fabric from '~/components/svg/Fabric'
import Dressing from '~/components/svg/Dressing'
import Cafe from '~/components/svg/Cafe'
import Milkshake from '~/components/svg/Milkshake'
import HappyHour from '~/components/svg/HappyHour'
import Protein from '~/components/svg/Protein'
import Fruit from '~/components/svg/Fruit'

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
         case "Diamond": {
            mode = 'Diamond'
            break;
         }
         case "Mountain": {
            mode = 'Mountain'
            break;
         }
         case "Pocket": {
            mode = 'Pocket'
            break;
         }
        case "Snowflake": {
            mode = 'Snowflake'
            break;
         }
        case "Fabric": {
            mode = 'Fabric'
            break;
         }
        case "Dressing": {
            mode = 'Dressing'
            break;
         }         
        case "Cafe": {
            mode = 'Cafe'
            break;
         }
        case "Milkshake": {
            mode = 'Milkshake'
            break;
         }
        case "Protein": {
            mode = 'Protein'
            break;
         }
        case "HappyHour": {
            mode = 'HappyHour'
            break;
         }
        case "Fruit": {
            mode = 'Fruit'
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
    Leaf,
    Diamond,
    Mountain,
    Pocket,
    Snowflake,
    Fabric,
    Dressing,
    Cafe,
    Milkshake,
    Protein,
    HappyHour,
    Fruit
  }
}
</script>