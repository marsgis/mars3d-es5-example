// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let tiles3dLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.842449, lng: 117.251173, alt: 144, heading: 4, pitch: -35 }
  },
  mouse: {
    pickLimit: 99 // 鼠标穿透拾取的最大构件数量
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 模型
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    highlight: {
      type: mars3d.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
      color: "#00FF00"
      // uniqueKey: "id"
    },
    // 是否允许鼠标穿透拾取
    allowDrillPick: function (event) {
      const alpha = event?.pickedObject?.color?.alpha
      if (Cesium.defined(alpha) && alpha !== 1) {
        return true // 鼠标不拾取前面遮挡的透明的构件，穿透拾取其后方不透明构件。
      }
      return false
    },
    flyTo: true
  })
  map.addLayer(tiles3dLayer)
  showCengByStyle("F5")
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 显示整栋楼
function showAll() {
  tiles3dLayer.style = undefined
}
// 负一层
function minusOne() {
  showCengByStyle("B1")
}

// 1~5层
function show(num) {
  const floor = "F" + num
  showCengByStyle(floor)
}

// API: http://mars3d.cn/api/TilesetLayer.html#style
// 说明：https://github.com/CesiumGS/3d-tiles/tree/master/specification/Styling

function showCengByStyle(ceng) {
  tiles3dLayer.closeHighlight()
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${标高} ==='" + ceng + "' || ${底部约束} ==='" + ceng + "'", "rgb(255, 255, 255)"],
        ["true", "rgba(255, 255, 255,0.03)"]
      ]
    }
  })
}
