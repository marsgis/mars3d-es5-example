// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let tilesetLayer
let tilesetBoxClip


var mapOptions = {
  scene: {
    center: { lat: 31.842844, lng: 117.251112, alt: 125, heading: 6, pitch: -36 }
  }
}

var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "教学楼",
    url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
    position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
    maximumScreenSpaceError: 16,
    flyTo: true
  })
  map.addLayer(tilesetLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function drawExtent() {
  tilesetBoxClip.clear()
  map.graphicLayer.clear()

  map.graphicLayer.startDraw({
    type: "box",
    style: {
      color: "#ffffff",
      opacity: 0.2,
      dimensions: new Cesium.Cartesian3(10, 10, 10)
    },
    success: function (graphic) {
      const point = graphic.point
      map.graphicLayer.clear()

      tilesetBoxClip.position = point
      eventTarget.fire("hasDraw", { point })
    }
  })
}

// 演示数据
function tilesetBoxClipDemo(point) {
  tilesetBoxClip = new mars3d.thing.TilesetBoxClip({
    layer: tilesetLayer,
    position: point,
    dimensions: new Cesium.Cartesian3(20, 10, 15),
    showBox: true,
    edgeColor: Cesium.Color.GREY,
    edgeWidth: 2.0,
    clipOutSide: false
  })
  map.addThing(tilesetBoxClip)
}

// 是否显示盒子
function showModelMatrix(val) {
  tilesetBoxClip.showBox = val
}

// X长度改变
function onChangeDimensionsX(newValue) {
  tilesetBoxClip.dimensions.x = newValue
  tilesetBoxClip.redraw()
}

// Y长度改变
function onChangeDimensionsY(newValue) {
  tilesetBoxClip.dimensions.y = newValue
  tilesetBoxClip.redraw()
}

// Z长度改变
function onChangeDimensionsZ(newValue) {
  tilesetBoxClip.dimensions.z = newValue
  tilesetBoxClip.redraw()
}

// 坐标发生改变
function onChangePosition(point) {
  tilesetBoxClip.position = point
}

// 清除
function clear() {
  tilesetBoxClip.clear()
}
