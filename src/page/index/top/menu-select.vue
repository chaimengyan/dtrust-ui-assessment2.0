<template>
    <div id="sys-menu-select">
        <component v-for="item in menus" :key="item.id" :is="componentName(item.children)" :index="`${item.id}`">
            <template slot="title">
                <el-link
                    v-if="componentName(item.children) == 'el-menu-item'"
                    target="_blank"
                    :underline="false"
                    :href="getPath(item)">
                    <div style="font-size: 12px; min-width: 200px">
                        {{$t(`menu.${item.label}`)}}
                    </div>
                </el-link>
                <el-link
                    v-else-if="!('parentId' in item)"
                    target="_blank"
                    :underline="false"
                    :href="item.moduleHost">
                    <div style="font-size: 14px; min-width: 200px">
                        {{$t(`menu.${item.label}`)}}
                    </div>
                </el-link>
                <template v-else>
                    {{$t(`menu.${item.label}`)}}
                </template>
            </template>
            
            <menu-select v-if="item.children && item.children.length" :menus="item.children" />
        </component>
    </div>
</template>

<script>
export default {
    name: 'menu-select',

    props: {
        menus: {
            type: Array,
            default: () => []
        },
    },

    methods: {
        getPath(item) {
            return `${item.moduleHost}/#${item.path}`
        },
        componentName(children) {
            return children && children.length ? 'el-submenu' : 'el-menu-item'
        }
    }
}
</script>
<style lang="scss">
#sys-menu-select {
    margin: -5px 0;
    background-color: #fff !important;
    .el-submenu__title {
        background-color: #fff;
        font-size: 12px !important;
        font-weight: 500;
        color: #303133;
        height: 48px;
        line-height: 48px;
        .el-link .el-link--inner {
            > div {
                font-size: 12px !important
            }
        }

        &:hover {
            .el-link, .el-link--inner {
                color: #fff !important;
                > div {
                    font-size: 12px !important
                }
            }
            color: #fff !important;
            background-color: #409EFF !important;
        }

    }

    .el-menu-item {
        background-color: #fff;
        font-weight: 500;
        height: 48px;
        line-height: 48px;
        &:hover {
            color: #fff !important;
            background-color: #409EFF !important;
        }
    }
}
</style>