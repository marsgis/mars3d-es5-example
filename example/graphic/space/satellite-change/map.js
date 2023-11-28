// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let drawGraphic
let graphicLayer

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: -13.151771, lng: 55.60413, alt: 30233027, heading: 154, pitch: -89 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    clock: {
      multiplier: 10 // 速度
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
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
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
  })
  // graphicLayer.on(mars3d.EventType.change, function (event) {
  //   console.log("卫星位置变化", event)
  // })

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "卫星图层", template: "all", attr })
  })

  creatSatellite()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function creatSatellite() {
  const weixin = new mars3d.graphic.Satellite({
    name: "GAOFEN 1",
    tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
    tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      scale: 1,
      minimumPixelSize: 90
    },
    label: {
      text: "GAOFEN 1",
      font_family: "楷体",
      font_size: 30,
      color: "#ffffff",
      outline: true,
      outlineColor: "#000000",
      outlineWidth: 3,
      background: true,
      backgroundColor: "#000000",
      backgroundOpacity: 0.5,
      pixelOffsetY: -20,
      scaleByDistance: true,
      scaleByDistance_far: 10000000,
      scaleByDistance_farValue: 0.4,
      scaleByDistance_near: 100000,
      scaleByDistance_nearValue: 1
    },
    cone: {
      angle1: 40,
      angle2: 10,
      color: "rgba(255,0,0,0.5)",
      show: false
    },
    path: {
      color: "#36d9ec"
    }
  })

  graphicLayer.addGraphic(weixin)

  weixin._lastInPoly = false

  setTimeout(() => {
    const position = weixin.position
    if (position) {
      map.flyToPoint(position, {
        radius: 900000, // 距离目标点的距离
        pitch: -60 // 相机方向
      })
    }
  }, 3000)

  // 位置变化事件
  weixin.on(mars3d.EventType.change, function (event) {
    // 判断卫星是否在面内
    const weixin = event.graphic
    if (!drawGraphic) {
      weixin._lastInPoly = false
      weixin.coneShow = false // 关闭视锥体
      return
    }

    const position = weixin.position
    if (!position) {
      return
    }
    let openVideo = false
    const thisIsInPoly = drawGraphic.isInPoly(position)
    if (thisIsInPoly !== weixin._lastInPoly) {
      if (thisIsInPoly) {
        // 开始进入区域内
        console.log("卫星开始进入区域内", weixin.name)

        weixin.coneShow = true // 打开视锥体
        openVideo = true // 打开视频面板
      } else {
        // 离开区域
        console.log("卫星离开区域", weixin.name)

        weixin.coneShow = false // 关闭视锥体
        openVideo = false // 关闭视频面板
      }

      eventTarget.fire("video", { openVideo })
      weixin._lastInPoly = thisIsInPoly
    }
  })
}

// 框选查询 矩形
function drawRectangle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 框选查询   圆
function drawCircle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 框选查询   多边
function drawPolygon() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 清除
function drawClear() {
  map.graphicLayer.clear()
  drawGraphic = null
}
