// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let lightning

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 33.59135, lng: 119.032192, alt: 14.6, heading: 25.7, pitch: 15.5 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const rainEffect = new mars3d.effect.Rain({
    speed: 10,
    size: 20,
    direction: 10
  })
  map.addEffect(rainEffect)

  lightning = new mars3d.effect.Lightning({
    opacity: 0.4
  })
  map.addEffect(lightning)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 是否开启
function setEnabled(val) {
  lightning.enabled = val
}

function setOpacity(value) {
  lightning.opacity = value
}
//
function setInterval(value) {
  lightning.interval = value
}
