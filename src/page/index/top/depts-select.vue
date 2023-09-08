<template>
    <div>
        <component v-for="item in depts" :key="item.id" :is="componentName(item.children)" :index="`${item.id}`">
            <template slot="title">
                <div @click="selectDepts(item)" v-if="componentName(item.children) == 'el-menu-item'" style="font-size: 12px; min-width: 200px">
                    {{item.name}}
                </div>
                <div @click="selectDepts(item)" v-else-if="!('parentId' in item)" style="font-size: 14px; min-width: 200px">
                    {{item.name}}
                </div>
                <template v-else>
                    <div @click="selectDepts(item)">
                        {{item.name}}
                    </div>
                </template>
            </template>
            <depts-select v-if="item.children && item.children.length" @selectDepts="selectDepts" :depts="item.children" />
        </component>
    </div>
</template>

<script>
export default {
    name: 'depts-select',

    props: {
        depts: {
            type: Array,
            default: () => []
        },
    },
mounted() {
},
    methods: {
        selectDepts(item) { 
            this.$emit('selectDepts', item)
        },
        componentName(children) {
            return children && children.length ? 'el-submenu' : 'el-menu-item'
        }
    }
}
</script>
