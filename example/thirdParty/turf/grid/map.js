////import * as mars3d from "mars3d"

let map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

var mapOptions = {
  scene: {
    center: { lat: 31.255881, lng: 117.271026, alt: 60133, heading: 0, pitch: -46 }
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

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

var turfOptions = { units: "kilometers" }
var bbox = [116.984788, 31.625909, 117.484068, 32.021504]

// 蜂窝网格
function hexGrid(cellSide) {
  var geojson = turf.hexGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

// 点网格
function pointGrid(cellSide) {
  var geojson = turf.pointGrid(bbox, cellSide, turfOptions)
  drawPoint(geojson)
}

// 正方形网格
function squareGrid(cellSide) {
  var geojson = turf.squareGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

// 三角形网格
function triangleGrid(cellSide) {
  var geojson = turf.triangleGrid(bbox, cellSide, turfOptions)
  drawPolyon(geojson)
}

// 蜂窝网格、正方形网格、三角形网格
function drawPolyon(geojson) {
  graphicLayer.clear()
  var polygons = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

  for (let i = 0; i < polygons.length; i++) {
    var item = polygons[i]

    var graphic = new mars3d.graphic.PolygonEntity({
      positions: item.positions,
      style: {
        color: "#ffff00",
        opacity: 0.2,
        outline: true,
        outlineWidth: 2,
        outlineColor: "#ffff00",
        outlineOpacity: 0.5,
        clampToGround: true
      },
      attr: item.attr,
      popup: "第" + i + "个"
    })
    graphicLayer.addGraphic(graphic)
  }
}

// 点网格
function drawPoint(geojson) {
  graphicLayer.clear()

  var points = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson

  for (let i = 0; i < points.length; i++) {
    var item = points[i]

    var graphic = new mars3d.graphic.PointPrimitive({
      position: item.position,
      style: {
        color: "#ffff00",
        pixelSize: 8
      },
      popup: "第" + i + "个"
    })
    graphicLayer.addGraphic(graphic)
  }
}
