<template>
    <div class="outerContainer">
        <!-- <MyChartsTemplate /> -->
        <!-- <FreeEcharts /> -->
        <Swimlane />
    </div>
</template>

<script>

//  import MyChartsTemplate from "@/views/assetsCharts/assetbusin/myChartsTemplate"
//  import FreeEcharts from "@/views/assetsCharts/assetbusin/freeEcharts"
 import Swimlane from "@/views/assetsCharts/swimlane/index"
  export default {
    name: 'Assetbusin',
    components: {
        // MyChartsTemplate,
        // FreeEcharts,
        Swimlane
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
