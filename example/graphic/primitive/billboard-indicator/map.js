import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

export const mapOptions = {
  scene: {
    center: { lat: 31.530403, lng: 117.315144, alt: 38555.2, heading: 360, pitch: -45 }
  }
}

// 事件对象，用于抛出事件给面板
export const eventTarget = new mars3d.BaseClass()
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function addDemoGraphic1(graphicLayer) {
  const divIndicator = new mars3d.graphic.BillboardIndicator({
    position: [117.376411, 31.804661, 4.1],
    style: {
      // 文本
      label: {
        text: "自动连线最近角",
        font: "40px 楷体",
        color: "#ffffff"
      },
      // 矩形（可拖拽的）
      rectX: 100,
      rectY: -50,
      scaleByDistance: new Cesium.NearFarScalar(800, 0.8, 2500, 0.3),
      rectColor: "rgb(16 238 220)",
      // 连线（自动的）
      lineColor: "#00ff00",
      lineWidth: 2,
      lineDash: "5,5", // 虚线
      // 圆点(不动的)
      pointColor: "#0000ff", // 颜色
      pointSize: 4, // 像素大小
      pointOutline: true, // 是否边框
      pointOutlineWidth: 2, // 边框宽度
      pointOutlineColor: "#ffffff" // 边框颜色
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(divIndicator)
}

function addDemoGraphic2(graphicLayer) {
  const divIndicator = new mars3d.graphic.BillboardIndicator({
    position: [117.207965, 31.842734, 37.8],
    style: {
      // 文本
      label: {
        text: "连线位置固定",
        font: "20px 楷体",
        color: "#ffffff"
      },
      // 连线（自动的）
      lineDash: "5,5", // 虚线
      autoPoistion: false
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(divIndicator)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间
  graphicLayer.clear()

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  // const graphics = []
  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphicOptions = {
      id: "m" + index,
      position,
      style: {
        // 文本
        label: {
          text: "数据" + index,
          font: "20px 楷体",
          color: "#ffffff"
        },
        // 矩形（可拖拽的）
        rectX: 100,
        rectY: -50,
        // 连线（自动的）
        lineColor: "#00ff00",
        lineWidth: 2,
        lineDash: "5, 5", // 虚线
        // 圆点(不动的)
        pointColor: "#0000ff", // 颜色
        pointSize: 2, // 像素大小
        pointOutline: true, // 是否边框
        pointOutlineWidth: 2, // 边框宽度
        pointOutlineColor: "#ffffff" // 边框颜色
      },
      attr: { index }
    }

    const graphic = new mars3d.graphic.BillboardIndicator(graphicOptions)
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  graphicLayer.flyTo()

  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "billboardIndicator",
    style: {
      // 矩形内文本
      label: {
        text: "我是文本信息",
        font: "20px 楷体",
        color: "#ffffff"
      },
      // 矩形（可拖拽的）
      rectX: 100,
      rectY: -50,
      // 连线（自动的）
      lineColor: "#00ff00",
      lineWidth: 2,
      lineDash: "5, 5", // 虚线
      // 圆点(不动的)
      pointColor: "#0000ff", // 颜色
      pointSize: 2, // 像素大小
      pointOutline: true, // 是否边框
      pointOutlineWidth: 2, // 边框宽度
      pointOutlineColor: "#ffffff" // 边框颜色
    }
  })
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}

// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    }
  ])
}
