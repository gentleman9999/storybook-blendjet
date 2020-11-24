<template>
  <div class="svg-container">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70" height="70" viewBox="0 0 70 70">
      <defs>
          <path id="v3u9cewgta" d="M23 15L45 15 45 51 23 51z"/>
      </defs>
      <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
          <circle cx="34" cy="34" r="34" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="34" cy="34" r="30" fill="#FFF"/>
          <mask id="tp3i71p06b" fill="#fff">
              <use xlink:href="#v3u9cewgta"/>
          </mask>
          <path :fill="location ==='homepage' ? '#2B77AF' : '#32499D'" d="M34 51c-6.075 0-11-4.958-11-11.074C23 30.71 34 15 34 15s11 15.709 11 24.926C45 46.042 40.075 51 34 51" mask="url(#tp3i71p06b)"/>
      </g>
    </svg>
  </div>
</template>
<script>export default {}</script>
