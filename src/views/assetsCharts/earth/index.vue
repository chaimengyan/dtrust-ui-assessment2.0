<template>
<div class="page">
  <iframe 
    src="/earth.html"
    scrolling="no"
    frameborder="0"
    :style="{width:'100%',height:GetWindowHeight}"
    ></iframe>
</div>

</template>


<script>
export default {
  name: 'index',
  data() {
    return {
     GetWindowHeight:'0',
     earthSrc: '',
    }
  },
  computed: {
   
  },
  created() {
      this.GetWindowHeight = window.innerHeight + 'px';
      this.earthSrc = `${window.location.protocol}//${window.location.hostname}:38084/`
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
