// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 33.588405, lng: 119.031988, alt: 336, heading: 359, pitch: -37 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  },
  layers: [
    {
      name: "文庙",
      type: "3dtiles",
      url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      position: { alt: 120 },
      maximumScreenSpaceError: 2,
      show: true
    }
  ]
}

function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  graphicLayer.on(mars3d.EventType.dblClick, function (event) {
    const graphic = event.graphic
    if (graphic) {
      map.flyToPoint(graphic.position, {
        radius: Cesium.Cartesian3.distance(graphic.position, map.camera.positionWC),
        complete: (e) => {
          graphic.setCameraOptions({
            type: "gs",
            radius: Cesium.Cartesian3.distance(graphic.position, map.camera.positionWC)
          })
        }
      })
    }
  })

  map.on(mars3d.EventType.click, function (event) {
    if (!event.graphic) {
      mars3d.graphic.Route.clearLastCamera()
    }
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  for (let i = 0; i < 20; i++) {
    const graphic = new mars3d.graphic.Route({
      model: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        scale: 0.1,
        roll: 0,
        pitch: 0
        // clampToGround: true // 支持贴模型+地形
      },
      // 实时贴模型的处理参数
      clampToTileset: true // 贴模型，但效率不高，车多就卡
      // frameRate: 3, // 控制贴模型的效率，多少帧计算一次
    })
    graphicLayer.addGraphic(graphic)
  }

  // 设置动态位置
  changePosition(0)

  // 定时更新动态位置（setInterval为演示）
  const interval = 30
  changePosition(interval)
  setInterval(() => {
    changePosition(interval)
  }, interval * 1000)
}

// 改变位置
function changePosition(time) {
  graphicLayer.eachGraphic((graphic) => {
    if (graphic.isPrivate) {
      return
    }
    graphic.addDynamicPosition(randomPoint(), time) // 按time秒运动至指定位置
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(119.028631 * 1000, 119.034843 * 1000) / 1000
  const wd = random(33.589624 * 1000, 33.594783 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 0)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}

// 绑定右键菜单
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
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
