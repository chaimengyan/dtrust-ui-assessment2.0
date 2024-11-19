<template>
    <div id="container" style="min-width: 400px; min-height: 600px;"></div>
</template>

<script>
  import { Graph, Cell, CellView, Node } from '@antv/x6'
  import {getSwimLaneDiagramsById} from '@/api/assets/crossBorderData'

Graph.registerNode(
  'lane',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'rect',
        selector: 'name-rect',
      },
      {
        tagName: 'text',
        selector: 'name-text',
      },
    ],
    attrs: {
      body: {
        fill: '#FFF',
        stroke: '#5F95FF',
        strokeWidth: 1,
      },
      'name-rect': {
        width: 200,
        height: 30,
        fill: '#5F95FF',
        stroke: '#fff',
        strokeWidth: 1,
        x: -1,
      },
      'name-text': {
        ref: 'name-rect',
        refY: 0.5,
        refX: 0.5,
        textAnchor: 'middle',
        fontWeight: 'bold',
        fill: '#fff',
        fontSize: 12,
      },
    },
  },
  true,
)

Graph.registerNode(
  'lane-rect',
  {
    inherit: 'rect',
    width: 100,
    height: 60,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerNode(
  'lane-polygon',
  {
    inherit: 'polygon',
    width: 80,
    height: 80,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        refPoints: '0,10 10,0 20,10 10,20',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerEdge(
  'lane-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    label: {
      attrs: {
        label: {
          fill: '#A2B1C3',
          fontSize: 12,
        },
      },
    },
  },
  true,
)

const data = [
    {
        "id": "1",
        "shape": "lane",
        "width": 200,
        "height": 500,
        "position": {
            "x": 60,
            "y": 60
        },
        "label": "内部资产"
    },
    {
        "id": "2",
        "shape": "lane",
        "width": 200,
        "height": 500,
        "position": {
            "x": 260,
            "y": 60
        },
        "label": "境外内部资产"
    },
    {
        "id": "3",
        "shape": "lane",
        "width": 200,
        "height": 500,
        "position": {
            "x": 460,
            "y": 60
        },
        "label": "第三方资产"
    },
    {
        "id": "4",
        "shape": "lane",
        "width": 200,
        "height": 500,
        "position": {
            "x": 660,
            "y": 60
        },
        "label": "境外第三方资产"
    },
    {
        "id": "5",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 110,
            "y": 120
        },
        "label": "资产1-x:110,y:120",
        "attrs": {
            "body": {
                "rx": 30,
                "ry": 30
            }
        },
        "parent": "1"
    },
    {
        "id": "6",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 320,
            "y": 120
        },
        "label": "资产2-x:320,y:120",
        "parent": "2"
    },
    {
        "id": "7",
        "shape": "lane-polygon",
        "width": 80,
        "height": 80,
        "position": {
            "x": 520,
            "y": 110
        },
        "label": "资产3-x:520,y:110",
        "parent": "3"
    }, {
        "id": "8",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 510,
            "y": 240
        },
        "label": "资产4-x:510,y:240",
        "parent": "3"
    },{
        "id": "9",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 720,
            "y": 240
        },
        "label": "资产5-x:720,y:240",
        "parent": "4"
    }, {
        "id": "10",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 720,
            "y": 350
        },
        "label": "资产6-x:720,y:350",
        "parent": "4"
    },{
        "id": "11",
        "shape": "lane-polygon",
        "width": 80,
        "height": 80,
        "position": {
            "x": 520,
            "y": 340
        },
        "label": "资产7-x:520,y:340",
        "parent": "3"
    },
    {
        "id": "12",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 510,
            "y": 470
        },
        "label": "资产8-x:510,y:470",
        "parent": "3"
    },
    {
        "id": "13",
        "shape": "lane-rect",
        "width": 100,
        "height": 60,
        "position": {
            "x": 300,
            "y": 470
        },
        "label": "资产9-x:300,y:470",
        "attrs": {
            "body": {
                "rx": 30,
                "ry": 30
            }
        },
        "parent": "2"
    },
    {
        "id": "14",
        "shape": "lane-edge",
        "source": "5",
        "target": "6",
        "label": "收集"
    },
    {
        "id": "15",
        "shape": "lane-edge",
        "source": "6",
        "target": "7",
        "label": "存储"
    },
    {
        "id": "16",
        "shape": "lane-edge",
        "source": "7",
        "target": "8",
        "label": "传输"
    },
    {
        "id": "17",
        "shape": "lane-edge",
        "source": "7",
        "target": "9",
        "label": "使用"
    },
    {
        "id": "18",
        "shape": "lane-edge",
        "source": "8",
        "target": "9",
        "label": "存档"

    },
    {
        "id": "19",
        "shape": "lane-edge",
        "source": "9",
        "target": "10",
        "label": "使用"

    },
    {
        "id": "20",
        "shape": "lane-edge",
        "source": "10",
        "target": "11",
        "label": "传输"

    },
    {
        "id": "21",
        "shape": "lane-edge",
        "source": "11",
        "target": "12",
        "label": "使用"
    },
    {
        "id": "22",
        "shape": "lane-edge",
        "source": "11",
        "target": "13",
        "label": "存储"
    },
    {
        "id": "23",
        "shape": "lane-edge",
        "source": "12",
        "target": "13",
        "label": "删除"

    }
]




  export default {
    name: 'Swimlane',
    components: {
     
    },
    data() {
        return {
            graph: null,
            swimlaneData: [],
        }
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
      swimlaneInit(row) {
        console.log(row, 'rowwwwww');
        this.getSwimLaneDiagrams(row.id)
      },
      getSwimLaneDiagrams(id) {
        getSwimLaneDiagramsById(id).then(res => {
          this.swimlaneData = res.data.data
          this.initGraph()
        })
      },
        initGraph() {
            this.graph =  new Graph({
                container: document.getElementById('container'),
                connecting: {
                    router: 'orth',
                },
                translating: {
                    restrict(cellView) {
                    const cell = cellView.cell
                    const parentId = cell.prop('parent')
                    if (parentId) {
                        const parentNode = this.graph.getCellById(parentId)
                        if (parentNode) {
                        return parentNode.getBBox().moveAndExpand({
                            x: 0,
                            y: 30,
                            width: 0,
                            height: -30,
                        })
                        }
                    }
                    return cell.getBBox()
                    },
                },
            })

            const cells = []
            this.swimlaneData.forEach((item) => {
            if (item.shape === 'lane-edge') {
                cells.push(this.graph.createEdge(item))
            } else {
                cells.push(this.graph.createNode(item))
            }
            })
            this.graph.resetCells(cells)
            this.graph.zoomToFit({ padding: 10, maxScale: 1 })
        },
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
