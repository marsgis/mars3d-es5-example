// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.791477, lng: 116.348231, alt: 6351, heading: 10, pitch: -36 }
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

  // 创建Graphic图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const primitive = new mars3d.graphic.CloudPrimitive({
    position: [116.353072, 30.859836, 2000],
    style: {
      scale: new Cesium.Cartesian2(5500, 1000),
      maximumSize: new Cesium.Cartesian3(50, 15, 13),
      slice: 0.3,
      label: {
        text: "我是一团来自火星的云",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 90000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic2(graphicLayer) {
  const primitive = new mars3d.graphic.CloudPrimitive({
    position: [116.332891, 30.856537, 1500],
    style: {
      scale: new Cesium.Cartesian2(3500, 800),
      maximumSize: new Cesium.Cartesian3(50, 12, 15),
      slice: 0.36
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic3(graphicLayer) {
  const primitive = new mars3d.graphic.CloudPrimitive({
    position: [116.371649, 30.851072, 1389],
    style: {
      scale: new Cesium.Cartesian2(5000, 1000),
      maximumSize: new Cesium.Cartesian3(50, 12, 15),
      slice: 0.49
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(primitive)
}

function addDemoGraphic4(graphicLayer) {
  const primitive = new mars3d.graphic.CloudPrimitive({
    position: new mars3d.LngLatPoint(116.350075, 30.848636, 1500),
    style: {
      scale: new Cesium.Cartesian2(2300, 900),
      maximumSize: new Cesium.Cartesian3(13, 13, 13),
      slice: 0.2
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(primitive)
}

// 批量生成测试数据
function addDemoGraphic(num) {
  graphicLayer.clear()

  showLoading()
  const startTime = new Date().getTime()

  let scaleX, scaleY, aspectRatio, cloudHeight, depth

  for (let j = 0; j < num; ++j) {
    const position = randomPoint()

    scaleX = getRandomNumberInRange(500, 2000)
    scaleY = scaleX / 2.0 - getRandomNumberInRange(0, scaleX / 4.0)

    depth = getRandomNumberInRange(30, 50)
    aspectRatio = getRandomNumberInRange(1.5, 2.1)
    cloudHeight = getRandomNumberInRange(5, 20)

    const primitive = new mars3d.graphic.CloudPrimitive({
      position: position,
      style: {
        scale: new Cesium.Cartesian2(scaleX, scaleY),
        maximumSize: new Cesium.Cartesian3(aspectRatio * cloudHeight, cloudHeight, depth),
        slice: getRandomNumberInRange(0.2, 0.6)
      }
    })
    graphicLayer.addGraphic(primitive)
  }

  hideLoading()
  const endTime = new Date().getTime()
  // 两个时间戳相差的毫秒数
  const usedTime = (endTime - startTime) / 1000
  // console.log(usedTime);

  globalMsg("共耗时" + usedTime.toFixed(2) + "秒")
}

// 取区域内的随机点
function randomPoint() {
  const jd = getRandomNumberInRange(116.29 * 1000, 116.39 * 1000) / 1000
  const wd = getRandomNumberInRange(30.8 * 1000, 30.88 * 1000) / 1000
  const height = getRandomNumberInRange(2000, 4000)
  return new mars3d.LngLatPoint(jd, wd, height)
}

function getRandomNumberInRange(minValue, maxValue) {
  return minValue + Cesium.Math.nextRandomNumber() * (maxValue - minValue)
}