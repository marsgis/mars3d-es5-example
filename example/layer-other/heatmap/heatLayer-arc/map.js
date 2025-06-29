// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.794428, lng: 117.235343, alt: 2351.9, heading: 1.6, pitch: -28.8, roll: 0 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  addLayer()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

function addLayer() {
  map.basemap = 2017 // 蓝色底图

  // 加载城市模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "https://data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    style: {
      color: {
        conditions: [["true", `color("rgba(42, 160, 224, 1)")`]]
      }
    },
    marsJzwStyle: true,
    popup: "all"
  })
  map.addLayer(tilesetLayer)

  // 视角切换（分步执行）
  map.setCameraViewList([
    { lat: 31.813938, lng: 117.240085, alt: 3243, heading: 357, pitch: -52 },
    { lat: 31.821728, lng: 117.253605, alt: 1702, heading: 319, pitch: -37 },
    { lat: 31.836674, lng: 117.260762, alt: 1779, heading: 269, pitch: -37 }
  ])

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 测试点数据，实际开发时换掉
  const arrPoints = getRandomPoints(1000)

  // 热力图 图层
  const heatLayer = new mars3d.layer.HeatLayer({
    positions: arrPoints,
    // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
    heatStyle: {
      radius: 40,
      blur: 0.85
    },
    // 以下为矩形矢量对象的样式参数
    style: {
      arc: true, // 是否为曲面
      height: 200.0
    }
    // flyTo: true,
  })
  map.addLayer(heatLayer)

  // setTimeout(() => {
  //   mars3d.Util.downloadFile("layer.json", JSON.stringify(heatLayer.toJSON()))
  // }, 8000)

  // 显示地面对应的点，测试渲染结果的正确性
  for (let i = 0; i < arrPoints.length; i++) {
    const item = arrPoints[i]

    const graphic = new mars3d.graphic.PointPrimitive({
      position: [item.lng, item.lat, 90],
      style: {
        color: "#ffff00",
        pixelSize: 7
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  graphicLayer.show = false
}

// 显示对应的数据点
function chkUnderground(val) {
  graphicLayer.show = val
}

// 获取bbox矩形区域内的count个随机点
function getRandomPoints(count) {
  const xmin = 117.226189
  const xmax = 117.245831
  const ymin = 31.828858
  const ymax = 31.842967
  const arr = []
  const arrPoint = turf.randomPoint(count, { bbox: [xmin, ymin, xmax, ymax] }).features // 随机点
  for (let i = 0; i < arrPoint.length; i++) {
    const item = arrPoint[i].geometry.coordinates
    const val = Math.floor(Math.random() * 100) // 热力值
    arr.push({ lng: item[0], lat: item[1], value: val })
  }
  return arr
}
