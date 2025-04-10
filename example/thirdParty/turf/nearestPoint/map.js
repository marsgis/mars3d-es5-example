// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let pointLayer
let graphicLayer

var mapOptions = {
  scene: {
    center: { lat: 31.967015, lng: 117.316406, alt: 9150, heading: 206, pitch: -42 },
    fxaa: true
  }
}

const pointStyle = {
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  scale: 1,
  scaleByDistance: true,
  scaleByDistance_far: 20000,
  scaleByDistance_farValue: 0.7,
  scaleByDistance_near: 1000,
  scaleByDistance_nearValue: 1,
  clampToGround: true
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  pointLayer = new mars3d.layer.GeoJsonLayer({
    name: "体育设施点",
    url: "https://data.mars3d.cn/file/geojson/hfty-point.json",
    symbol: {
      styleOptions: {
        ...pointStyle,
        image: "https://data.mars3d.cn/img/marker/mark-blue.png"
      }
    },
    popup: "{项目名称}",
    zIndex: 10
  })
  map.addLayer(pointLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer({
    zIndex: 20
  })
  map.addLayer(graphicLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

function drawPoint() {
  clearAll()

  graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        ...pointStyle,
        image: "https://data.mars3d.cn/img/marker/route-start.png"
      }
    })
    .then((graphic) => {
      clickPoint(graphic.positionShow)
      graphic.remove()
    })
}

function clickPoint(position) {
  if (pointLayer.length === 0) {
    globalMsg("正在加载数据,请稍等......")
    return
  }

  graphicLayer.clear()

  // 生成查询点
  const queryPoint = new mars3d.graphic.BillboardEntity({
    position,
    style: {
      ...pointStyle,
      image: "https://data.mars3d.cn/img/marker/route-start.png"
    },
    popup: "查询点"
  })
  graphicLayer.addGraphic(queryPoint)

  console.log(`分析${pointLayer.length}个数据中的最近点`)

  // turf分析
  const targetPoint = queryPoint.toGeoJSON()
  const points = pointLayer.toGeoJSON()
  const nearest = turf.nearestPoint(targetPoint, points)
  if (!nearest) {
    return
  }

  const nearestPoint = mars3d.Util.geoJsonToGraphics(nearest)[0]

  const graphic = pointLayer.getGraphicById(nearestPoint.attr.id)
  updateSelect(graphic)

  // 连线
  const polyline = new mars3d.graphic.PolylineEntity({
    positions: [position, nearestPoint.position],
    style: {
      width: 5,
      clampToGround: true,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: "rgba(89,249,255,0.8)",
        image: "https://data.mars3d.cn/img/textures/line-tarans.png",
        speed: 8
      }
    }
  })
  graphicLayer.addGraphic(polyline)

  // 终点
  const endPoint = new mars3d.graphic.CircleEntity({
    position: nearestPoint.position,
    style: {
      radius: polyline.distance / 10,
      height: 40,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#00ffff",
        count: 2,
        speed: 20
      }
    },
    popup: "最近的体育场所是:<br />" + nearestPoint.attr["项目名称"]
  })
  graphicLayer.addGraphic(endPoint)
  endPoint.openPopup()
}

function clearAll() {
  removeSelect()
  graphicLayer.clear()
}

let selectGraphic
function updateSelect(graphic) {
  removeSelect()

  if (graphic) {
    selectGraphic = graphic
    selectGraphic.setStyle({
      image: "https://data.mars3d.cn/img/marker/mark-red.png"
    })
  }
}

function removeSelect() {
  if (!selectGraphic) {
    return
  }

  selectGraphic.setStyle({
    image: "https://data.mars3d.cn/img/marker/mark-blue.png"
  })
  selectGraphic = undefined
}
