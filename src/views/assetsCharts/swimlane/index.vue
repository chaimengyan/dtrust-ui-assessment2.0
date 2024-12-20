<template>
    <div id="container" style="width: 100%;height: 100%; min-width: 400px; min-height: 600px;"></div>
</template>

<script>
  import { createApp } from 'vue'
  import { Graph,  ToolsView, } from '@antv/x6'
  import {getSwimLaneDiagramsById} from '@/api/assets/crossBorderData'
  import { Tooltip } from 'element-ui'


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
        labels: [
          {
            attrs: { 
              label:{
                text: '收集'
              }
            },
          },
          {
            attrs: { label: { text: '收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集收集' } },
          },
        ],
    },
    {
        "id": "15",
        "shape": "lane-edge",
        "source": "6",
        "target": "7",
        labels: [
          {
            attrs: { 
              label:{
                text: '存储'
              }
            },
          },
          {
            attrs: { label: { text: '存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储' } },
          },
        ],
    },
    {
        "id": "16",
        "shape": "lane-edge",
        "source": "7",
        "target": "8",
        labels: [
          {
            attrs: { 
              label:{
                text: '传输'
              }
            },
          },
          {
            attrs: { label: { text: '传输传输传输传输传输传输传输传输传输传输传输传输传输' } },
          },
        ],
    },
    {
        "id": "17",
        "shape": "lane-edge",
        "source": "7",
        "target": "9",
        labels: [
          {
            attrs: { 
              label:{
                text: '使用'
              }
            },
          },
          {
            attrs: { label: { text: '使用使用使用使用使用使用使用使用使用使用使用使用使用使用' } },
          },
        ],
    },
    {
        "id": "18",
        "shape": "lane-edge",
        "source": "8",
        "target": "9",
        labels: [
          {
            attrs: { 
              label:{
                text: '存档'
              }
            },
          },
          {
            attrs: { label: { text: '存档存档存档存档存档存档存档存档存档存档存档存档存档存档存档' } },
          },
        ],
    },
    {
        "id": "19",
        "shape": "lane-edge",
        "source": "9",
        "target": "10",
        labels: [
          {
            attrs: { 
              label:{
                text: '使用'
              }
            },
          },
          {
            attrs: { label: { text: '使用使用使用使用使用使用使用使用使用使用使用使用使用使用' } },
          },
        ],
    },
    {
        "id": "20",
        "shape": "lane-edge",
        "source": "10",
        "target": "11",
        labels: [
          {
            attrs: { 
              label:{
                text: '传输'
              }
            },
          },
          {
            attrs: { label: { text: '传输传输传输传输传输传输传输传输传输传输传输传输传输传输传输' } },
          },
        ],
    },
    {
        "id": "21",
        "shape": "lane-edge",
        "source": "11",
        "target": "12",
        labels: [
          {
            attrs: { 
              label:{
                text: '使用'
              }
            },
          },
          {
            attrs: { label: { text: '使用使用使用使用使用使用使用使用使用使用使用使用使用使用' } },
          },
        ],
    },
    {
        "id": "22",
        "shape": "lane-edge",
        "source": "11",
        "target": "13",
        labels: [
          {
            attrs: { 
              label:{
                text: '存储'
              }
            },
          },
          {
            attrs: { label: { text: '存储存储存储存储存储存储存储存储存储存储存储存储存储存储存储' } },
          },
        ],
    },
    {
        "id": "23",
        "shape": "lane-edge",
        "source": "12",
        "target": "13",
        labels: [
          {
            attrs: { 
              label:{
                text: '删除'
              }
            },
          },
          {
            attrs: { label: { text: '23232323232323233333333333333333333333333333333333333333333333333333333333333333333333333333333' } },
          },
        ],

    }
]





  export default {
    name: 'Swimlane',
    components: {
     
    },
    data() {
        return {
          knob: null,
          knobChild: null,
          graph: null,
          swimlaneData: [],
          container: null,
          tooltipContent: '21231231',
          CBData: {}
        }
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
      
      swimlaneInit(row, CBData) {
        this.CBData = CBData
        this.getSwimLaneDiagrams(row.id)
        // this.swimlaneData = data
        this.initGraph()

      },
      getSwimLaneDiagrams(id) {
        getSwimLaneDiagramsById(id).then(res => {
          this.swimlaneData = res.data.data
          this.initGraph()
        })
      },
      updatePosition(e) {
        const style = this.knob.style
        if (e) {
          const p = this.graph.clientToGraph(e.clientX, e.clientY)
          style.display = 'block'
          style.left = `${p.x}px`
          style.top = `${p.y}px`
          style.zIndex = 1000
        } else {
          style.display = 'none'
          style.left = '-1000px'
          style.top = '-1000px'
        }
      },
      toggleTooltip(visible) {
        const that = this;
        if (this.knobChild) {
          // this.knob.innerHTML = ''
          this.knobChild.$destroy && this.knobChild.$destroy()
        }
          if (visible) {
            // 创建一个 Vue 构造函数并指定渲染的组件
            // const MyComponentConstructor = Vue.extend(Tooltip);

            // // 创建一个新的 Vue 实例
            // const instance = new MyComponentConstructor({  propsData: {
            //   visible: true,
            //   content: '3333',
            //   effect: 'dark',
            //   placement: 'top'
            // },
            // // 通过插槽传递默认内容
            // scopedSlots: {
            //   default: () => {
            //     return <div class="tooltip-text">占位</div>;
            //   }
            // }});

            // // 将组件挂载到指定的 DOM 节点
            // instance.$mount(this.knobChild);


            new Vue({
              el: this.knobChild,
              render() {
                if(that.tooltipContent.includes("<br/>")) {
                  return (
                    // 假如遇到effect不生效，就用style去调样式
                    <Tooltip visible={true} effect='dark' placement="top">
                      {/* <div slot="content" domPropsInnerHtml={that.tooltipContent}></div> */}
                      <div slot="content" >
                        <div>{that.tooltipContent.split('<br/>')[1]}</div>
                        <br/>
                        <div>{that.tooltipContent.split('<br/>')[0]}</div>
                      </div>
                      <div class="tooltip-text">
                        占位
                      </div>
                    </Tooltip>
                  )
                } else {
                  return (
                  // 假如遇到effect不生效，就用style去调样式
                    <Tooltip visible={true} effect='dark' placement="top">
                      {/* <div slot="content" domPropsInnerHtml={that.tooltipContent}></div> */}
                      <div slot="content" >
                        <div>{that.tooltipContent}</div>
                      </div>
                      <div class="tooltip-text">
                        占位
                      </div>
                    </Tooltip>
                  )
                }
               
              }
            })
          console.log(this.knobChild, 'this.knobChild')
          }
      },
      createToolContainer() {
        if (!this.knob) {
          this.knob = ToolsView.createElement('div', false)
          this.knobChild = document.createElement('div')
          this.knob.style.position = 'absolute'
          this.knob.appendChild(this.knobChild)
          this.container.appendChild(this.knob)
        }
      },
        initGraph() {
          this.container = document.getElementById('container');
            const graph =  new Graph({
                container: this.container,
                connecting: {
                    router: 'orth',
                    connector: 'rounded',
                },
                translating: {
                    restrict(cellView) {
                    const cell = cellView.cell
                    const parentId = cell.prop('parent')
                    if (parentId) {
                        const parentNode = graph.getCellById(parentId)
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
            
            this.graph = graph
            const cells = []
            let edg = {}
            this.swimlaneData.forEach((item) => {
              if (item.shape === 'lane-edge') {
                console.log(item,'itemmmmm');
                item.connector = {
                  name: 'jumpover',
                  args: {
                    type: 'gap',
                  },
                }
            
                item.router =  {
                  name: 'manhattan',
                  args: {
                    startDirections: ['right'],
                    endDirections: ['left'],
                  },
                }
                edg[item.id] = `处理活动描述：${item.describe}；<br/>字段类别：${item.attributeCategories.join(',')}`
                cells.push(this.graph.createEdge(item))
              } else {
                if(item.shape === 'lane-rect') {
                  item.shape = 'text-block'
                  item.text = item.label
                  item.attrs = {
                    body: {
                      fill: 'aliceblue',
                      stroke: '#1793ff',
                      rx: 4,
                      ry: 4,
                    },
                  }
                }
                cells.push(this.graph.createNode(item))
              }
            })
            this.graph.resetCells(cells)
            this.graph.zoomToFit({ padding: 10, maxScale: 1 })

            this.graph.on('node:click', ({ e, node, view }) => {
              const a = this.findValueInArray(this.CBData.transferRelevanceList, node.store.data.projectId)
              if(!a) return
              this.tooltipContent = a.hostingLocation || '暂无'
              console.log(e, node, view,'节点');
              if (this.tooltipContent) {
                this.createToolContainer()
                this.updatePosition(e);
                this.toggleTooltip(true);
              }
             })

            this.graph.on('edge:click', ({ e, edge, view }) => {
              this.tooltipContent = edg[edge.store.data.id] || '暂无'
              if (this.tooltipContent) {
                this.createToolContainer()
                this.updatePosition(e);
                this.toggleTooltip(true);
              }
            })
           
        },
        
        findValueInArray(arr, projectId) {
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].projectId === projectId) {
              return arr[i].projectInfo
            }else {
              return this.findValueInArray(arr[i].transferRelevanceList, projectId)
            }
        }
      }
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
