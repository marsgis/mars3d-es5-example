// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer
var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

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

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify("已知问题提示", `(1) SatelliteSensor性能比较差，后期会尝试优化，非投射需求时建议用conicSensor或rectSensor`)

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

let modelGraphic

// 初始化创建一个卫星视锥体
function addDemoGraphic1(sensorParams) {
  const position = Cesium.Cartesian3.fromDegrees(sensorParams.model_x, sensorParams.model_y, sensorParams.model_z)
  // 加个模型
  modelGraphic = new mars3d.graphic.ModelPrimitive({
    name: "卫星模型",
    position: position,
    forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
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
  const satelliteSensor = new mars3d.graphic.SatelliteSensor({
    position: position,
    forwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    backwardExtrapolationType: Cesium.ExtrapolationType.HOLD,
    style: {
      sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
      angle1: sensorParams.angleValue1,
      angle2: sensorParams.angleValue2,
      heading: sensorParams.headingValue,
      pitch: sensorParams.pitchValue,
      roll: sensorParams.rollValue,
      color: "rgba(0,255,255,0.7)",
      flat: true
    }
  })
  graphicLayer.addGraphic(satelliteSensor)

  eventTarget.fire("addTableData", { graphicLayer })
}

// 生成演示数据(测试数据量)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 5000)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.SatelliteSensor({
      position,
      style: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
        angle1: 10,
        angle2: 20,
        color: "rgba(0,255,255,0.7)"
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制 相阵控雷达
function startDrawGraphic() {
  graphicLayer
    .startDraw({
      type: "satelliteSensor",
      style: {
        sensorType: mars3d.graphic.SatelliteSensor.Type.Rect,
        angle1: 20,
        angle2: 10,
        color: "rgba(0,255,255,0.7)"
      }
    })
    .then((graphic) => {
      graphic.height = 5000
    })
}

let satelliteSensor
function getGraphic(graphicId) {
  satelliteSensor = graphicLayer.getGraphicById(graphicId)
  return satelliteSensor
}

function updatePosition(x, y, z) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z)
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.position = position
  }
  if (satelliteSensor) {
    satelliteSensor.position = position
  }
}

function locate() {
  satelliteSensor.flyTo({ radius: satelliteSensor.alt * 2 })
}

// 方向角改变
function headingChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.heading = value
  }
  if (satelliteSensor) {
    satelliteSensor.heading = value
  }
}

// 俯仰角
function pitchChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.pitch = value
  }
  if (satelliteSensor) {
    satelliteSensor.pitch = value
  }
}

// 左右角
function rollChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.roll = value
  }
  if (satelliteSensor) {
    satelliteSensor.roll = value
  }
}

// 夹角1
function angle1(value) {
  if (satelliteSensor) {
    satelliteSensor.angle1 = value
  }
}

// 夹角2
function angle2(value) {
  if (satelliteSensor) {
    satelliteSensor.angle2 = value
  }
}

// 参考轴系显示与隐藏
function chkShowModelMatrix(val) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.debugAxis = val
  }
}

// 视椎体状态
function sensorShowHide(val) {
  if (satelliteSensor) {
    satelliteSensor.show = val
  }
}
// 是否与地球相交
function chkUnderground(val) {
  if (satelliteSensor) {
    satelliteSensor.rayEllipsoid = val
  }
}

// 类型选择
function chkSensorType(value) {
  if (satelliteSensor) {
    if (value === "1") {
      satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Conic
    } else {
      satelliteSensor.sensorType = mars3d.graphic.SatelliteSensor.Type.Rect
    }
  }
}

function lengthChange(value) {
  if (modelGraphic && !modelGraphic.isDestroy) {
    modelGraphic.debugAxisLength = value * 1000
  }
}

function updateColor(value) {
  if (satelliteSensor) {
    satelliteSensor.color = value
  }
}

// 获取边界值
function getRegion() {
  map.graphicLayer.clear()
  if (!satelliteSensor) {
    return
  }

  const coords = satelliteSensor.getAreaCoords() // 导出成像区边界坐标
  if (!coords || coords.length === 0) {
    globalMsg("当前与地球无成像区边")
    return
  }
  // 显示边界点，测试

  coords.forEach((position) => {
    const graphic = new mars3d.graphic.PointPrimitive({
      position,
      style: {
        color: "#ff0000",
        pixelSize: 8,
        outline: true,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        clampToGround: true
      }
    })
    map.graphicLayer.addGraphic(graphic)
  })
}

function getCenter() {
  map.graphicLayer.clear()

  if (!satelliteSensor) {
    return
  }

  const groundPosition = satelliteSensor.groundPosition
  if (!groundPosition) {
    globalMsg("当前与地球无交点")
    return
  }

  const graphic = new mars3d.graphic.PointPrimitive({
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
  map.graphicLayer.addGraphic(graphic)

  const point = mars3d.LngLatPoint.fromCartesian(groundPosition)
  globalMsg(point.toString())
}

function clearAll() {
  map.graphicLayer.clear()
}
