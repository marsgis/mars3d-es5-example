import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let measureObj

export const mapOptions = {
  scene: {
    center: { lat: 30.715648, lng: 116.300527, alt: 10727, heading: 3, pitch: -25 }
  }
}

export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  measureObj = new mars3d.thing.Measure({
    // 设置文本样式
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20
    }
  })
  map.addThing(measureObj)

  // 触发事件：开始分析前
  measureObj.on(mars3d.EventType.start, function (e) {
    // console.log("开始分析", e)
    showLoading()
  })

  // 触发事件：异步分析完成后
  measureObj.on(mars3d.EventType.end, function (e) {
    // console.log("分析结束", e)

    hideLoading()
    if (e.graphic?.type === mars3d.graphic.SectionMeasure.type) {
      eventTarget.fire("measureEnd", e)
    }
  })

  measureObj.on(mars3d.EventType.click, function (e) {
    // console.log("单击了对象", e)
    hideTipMarker()

    if (e.graphic?.type === mars3d.graphic.SectionMeasure.type) {
      eventTarget.fire("measureClick", { value: e.graphic?.measured })
    }
  })

  // 加一些演示数据
  addDemoGraphic1(measureObj.graphicLayer)
}
/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.SectionMeasure({
    exact: true,
    positions: [
      [116.193794, 30.994415, 654.8],
      [116.236077, 30.925154, 506.2],
      [116.314569, 30.864239, 408.7],
      [116.341924, 30.847984, 381.8],
      [116.392754, 30.854264, 581.7],
      [116.415222, 30.880092, 580.5],
      [116.567457, 30.85223, 314.6]
    ],
    style: {
      width: 5,
      color: "#3388ff"
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)
}



export function removeAll() {
  measureObj.clear()
  hideTipMarker()
}

export function measureSection() {
  measureObj.section({
    // maxPointNum:2,
    splitNum: 300, // 插值次数
    exact: false // 是否进行精确计算， 传false时是否快速概略计算方式，该方式计算精度较低，但计算速度快，仅能计算在当前视域内坐标的高度
  })
}

export function calculation(params) {
  const len = mars3d.MeasureUtil.formatDistance(Number(params.axisValue))
  const hbgdStr = mars3d.MeasureUtil.formatDistance(Number(params.value))

  return { len, hbgdStr }
}

let tipGraphic
/**
 *  echart图表中的图标
 *
 * @export
 * @param {Array} point 坐标点
 * @param {number} z 海拔高度
 * @param {html} inthtml html
 * @returns {void}
 */
export function showTipMarker(point, z, inthtml) {
  const _position_draw = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z)

  if (!tipGraphic) {
    tipGraphic = new mars3d.graphic.BillboardEntity({
      name: "当前点",
      position: _position_draw,
      style: {
        image: "img/marker/mark-blue.png",
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2)
      }
    }).addTo(map.graphicLayer)
    tipGraphic._setPositionsToCallback()
  }
  tipGraphic._position_draw = _position_draw
  tipGraphic.bindPopup(inthtml).openPopup()
}

export function hideTipMarker() {
  if (!tipGraphic) {
    return
  }
  tipGraphic.remove(true)
  tipGraphic = null
}
