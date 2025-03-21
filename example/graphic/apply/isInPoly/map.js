// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.772337, lng: 117.213784, alt: 12450, heading: 0, pitch: -66 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  const extent = map.getExtent()
  mars3d.Util.fetchJson({
    url: "//server.mars3d.cn/server/pointRandom/",
    queryParameters: {
      xmin: extent.xmin,
      ymin: extent.ymin,
      xmax: extent.xmax,
      ymax: extent.ymax,
      count: 100
    }
  })
    .then(function (data) {
      addData(data)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

let selectGraphic = []
function addData(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]

    const graphic = new mars3d.graphic.BillboardEntity({
      position: Cesium.Cartesian3.fromDegrees(item.x, item.y, 0),
      style: {
        image: "https://data.mars3d.cn/img/marker/mark-blue.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1),
        clampToGround: true
      },
      attr: item
    })
    graphicLayer.addGraphic(graphic)

    graphic.bindTooltip(item.name)
  }
}

// 在范围内的改变图标为红色
function updateSelect(drawGraphic) {
  graphicLayer.eachGraphic((graphic) => {
    const position = graphic.positionShow

    const isInArea = drawGraphic.isInPoly(position)
    if (isInArea) {
      graphic.setStyle({
        image: "https://data.mars3d.cn/img/marker/mark-red.png"
      })
      selectGraphic.push(graphic)
    }
  })
}

function removeAll() {
  map.graphicLayer.clear()

  for (let i = 0; i < selectGraphic.length; i++) {
    const graphic = selectGraphic[i]
    graphic.setStyle({
      image: "https://data.mars3d.cn/img/marker/mark-blue.png"
    })
  }
  selectGraphic = []
}

async function drawPolygon() {
  removeAll()
  const graphic = await map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    }
  })
  updateSelect(graphic)
}

async function drawCircle() {
  removeAll()
  const graphic = await map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    }
  })
  updateSelect(graphic)
}

async function drawRectangle() {
  removeAll()
  const graphic = await map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    }
  })
  updateSelect(graphic)
}
