// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let satelliteSensor
let modelGraphic
let graphicLayer
const reverse = true // z轴方向，true朝向空中，false朝向地心
const converter = Cesium.Transforms.eastNorthUpToFixedFrame
// const converter = Cesium.Transforms.localFrameToFixedFrameGenerator('east', 'south')

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 0.072832, lng: 151.409367, alt: 29330818, heading: 10, pitch: -90 }
  },
  cameraController: {
    maximumZoomDistance: 9000000000,
    constrainedAxis: false // 解除在南北极区域鼠标操作限制
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
  // 创建矢量数据图层
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

// 初始化创建一个卫星视锥体
function addModelGraphic(sensorParams) {
  const position = Cesium.Cartesian3.fromDegrees(sensorParams.model_x, sensorParams.model_y, sensorParams.model_z)
  // 加个模型
  modelGraphic = new mars3d.graphic.ModelEntity({
    name: "卫星模型",
    position: position,
    style: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 150,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue
    }
  })
  graphicLayer.addGraphic(modelGraphic)

  // 打开3个轴进行显示对比
  modelGraphic.debugAxis = true

  // 视锥体
  satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: position,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: sensorParams.angleValue1,
      angle2: sensorParams.angleValue2,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue,
      color: "rgba(0,255,255,0.7)"
    },
    fixedFrameTransform: converter,
    reverse: reverse
  })
  graphicLayer.addGraphic(satelliteSensor)
}

/**
 *
 * @export
 * @param {*} x 经度
 * @param {*} y 纬度
 * @param {*} z 高度
 * @returns {void}
 */
function updatePosition(x, y, z) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z)
  modelGraphic.position = position
  satelliteSensor.position = position
}

function locate() {
  map.flyToGraphic(modelGraphic, { radius: modelGraphic.height * 2 })
}

// 方向角改变
function headingChange(value) {
  modelGraphic.heading = value
  satelliteSensor.heading = value
}

// 俯仰角
function pitchChange(value) {
  modelGraphic.pitch = value
  satelliteSensor.pitch = value
}

// 左右角
function rollChange(value) {
  modelGraphic.roll = value
  satelliteSensor.roll = value
}

// 夹角1
function angle1(value) {
  satelliteSensor.angle1 = value
}

// 夹角2
function angle2(value) {
  satelliteSensor.angle2 = value
}

// 参考轴系显示与隐藏
function chkShowModelMatrix(val) {
  modelGraphic.debugAxis = val
}

// 视椎体状态
function sensorShowHide(val) {
  satelliteSensor.show = val
}
// 是否与地球相交
function chkUnderground(val) {
  satelliteSensor.rayEllipsoid = val
}

// 类型选择
function chkSensorType(value) {
  if (value === "1") {
    satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Conic
  } else {
    satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Rect
  }
}

function lengthChange(value) {
  modelGraphic.debugAxisLength = value * 1000
}

function clearAll() {
  map.graphicLayer.clear()
}

// 获取边界值
function getRegion() {
  map.graphicLayer.clear()

  const coords = satelliteSensor.getAreaCoords() // 导出成像区边界坐标
  if (!coords || coords.length === 0) {
    globalMsg("当前与地球无成像区边")
    return
  }
  // 显示边界点，测试
  map.graphicLayer.clear()

  coords.forEach((position) => {
    const primitive = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        color: "#ff0000",
        pixelSize: 8,
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        clampToGround: true
      }
    })
    map.graphicLayer.addGraphic(primitive)
  })
}

function getCenter() {
  map.graphicLayer.clear()

  const groundPosition = satelliteSensor.groundPosition
  if (!groundPosition) {
    globalMsg("当前与地球无交点")
    return
  }

  const primitive = new mars3d.graphic.PointPrimitive({
    position: groundPosition,
    style: {
      color: "#ff0000",
      pixelSize: 8,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2,
      clampToGround: true
    }
  })
  map.graphicLayer.addGraphic(primitive)

  const point = mars3d.LngLatPoint.fromCartesian(groundPosition)
  globalMsg(point.toString())
}