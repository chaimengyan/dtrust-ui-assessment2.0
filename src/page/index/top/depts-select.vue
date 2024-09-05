<template>
    <div id="menu-select">
        <component v-for="item in depts" :key="item.id" :is="componentName(item.children)" :index="`${item.id}`">
            <template slot="title">
                <div class="menu-item" @click="selectDepts(item)" v-if="componentName(item.children) == 'el-menu-item'" style="font-size: 12px; min-width: 200px">
                    {{item.name}}
                </div>
                <div class="menu-item" @click="selectDepts(item)" v-else-if="!('parentId' in item)" style="font-size: 14px; min-width: 200px">
                    {{item.name}}
                </div>
                <template v-else>
                    <div class="menu-item" @click="selectDepts(item)">
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
<style lang="scss">
#menu-select {
    margin: -5px 0;
    background-color: #fff !important;
    .el-sub-menu, .el-submenu__title, .el-menu-item {
        background-color: #fff;
        // width: 170px;
        color: #303133;
        height: 48px;
        line-height: 48px;
        &:hover {
            background-color: #409EFF !important;
            color: #fff !important;
        }

    }
    


    .menu-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
    }
}
</style>  