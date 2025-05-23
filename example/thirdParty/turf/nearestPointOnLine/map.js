// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象
let pointLayer

var mapOptions = {
  scene: {
    center: { lat: 31.871794, lng: 116.800468, alt: 57020, heading: 90, pitch: -51 },
    fxaa: true
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 点矢量数据图层
  pointLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 绘制线
async function drawLine() {
  if (pointLayer) {
    pointLayer.clear()
  }
  graphicLayer.clear()

  const graphic = await graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: "#55ff33",
      width: 3,
      clampToGround: true
    }
  })
  console.log("标绘完成", graphic.toJSON())
}

// 绘制点
async function drawPoint() {
  pointLayer.clear()
  const graphic = await pointLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 10,
      color: "red"
    }
  })
  nearPoint()
}

// 最近点计算
function nearPoint() {
  const lineLayer = graphicLayer.getGraphics()
  const point = pointLayer.getGraphics()

  if (lineLayer.length < 1 || point.length < 1) {
    return
  }

  const line = lineLayer[0].toGeoJSON()
  const pt = point[0].toGeoJSON()

  const snapped = turf.nearestPointOnLine(line, pt, { units: "miles" })
  const position = snapped.geometry.coordinates

  // 最近点（图标点）
  const graphic = new mars3d.graphic.BillboardPrimitive({
    position,
    style: {
      image: "https://data.mars3d.cn/img/marker/mark-blue.png",
      scale: 1,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
      clampToGround: true
    },
    popup: "最近点"
  })
  pointLayer.addGraphic(graphic)
}

// 清除数据
function clearLayer() {
  graphicLayer.clear()
  pointLayer.clear()
}
