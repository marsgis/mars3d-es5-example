// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = function (option) {
  option.control = {
    distanceLegend: false // 当前演示的示例控件-比例尺控件
  }
  return option
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件) 不可多次添加
  const distanceLegend = new mars3d.control.DistanceLegend({ left: "100px", bottom: "2px" })
  map.addControl(distanceLegend)

  distanceLegend.on(mars3d.EventType.change, function (event) {
    console.log("比例尺发生变化", event)
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}
