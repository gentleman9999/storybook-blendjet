<template>
  <div >
    <!-- <div v-if="error" class="error">
      <h1>{{error.statusCode}}</h1>
      <p>{{error.message}}</p>
    </div> -->
    <div class="error-container">
      <a class="desktop-404" href="https://blendjet.com/"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/files/blendjet_errorpagev5.gif?v=1593587339"></a>
      <a class="mobile-404" href="https://blendjet.com/"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/files/blendjet_errorpage_0c26c580-3fa9-4985-b97a-3adbadfee030.gif?v=1593592854"></a>
    </div>
  <div class="module module-404">    
    <div class="module-body">
      <div class="module-content">
        <p>Were you looking for <a href="https://blendjet.com/products/blendjet-2"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/files/award.png?v=1593589428"> BlendJet 2?</a><br/>
          Or did you want to try our <a href="https://blendjet.com/collections/jetpack-ready-to-blend-smoothies">JetPacks?</a></p>
        
        <p>You can start back at the  <a href="https://blendjet.com/"><img src="/images/home_icon.jpg" />  beginning</a> (sometimes that's the best place to start).<br/>
          And we're  <a href="mailto:support@blendjet.com"><img src="/images/envelope_icon.jpg" />  here for you</a> if you have any questions.
          </p>

        <p>If you already have a BlendJet 2, we have some great <a href="https://blendjet.com/user-guide/blendjet-2"><img src="/images/light_icon.jpg" />tips</a> for you!</p>

        <!-- <p>If you already have a BlendJet One, we have some great <a href="https://blendjet.com/pages/tutorials"><img src="https://cdn.shopify.com/s/files/1/0066/4433/4658/files/bulb.png?v=1593589422" style="width: 11px;"> tips</a> for you!</p> -->
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
    props: ['error'],
    layout: 'error'
}
</script>


<style lang="scss" scoped>
h1 {
  font-weight: 500;
  text-align: center;
  font-size: 72pt;
}
p {
  text-align: center;
}
.error {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-container {
  display: flex;

  justify-content: center;
}

.module-content p{
  margin-bottom: 30px;
}

.desktop-404 {
  @include respond-to('small') {
    display: none
  }
}

.mobile-404 {
  @media screen and (min-width: 768px) {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .module-content{
    padding: 0 54px 40px 54px;
  }  
}

</style>
