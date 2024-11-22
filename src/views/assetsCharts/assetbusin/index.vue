<template>
    <div class="outerContainer">
        <!-- <MyChartsTemplate /> -->
        <FreeEcharts />
        <!-- <Modee /> -->
    </div>
</template>

<script>

//  import MyChartsTemplate from "@/views/assetsCharts/assetbusin/myChartsTemplate"
 import FreeEcharts from "@/views/assetsCharts/assetbusin/freeEcharts"
//  import Modee from "@/views/assetsCharts/swimlane/modee"
  export default {
    name: 'Assetbusin',
    components: {
        // MyChartsTemplate,
        FreeEcharts,
        // Modee
    },
    data() {
        return {
           
        }
    },
    computed: {
        
    },
    created() {
    },
    methods: {
       
    }
  }
</script>

<style scoped="scoped" lang="scss">
    .outerContainer {
        width: 100%;
        height: 100%;
        justify-content: space-around;
        background-color: aliceblue;
        text-align: center;
       
    }
</style>
