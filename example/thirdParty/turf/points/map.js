// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象
let pointsLayer

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

  // 点矢量数据图层
  pointsLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(pointsLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
// 生成50个随机点
function randomPoints() {
  clearlayer()

  const points = turf.randomPoint(50, { bbox }) // 50个随机点

  points.features.forEach((e, index) => {
    const position = e.geometry.coordinates
    const graphic = new mars3d.graphic.BillboardPrimitive({
      position,
      style: {
        image: "https://data.mars3d.cn/img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
        clampToGround: false
      },
      popup: "第" + index + "个"
    })
    pointsLayer.addGraphic(graphic)
  })
}

// 计算包围面
function convexPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("请先创建原始数据")
    return
  }

  const hull = turf.convex(points)

  const convexPoints = hull.geometry.coordinates
  // 外包围面;
  const polygonGraphic = new mars3d.graphic.PolygonEntity({
    positions: convexPoints,
    style: {
      color: "#00ffff",
      opacity: 0.2,
      clampToGround: false
    }
  })
  graphicLayer.addGraphic(polygonGraphic)
}

// 泰森多边形
function voronoiPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("请先创建原始数据")
    return
  }

  const options = {
    bbox
  }
  const voronoiPolygons = turf.voronoi(points, options)

  voronoiPolygons.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    const voronoiPolygon = new mars3d.graphic.PolygonEntity({
      positions: position,
      style: {
        randomColor: true, // 随机色
        opacity: 0.5,
        clampToGround: false
      },
      popup: "第" + index + "个"
    })
    graphicLayer.addGraphic(voronoiPolygon)
  })
}

// 计算TIN多边形
function tinPolygon() {
  graphicLayer.clear()

  const points = pointsLayer.toGeoJSON()

  if (points.features.length === 0) {
    globalMsg("请先创建原始数据")
    return
  }

  for (let i = 0; i < points.features.length; i++) {
    points.features[i].properties.z = ~~(Math.random() * 9)
  }
  const tin = turf.tin(points, "z")

  tin.features.forEach((e, index) => {
    const position = e.geometry.coordinates

    // TIN多边形
    const tinPolygon = new mars3d.graphic.PolygonEntity({
      positions: position,
      style: {
        randomColor: true, // 随机色
        opacity: 0.5,
        outline: true,
        outlineColor: "rgb(3, 4, 5,0.2)",
        outlineWidth: 2,
        clampToGround: false
      },
      popup: "第" + index + "个"
    })
    graphicLayer.addGraphic(tinPolygon)
  })
}

// 清除所有矢量图层
function clearlayer() {
  graphicLayer.clear()
  pointsLayer.clear()
}
