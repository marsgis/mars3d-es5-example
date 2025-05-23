// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let firstPersonRoam

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.929546, lng: 116.172289, alt: 559, heading: 168, pitch: -11 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  firstPersonRoam = new mars3d.thing.FirstPersonRoam()
  map.addThing(firstPersonRoam)

  firstPersonRoam.startAutoForward()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 是否开启漫游
function chkOpen(value) {
  firstPersonRoam.enabled = value
}

// 开始自动漫游
function startAuto() {
  firstPersonRoam.startAutoForward()
}

// 停止自动漫游
function stopAuto() {
  firstPersonRoam.stopAutoForward()
}
