<template>
    <div id="container" style="min-width: 400px; min-height: 600px;">
    

        <div class="app">
            <div class="ec" id="ec"></div>
        </div>
    </div>
</template>

<script>
  var line_Path = 'path://M70.4 787.2l416-457.6c12.8-16 38.4-16 51.2 0l416 457.6c6.4 9.6 19.2 12.8 28.8 12.8 35.2 0 51.2-41.6 28.8-67.2l-448-492.8c-28.8-32-76.8-32-102.4 0L12.8 732.8c-22.4 25.6-3.2 67.2 28.8 67.2 12.8 0 22.4-3.2 28.8-12.8z';

var icon_path = 'path://M960 42.666667H64c-12.8 0-21.333333 8.533333-21.333333 21.333333v896c0 12.8 8.533333 21.333333 21.333333 21.333333h896c12.8 0 21.333333-8.533333 21.333333-21.333333V64c0-12.8-8.533333-21.333333-21.333333-21.333333z m-21.333333 896H85.333333V682.666667h853.333334v256z m0-298.666667H85.333333V384h853.333334v256z m0-298.666667H85.333333V85.333333h853.333334v256zM298.666667 768h-42.666667v85.333333h42.666667v-85.333333z m-85.333334 0H170.666667v85.333333h42.666666v-85.333333z m661.333334 21.333333h-170.666667v42.666667h170.666667v-42.666667zM298.666667 469.333333h-42.666667v85.333334h42.666667v-85.333334z m-85.333334 0H170.666667v85.333334h42.666666v-85.333334z m661.333334 21.333334h-170.666667v42.666666h170.666667v-42.666666zM298.666667 170.666667h-42.666667v85.333333h42.666667V170.666667z m-85.333334 0H170.666667v85.333333h42.666666V170.666667z m661.333334 21.333333h-170.666667v42.666667h170.666667V192z';

var demo_p_data = [{
  name: 'asd',
  value: [116.114129, 39.550339]
}, {
  name: 'ccc',
  value: [-80.943139, 35.214]
}, {
  name: 'ccc',
  value: [0, 0]
}, {
  name: 'ccc',
  value: [180, 0]
}, {
  name: 'ccc',
  value: [-180, 0]
}, {
  name: 'ccc',
  value: [0, 80]
}, {
  name: 'ccc',
  value: [0, -50]
}, ];
var option = {
geo: {
  map: 'world',
  // 不显示
  show: false,
  // 当前缩放比
  zoom: 1.3,
  roam: false,

  label: {
    emphasis: {
      show: false
    }
  },

  itemStyle: {
    normal: {
      areaColor: '#323c48',
      borderColor: '#404a59'
    },
    emphasis: {
      areaColor: '#2a333d'
    }
  }
},
series: [
  // 所有线的数据
  {
    // name: item[0] + ' Top10',
    type: 'lines',
    zlevel: 1,
    symbol: ['none', 'arrow'],
    symbolSize: 10,

    effect: {
      show: true,
      period: 2,
      trailLength: 0.2,
      color: 'yellow',
      symbol: line_Path,
      symbolSize: 10
    },

    lineStyle: {
      normal: {
        color: "rgba(255,255,255,0.2)",
        width: 1,
        opacity: 0.1,
        curveness: 0.1
      }
    },
    data: [
      // 
      {
        "coords": [
          [-80.943139, 35.214],
          [116.114129, 39.550339],
        ]
      },
      // 
      {
        "coords": [
          [116.114129, 39.550339],
          [0, 0]
        ]
      },

      // 
      {
        "coords": [
          [0, 0],
          [180, 0],
        ]
      },
      // 
      {
        "coords": [
          [180, 0],
          [-180, 0],
        ]
      },
      // 
      {
        "coords": [
          [-180, 0],
          [0, 80],
        ]
      },
      // 
      {
        "coords": [
          [0, 80],
          [0, -50],
        ]
      },
      // 
      {
        "coords": [

          [0, -50],
          [-80.943139, 35.214],
        ]
      },
    ]
  },
  // 点
  {
    // name: item[0] + ' Top10',

    type: 'effectScatter',
    // type: 'scatter',
    coordinateSystem: 'geo',
    // zlevel: 2,
    // 涟漪效果
    rippleEffect: {
      scale: 3,
      brushType: 'stroke'
    },

    // 文字标识
    label: {
      normal: {
        show: true,
        position: "bottom",
        formatter: function (params) {

          console.log(params);
          return 'aa';
        },
      }
    },

    // 图标
    symbol: icon_path,
    symbolSize: function(val) {
      return 25;
    },

    itemStyle: {
      normal: {
        color: "yellow"
      }
    },

    // 数据
    data: demo_p_data
  },
]
};
me.all_obj.ec.setOption(option);

</script>

<style scoped="scoped" lang="scss">
.app {
  width: 100%;
  height: 100%;
//   background: url('./img/sign_bg.jpg') center no-repeat;
  background-size: cover;
  >.ec {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
  }
}
</style>
