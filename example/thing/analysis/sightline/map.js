// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let sightline

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.715648, lng: 116.300527, alt: 10727, heading: 3, pitch: -25 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify(
    "已知问题提示",
    `(1) 依赖cesium底层接口，少数情况下不够准确
(2)需要分析的点均在视域内才可以分析`
  )

  sightline = new mars3d.thing.Sightline({
    visibleColor: new Cesium.Color(0, 1, 0, 0.4),
    hiddenColor: new Cesium.Color(1, 0, 0, 0.4)
    // depthFailColor: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.PolylineDash, {
    //   dashLength: 20.0,
    //   color: "#ff0000"
    // })
  })
  map.addThing(sightline)

  sightline.on(mars3d.EventType.end, function (e) {
    console.log("分析完成", e)
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

async function drawCircle() {
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      clampToGround: true
    }
  })

  let center = graphic.positionShow
  center = mars3d.PointUtil.addPositionsHeight(center, 1.5) // 加人的身高等因素，略微抬高一些

  const targetPoints = graphic.getOutlinePositions(false, 45)

  map.graphicLayer.clear()
  map.scene.globe.depthTestAgainstTerrain = true

  for (let i = 0; i < targetPoints.length; i++) {
    let targetPoint = targetPoints[i]
    targetPoint = mars3d.PointUtil.getSurfacePosition(map.scene, targetPoint)
    sightline.add(center, targetPoint)
  }

  createPoint(center, true)

  map.scene.globe.depthTestAgainstTerrain = false
}

async function drawLine() {
  map.graphicLayer.clear()
  const graphic = await map.graphicLayer.startDraw({
    type: "polyline",
    maxPointNum: 2,
    style: {
      color: "#55ff33",
      width: 3
    }
  })
  const positions = graphic.positionsShow
  map.graphicLayer.clear()
  map.scene.globe.depthTestAgainstTerrain = true

  const center = positions[0]
  const targetPoint = positions[1]
  sightline.add(center, targetPoint, { offsetHeight: 1.5 }) // 1.5是加人的身高等因素，略微抬高一些

  createPoint(center, true)
  createPoint(targetPoint, false)

  map.scene.globe.depthTestAgainstTerrain = false
}

function clearAll() {
  sightline.clear()
  map.graphicLayer.clear()
}

/**
 * 绘制成功后创建点
 *
 * @param {Array} position 坐标点
 * @param {boolean} isFirst 点文字
 * @return {object} 返回像素点Entity对象
 */
function createPoint(position, isFirst) {
  const graphic = new mars3d.graphic.PointEntity({
    position,
    style: {
      color: Cesium.Color.fromCssColorString("#3388ff"),
      pixelSize: 6,
      outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
      label: {
        text: isFirst ? "观察位置" : "目标点",
        font_size: 17,
        font_family: "楷体",
        color: Cesium.Color.AZURE,
        outline: true,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -20), // 偏移量
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000)
      }
    }
  })
  map.graphicLayer.addGraphic(graphic)

  return graphic
}
