<template>
  <div class="instagram-container">
    <div class="instagram-text-block">
      <div class="instagram-text-block__title">
        @blendjet
      </div> 
      <div class="instagram-text-block__on-instagram">
        on instagram
      </div>
      <div class="instagram-text-block__content">
        Get inspired with recipes, tips, and tricks from fellow BlendJetters. 
        <div class="instagram-text-block__hastag">
          #blendeverywhere
        </div>
      </div>
      <div class="instagram-text-block__follow">
        <a target="_blank" href="https://www.instagram.com/blendjet">
        <button role="button" class="instagram-text-block__follow__button">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16">
              <path fill="#373795" d="M10.509 15.01c1.192-.057 2.248-.33 3.118-1.203.87-.87 1.142-1.925 1.201-3.117.07-1.229.07-4.908 0-6.136-.056-1.192-.328-2.248-1.201-3.118C12.757.566 11.7.294 10.509.234c-1.229-.07-4.911-.07-6.14 0C3.182.29 2.126.563 1.253 1.433.379 2.303.11 3.358.05 4.55c-.07 1.229-.07 4.911 0 6.14.056 1.192.329 2.248 1.202 3.117.873.87 1.926 1.143 3.118 1.202 1.228.07 4.91.07 6.139 0zm-2.851-1.288H7.44c-1.083 0-3.41.085-4.386-.3-.651-.259-1.152-.76-1.415-1.414-.388-.98-.299-3.304-.299-4.386 0-1.083-.086-3.41.3-4.386.258-.651.76-1.153 1.414-1.415.98-.388 3.303-.299 4.386-.299 1.082 0 3.41-.086 4.386.3.65.258 1.152.76 1.414 1.414.389.98.3 3.303.3 4.386 0 1.082.089 3.41-.3 4.386-.259.65-.76 1.152-1.414 1.414-.918.364-3.018.308-4.17.3zm3.754-9.182c.491 0 .89-.395.89-.89 0-.49-.399-.89-.89-.89-.492 0-.89.4-.89.89 0 .492.395.89.89.89zM7.44 11.437c2.112 0 3.815-1.704 3.815-3.815 0-2.112-1.703-3.815-3.815-3.815S3.626 5.51 3.626 7.622c0 2.111 1.703 3.815 3.815 3.815zm0-1.335c-1.365 0-2.48-1.112-2.48-2.48 0-1.368 1.112-2.48 2.48-2.48 1.368 0 2.48 1.112 2.48 2.48 0 1.368-1.116 2.48-2.48 2.48z"/>
          </svg>
          <div class="instagram-text-block__follow__button__text">Follow Us</div>
        </button>
        </a>
      </div>
    </div>
  <transition name="fade">
    <div class="instagram-carousel" v-if="items.length">
      <b-carousel-list 
        v-model="instagramPos" 
        :data="items" 
        :items-to-show="itemsToShow"
       
        :arrows="true"
        :repeat="true" 
        :progress="false"
        :overlay="true"
        :has-drag="true"
        
        style="box-shadow:none"
        >
          <template slot="item" slot-scope="props">
            <div class="card" :style="cardStyle">
              <div class="card-image">
                <figure class="image" :style="cardContentStyle">
                  <img :style="imageStyle" :src="props.list.image">
                </figure>
              </div>
             
            </div>
        </template>
      </b-carousel-list>
    </div>
    </transition>
    <div class="testimonials-subheading">
      What our customers think
    </div>
    <div class="testimonials-carousel-container">
      <b-carousel class="testimonials-carousel"
        :arrow="false"
        :repeat="true"
        :indicator="false"
        :autoplay="true"
        :pause-info="false"
        :animated="'fade'"
        :interval="4000"
        >
        <b-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
          <section class="`hero is-medium`">
            <div class="has-text-centered testimonial-card">
              <div class="text">{{testimonial.text}}</div>
              <div class="author">-{{testimonial.author}}</div>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data() {
    return {
    
      cardStyle: {
        margin: '0.5rem',
        backgroundColor: 'transparent',
        boxShadow: 'none'
      },
      imageStyle: {
        width: '100%',
      },
      cardContentStyle: {

      },
      itemsToShow: 1,
      instagramPos: 0,
      arrow: true,
      arrowHover: true,
      drag: true,
      gray: false,
      opacity: false,
      values: 1,
      perList: 1,
      repeat: false,
      items: [
      ], 

      testimonials: [
        {
          text: "BEST PORTABLE BLENDER BAR NONE!",
          author: "T3.com"
        },
        {
          text: "I loved the original, but this new, improved BlendJet 2 is AMAZING! So powerful and blends so smoothly for my on-the-go lifestyle!",
          author: 'Astrid Swan'
        },
         {
          text: "Loving my new BlendJet 2! It’s super convenient, quiet, and easy to clean. I have a powerful full size blender and this little blender is just as strong with about a quarter of the noise.",
          author: 'Jenn C.S. Rubin'
        },
         {
          text: "As a proud owner of the original BlendJet, I couldn’t wait for the release of the BlendJet 2. More power, longer battery life, and better blends. Every home should have at least one BlendJet 2!",
          author: 'Kyle Zukowski'
        },
         {
          text: "With two little ones, increased workload, and trying to keep a healthy diet the BlendJet is an amazing solution for me. I love being able to throw in all the ingredients, blend, and go when needed!",
          author: 'Steven Spencer Elliott'
        },
         {
          text: "This thing is so amazing. Powerful and really fun to use. Highly recommend it!",
          author: 'Kenny Lauer'
        }
      ]
    }
  },
  methods: {
    async instagramPhotos () {
      const res = []
    
      try {
        const userInfoSource = await Axios.get('https://www.instagram.com/blendjet/')
        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        const userInfo = JSON.parse(jsonObject)
        // Retrieve only the first 10 results
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0, 10)
        // console.log('media array', mediaArray)
        for (let media of mediaArray) {
            const node = media.node
            
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }

            // Push the thumbnail src in the array
            res.push(node.thumbnail_src)
        }
      } catch (e) {
        console.error('Unable to retrieve photos. Reason: ' + e.toString())
      }
      return res
    },

    setWidthData() {
         if(window.innerWidth < 1024) {
          this.itemsToShow = 1
          this.indicatorVisible = true
          } else if(window.innerWidth >= 1024 && window.innerWidth < 1400) {
            this.itemsToShow = 3
            this.indicatorVisible = true
          } else {
            this.itemsToShow = 4
            this.indicatorVisible = false
          }
      },
  },
  mounted() {
    this.instagramPhotos()
      .then((res) => {
        this.items = res.map((item, i) => {
          return {
            title: i,
            image: item
          }
        })
      })

    this.setWidthData()
    const vm = this
    window.addEventListener('resize', function() {
      if(window.innerWidth < 1024) {
        vm.itemsToShow = 1
        vm.indicatorVisible = true
        } else if(window.innerWidth >= 1024 && window.innerWidth < 1400) {
          vm.itemsToShow = 3
          vm.indicatorVisible = true
        } else {
          vm.itemsToShow = 4
          vm.indicatorVisible = false
        }
      })
  }, 

  beforeDestroy() {
    window.removeEventListener('resize', this.setWidthData)
  }

  
  
}
</script>

<style scoped lang="scss">

.instagram-text-block {
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  color: $primary-purple;
  text-align: center;
  margin-bottom: 65px;

  &__title {
    font-size: 54px;
    font-family: BoldItalic;
    line-height: 1;
    letter-spacing: 1px;
    text-align: center;
    margin-top: 60px;
    margin-bottom: 10px;
  }

  &__on-instagram {
    text-transform: uppercase;
    font-family: Bold;
    letter-spacing: 1.75px;
    font-size: 12px;
    line-height: 1.17;
  }

  &__content {
    margin-top: 20px;
    margin-bottom: 35px;
    size: 14px;
    letter-spacing: 0.5px;
  }

  &__hastag {
    font-family: Bold;
  }

  &__follow {
    display: flex;
    justify-content: center;

    &__button {
      @include button-primary('purple-ghost');
      width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      &__text {
        margin-left: 1rem;
      }
    }
  }
}
.testimonials-subheading {
  text-align: center;
  font-family: Bold;
  font-size: $text-small;
  color: $primary-purple;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 40px;

}
.testimonials-carousel-container {
  display: flex;
  justify-content: center;
  min-height: 260px;
}

.testimonials-carousel {
  width: 55vw;
  @media screen and (max-width: 768px) {
    width: auto;
  }
}

.testimonial-card {
  color: $primary-purple;
  font-family: BoldItalic;
  font-size: 29px;
  line-height: 1.14;
  letter-spacing: 1px;
  padding: 2rem;
}

.text {
  color: $primary-purple;
  text-align: center;
}

.author {
  font-family: Bold;
  font-size: $text-small;
  line-height: 1.17;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  margin-top: 50px;
}

.quote {
  margin: 36px;
}

</style>