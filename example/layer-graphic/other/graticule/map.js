// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 14.132213, lng: 107.948167, alt: 14854603, heading: 2, pitch: -89 }
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

  // 经纬网
  const tileLayer = new mars3d.layer.GraticuleLayer({
    steps: [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0],
    lineStyle: {
      color: "#fff",
      height: 1000
    }
    // labelStyle: {
    //   color: "#ffff00",
    //   pixelOffset: new Cesium.Cartesian2(0, 0)
    // }
  })
  map.addLayer(tileLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}
