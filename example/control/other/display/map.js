// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  control: {
    homeButton: {
      icon: "https://data.mars3d.cn/img/control/homeButton.svg"
    },
    fullscreenButton: {
      icon: "https://data.mars3d.cn/img/control/fullscreenButton.svg"
    },
    navigationHelpButton: {
      icon: "https://data.mars3d.cn/img/control/navigationHelpButton.svg"
    },
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode" },
    baseLayerPicker: true,
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    distanceLegend: { style: { left: "10px", bottom: "25px" } },
    compass: { style: { top: "10px", left: "5px" } }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.control.toolbar.container.style.bottom = "55px" // 修改toolbar控件的样式

  map.control.navigationHelpButton.on(mars3d.EventType.click, function (event) {
    console.log("您单击了帮助按钮", event)
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 按钮
function bindPOI(val) {
  map.control.geocoder.show = val
}

// 视角复位
function bindView(val) {
  map.control.homeButton.show = val
}

// 基础的地图切换
function bindBaseLayerPicker(val) {
  map.control.baseLayerPicker.show = val
}

// 全屏切换
function bindFullScreen(val) {
  map.control.fullscreenButton.show = val
}

// VR
function bindVR(val) {
  map.control.vrButton.show = val
}

// 帮助按钮
function bindHelpButton(val) {
  map.control.navigationHelpButton.show = val
}

// 二三维切换
function bindSceneModePicker(val) {
  map.control.sceneModePicker.show = val
}

function bindZoom(val) {
  map.control.zoom.show = val
}

// 面板：
// 信息状态栏
function bindLocation(val) {
  map.control.locationBar.show = val
}

// 时钟
function bindClock(val) {
  map.control.clockAnimate.show = val
}

// 时间刻度线
function bindTimeLine(val) {
  map.control.timeline.show = val
}

// 导航球
function bindNav(val) {
  map.control.compass.show = val
}

// 比例尺
function bindLegend(val) {
  map.control.distanceLegend.show = val
}

// 图层
function bindLayer(val) {
  document.getElementById("mars-manage-layer-btn").style.display = val ? "inline-block" : "none"
}
