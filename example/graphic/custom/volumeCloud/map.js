// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer

// 事件对象，用于抛出事件给面板
var eventTarget = new mars3d.BaseClass()

var mapOptions = {
  scene: {
    center: { lat: 28.750173, lng: 116.904665, alt: 353676.9, heading: 1.4, pitch: -50 }
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

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/volumeCloud.json" })
    .then(function (data) {
      console.log("演示数据data", data)

      // let min = Number.MAX_VALUE
      // let max = Number.MIN_VALUE
      // data.values.forEach((element) => {
      //   min = Math.min(element, min)
      //   max = Math.max(element, max)
      // })
      // console.log(`min:${min},max:${max}`)

      addDemoGraphic1(data)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(data) {
  // 创建气象数据体渲染模型
  const volumeCloud = new mars3d.graphic.VolumeCloud({
    data: {
      rows: data.rows, // 行网格数
      cols: data.cols, // 列网格数
      heights: data.heights, // 高网格数
      values: data.values, // 3D 数据集数组, 数组长度应该是 rows*cols*heights, 顺序为为 row -> col -> height

      xmin: data.xmin, // 最小经度（度数，-180-180）
      xmax: data.xmax, // 最大经度（度数，-180-180）
      ymin: data.ymin, // 最小纬度（度数，-90-90）
      ymax: data.ymax, // 最大纬度（度数，-90-90）
      zmin: data.zmin, // 最小高度
      zmax: data.zmax // 最大高度
    },
    steps: 1000,
    colorsKey: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
    colors: [
      "rgb(0,0,0,0)",
      "rgb(170,36,250)",
      "rgba(212,142,254,0.13)",
      "rgba(238,2,48,0.12)",
      "rgba(254,100,92,0.11)",
      "rgba(254,172,172,0.1)",
      "rgba(140,140,0,0.09)",
      "rgba(200,200,2,0.08)",
      "rgba(252,244,100,0.07)",
      "rgba(16,146,26,0.06)",
      "rgba(0,234,0,0.05)",
      "rgba(166,252,168,0.04)",
      "rgba(30,38,208,0.03)",
      "rgba(122,114,238,0.02)",
      "rgba(192,192,254,0.01)"
    ]
  })
  graphicLayer.addGraphic(volumeCloud)

  // setInterval(() => {
  //   for (let index = 0, len = data.values.length; index < len; index++) {
  //     if (data.values[index] > 20) {
  //       data.values[index] = Math.abs(data.values[index] * 1.001)
  //     }
  //   }

  //   volumeCloud.updateData({
  //     rows: data.rows, // 行网格数
  //     cols: data.cols, // 列网格数
  //     heights: data.heights, // 高网格数
  //     values: data.values // 3D 数据集数组, 数组长度应该是 rows*cols*heights
  //   })
  // }, 1000)
}