// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
// 数据合规图标（包含常用菜单图标，通用图标），快捷应用，表格操作栏按钮
const iconfontVersion = ['3618041_z67bzn8bsnp', '3700797_zj27x56k01g', '3762524_a4wubponto9']
const iconfontUrl = `//at.alicdn.com/t/c/font_$key.css`
const codeUrl = `${window.location.origin}/code`
export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
