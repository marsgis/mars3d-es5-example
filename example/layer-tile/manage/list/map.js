// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.623553, lng: 117.322405, alt: 123536, heading: 359, pitch: -81 }
  },
  control: {
    baseLayerPicker: false
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function getLayrsTree(params) {
  return map.getLayrsTree(params)
}

function getLayerById(id) {
  return map.getLayerById(id)
}

// 更新图层勾选状态
function updateLayerShow(layer, show) {
  if (show) {
    if (!layer.isAdded) {
      map.addLayer(layer)
    }
    layer.show = true

    layer.flyTo() // 如果不想勾选定位，注释该行
  } else {
    layer.show = false
  }
}


// 用于 config.json 中 西藏垭口 图层的详情按钮 演示
window.showPopupDetails = (item) => {
  globalAlert(item.NAME)
}
