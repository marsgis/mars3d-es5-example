// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

var mapOptions = {
  scene: {
    center: { lat: 31.255881, lng: 117.271026, alt: 60133, heading: 0, pitch: -46 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  randomPoints()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 颜色
let index = 0
const colors = ["#99CCCC", "#66FF66", "#FF6666", "#00CCFF", "#00FF33", "#CC0000", "#CC00CC", "#CCFF00", "#0000FF"]
function getColor() {
  const i = index++ % colors.length
  return colors[i]
}

const bbox = [116.984788, 31.625909, 117.484068, 32.021504]

function randomPoints() {
  graphicLayer.clear()

  const points = turf.randomPoint(100, { bbox })

  points.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    const graphic = new mars3d.graphic.BillboardPrimitive({
      position,
      style: {
        image: "https://data.mars3d.cn/img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
      },
      popup: "第" + index + "个"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function randomPolylines() {
  graphicLayer.clear()

  let numVertices = parseInt(Math.random() * 10)
  numVertices = numVertices < 3 ? 3 : numVertices

  const polylines = turf.randomLineString(100, {
    bbox,
    num_vertices: numVertices, // 每个 LineString 将包含多少个坐标。
    max_length: 0.01 // 大小
  })

  polylines.features.forEach((e, index) => {
    const positions = e.geometry.coordinates

    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions,
      style: {
        width: 4,
        color: getColor(),
        opacity: 0.8,
        clampToGround: true
      },
      popup: "第" + index + "个"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function randomPolygons() {
  graphicLayer.clear()

  let numVertices = parseInt(Math.random() * 10)
  numVertices = numVertices < 3 ? 3 : numVertices

  const polygons = turf.randomPolygon(100, {
    bbox,
    num_vertices: numVertices, // 坐标个数,必须多于或等于四个
    max_radial_length: 0.01 // 大小
  })

  polygons.features.forEach((e, index) => {
    const positions = e.geometry.coordinates
    const graphic = new mars3d.graphic.PolygonPrimitive({
      positions,
      style: {
        color: getColor(),
        opacity: 0.6,
        clampToGround: true
      },
      popup: "第" + index + "个"
    })
    graphicLayer.addGraphic(graphic)
  })
}

function clearAll() {
  graphicLayer.clear()
}
