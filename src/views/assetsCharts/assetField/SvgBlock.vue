<template>
    <svg 
        class="svg-icon" version="1.1"
        :style="{left: getLeft, top: top + height, height: getSvgHeight, width: getSvgWidth}"
        xmlns="http://www.w3.org/2000/svg"
    >

        <polygon 
            :points="point"
            :style="`fill:${this.background}; opacity: .5;`"
        >
            <animate
                :id="this.dur + 1"
                attributeType="XML"
                attributeName="points"
                dur="0.4s"
                :begin="this.dur ? '0s' : `${this.dur}.end`"
                repeatCount="1"
                :from="
                `
                    ${getPoint[0]},
                    ${getPoint[1]},
                    ${getPoint[1].split(',')[0]},0
                    ${getPoint[0].split(',')[0]},0
                `
                "
                :to="point" fill="freeze"
            />
        </polygon>
    </svg>
</template>

<script>
export default {
    name: 'svg-block',
    props: {
        background: {
            type: String,
            default: ''
        },
        left: {
            type: Number,
            default: 0
        },
        top: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
        dur: {
            type: Number,
            default: 0
        },
        nextIconProps: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        getPoint() {
            const {left, top, width} = this.nextIconProps
            // 当有左移时 最后一个x坐标为0
            const lastX = this.svgLeft ? 0 : left - this.left
            const threeX = this.svgLeft ? width : left - this.left + width

            const height = top - this.top - this.height
            return ([
                `${this.svgLeft},${0}`,
                `${this.width + this.svgLeft},${0}`,
                `${threeX},${height}`,
                `${lastX},${height}`,
            ])
        },
        getLeft() {
            // 如果props.left > next.left 说明svg在定位时需要左移
            const {left, nextIconProps} = this
            this.svgLeft = 0
            if (left > nextIconProps.left) {
                // 需要移动的距离 (需要在求坐标时加上这个值)
                const _left = left - nextIconProps.left
                this.svgLeft = _left
                return left - _left
            }
            return left
        },
        getSvgHeight() {
            return this.nextIconProps.top - this.top - this.height
        },
        getSvgWidth() {
            const {left, width, nextIconProps} = this

            const w = width + left
            const nextW = nextIconProps.width + nextIconProps.left
            
            if (nextIconProps.left >= left) {
                // 计算下一个是否在上一个的中间
                if (w >= nextW) {
                    return width
                }
               
                return nextIconProps.left - left + nextIconProps.width
            }

            // 下一个在上一个的左边
            if (nextIconProps.left < left) {
                if (nextW >= w) {
                    return nextIconProps.width
                }
                return left - nextIconProps.left + width
            }
        },
        // 最终坐标
        point() {
            return this.getPoint.join(' ')
        }
    },
    data() {
        return {
            svgLeft: 0
        }
    }
}
</script>


<style scoped>
.svg-icon {
    position: absolute;
    pointer-events: none;
}
</style>