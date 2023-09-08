<template>
  <div class="check-tag-container">
    <div
      class="check-tag"
      v-for="item in data"
      :key="item[defaultProp.value]"
      :class="{ active: isSelect(item[defaultProp.value]) }"
      @click="handleSelect(item)"
    >
      <span>{{ item[defaultProp.label] }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CheckTag',
    model: {
      prop: 'checkedDataClass',
      event: 'change'
    },
    props: {
      defaultProp: {
        type: Object,
        default: () => ({
          label: 'label',
          value: 'value'
        })
      },
      isMultiple: {
        type: Boolean,
        default: true
      },
      checkedDataClass: {
        type: [Array, String],
        default: () => []
      },
      data: {
        type: Array,
        default: () => [
          { label: '香蕉', value: 1 },
          { label: '牛奶', value: 2 },
        ],
      },
    },
    methods: {
      handleSelect(item) {
        if (this.isMultiple) return this.handleMultipleSelect(item)
        this.handleSingleSelect(item)
      },

      handleSingleSelect(item) {
        const active = !this.isSelect(item[this.defaultProp.value]) ? item[this.defaultProp.value] : ''
        this.onChange(active)
      },

      handleMultipleSelect(item) {
        const arr = [...this.checkedDataClass]
        if (this.isSelect(item[this.defaultProp.value])) {
          const index = this.checkedDataClass.findIndex(v => v === item[this.defaultProp.value])
          arr.splice(index, 1)
        }else {
          arr.push(item[this.defaultProp.value])
        }
        this.onChange(arr)
      },

      isSelect(value) {
        return this.isMultiple ? this.checkedDataClass.includes(value) : this.checkedDataClass === value
      },

      onChange(value) {
        this.$emit('change', value)
      }
    }
  }
</script>

<style lang="scss" scoped>
.check-tag-container {
  display: flex;
  
  user-select: none;
  padding: 5px;
  margin: 5px;
  border-radius: 6px;
  background-color: #dadde2;
  
  .check-tag {
    padding: 5px 10px;
    &:not(:last-child) {
      margin-right: 5px;
    }
    &.active {
      background-color: #fff;
      border-radius: 6px;
    }
  }
}
</style>
