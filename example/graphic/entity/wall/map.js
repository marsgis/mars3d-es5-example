// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

var eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.473861, lng: 117.225929, alt: 52974, heading: 2, pitch: -49 }
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

  bindLayerEvent() // 对图层绑定相关事件
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
  addDemoGraphic6(graphicLayer)
  addDemoGraphic7(graphicLayer)
  addDemoGraphic8(graphicLayer)
  addDemoGraphic9(graphicLayer)
  addDemoGraphic10(graphicLayer)
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

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.154815, 31.853495],
      [117.181255, 31.854257],
      [117.182284, 31.848255],
      [117.184748, 31.840141],
      [117.180557, 31.835556],
      [117.180023, 31.833741],
      [117.166846, 31.833737],
      [117.155531, 31.833151],
      [117.154787, 31.835978],
      [117.151994, 31.839036],
      [117.150691, 31.8416],
      [117.151215, 31.844734]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      // 动画线材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
        image: "img/textures/fence.png",
        color: "#00ff00",
        speed: 10,
        axisY: true
      })
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  // 演示对graphic的个性化处理
  initGraphicManager(graphic)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.208302, 31.85757],
      [117.234234, 31.858263],
      [117.234261, 31.833317],
      [117.207414, 31.834541]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      // 动画线材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
        image: "img/textures/arrow.png",
        color: Cesium.Color.CHARTREUSE,
        repeat: new Cesium.Cartesian2(30, 1),
        speed: 20
      })
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic3(graphicLayer) {
  // 圆形时
  const positions = mars3d.PolyUtil.getEllipseOuterPositions({
    position: Cesium.Cartesian3.fromDegrees(117.276257, 31.866351, 19.57),
    radius: 1200, // 半径
    count: 50 // 共返回(count*4)个点
  })

  const graphic = new mars3d.graphic.WallEntity({
    positions: positions,
    style: {
      diffHeight: 800,
      closure: true,
      // 动画线材质
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
        image: "img/textures/fence.png",
        color: "#00ffff",
        speed: 10,
        axisY: true
      })
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.229659, 31.908221],
      [117.240804, 31.908175]
    ],
    style: {
      diffHeight: 700,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
        // 动画线材质
        image: "img/textures/fence.png",
        axisY: true,
        color: "#ff0000",
        image2: "img/textures/tanhao.png",
        color2: "#ffff00",
        speed: 10
      })
    },
    attr: { remark: "示例4" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.153945, 31.881122, 36.4],
      [117.168352, 31.880147, 32.6],
      [117.178047, 31.885925, 29.25]
    ],
    style: {
      diffHeight: 200,
      color: "#00ffff",
      opacity: 0.4,
      label: {
        text: "我是原始的",
        font_size: 18,
        color: "#ffffff",
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphic)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.positions = [
    [117.105938, 31.883825, 43.6],
    [117.125006, 31.876243, 42.6],
    [117.135525, 31.882068, 39],
    [117.151507, 31.874259, 39.7]
  ]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.353776, 31.887406, 21.2],
      [117.321028, 31.887207, 21.3],
      [117.290341, 31.902469, 15.1]
    ],
    style: {
      diffHeight: 400,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
        // 动画线材质
        image: "img/textures/arrow.png",
        color: "#00eba8",
        repeat: new Cesium.Cartesian2(20, 1),
        speed: 20
      })
    },
    attr: { remark: "示例6" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.192113, 31.80998, 32.2],
      [117.228145, 31.792757, 26.7],
      [117.261023, 31.776821, 19.8]
    ],
    style: {
      diffHeight: 500,
      color: "#00ffff",
      opacity: 0.4,

      label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        opacity: 0.8
      }
    },
    attr: { remark: "示例7" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.WallEntity({
    positions: [
      [117.206138, 31.877321],
      [117.206326, 31.901436]
    ],
    style: {
      diffHeight: 400,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.Image, {
        image: getColorRampCanvas(),
        transparent: false
      })
    },
    attr: { remark: "示例8" }
  })
  graphicLayer.addGraphic(graphic)
}

// 纹理图绘制
function getColorRampCanvas(elevationRamp) {
  if (elevationRamp == null) {
    // elevationRamp = { 0.0: "blue", 0.1: "cyan", 0.37: "lime", 0.54: "yellow", 1: "red" };
    // elevationRamp = { 0.0: '#000000', 0.045: '#2747E0', 0.1: '#D33B7D', 0.15: '#D32738', 0.37: '#FF9742', 0.54: '#ffd700', 1.0: '#ffffff' }
    elevationRamp = {
      0.0: "#FFEDA0",
      0.05: "#FED976",
      0.1: "#FEB24C",
      0.15: "#FD8D3C",
      0.37: "#FC4E2A",
      0.54: "#E31A1C",
      0.7: "#BD0026",
      1.0: "#800026"
    }
  }

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 100

  const ctx = canvas.getContext("2d")
  const grd = ctx.createLinearGradient(0, 0, 0, 100)
  for (const key in elevationRamp) {
    grd.addColorStop(1 - Number(key), elevationRamp[key])
  }

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 1, 100) // 参数：左上角x  左上角y  宽度width  高度height
  return canvas.toDataURL()
}

// 边界墙绘制
function addDemoGraphic9(graphicLayer) {
  queryAreasData().then(function (data) {
    const arr = mars3d.Util.geoJsonToGraphics(data) // 解析geojson
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const graphic = new mars3d.graphic.WallEntity({
        positions: item.positions,
        style: {
          diffHeight: 3000,
          material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
            image: "img/textures/fence.png",
            color: "#bdf700",
            repeat: new Cesium.Cartesian2(5, 1),
            axisY: true, // 方向，true时上下，false左右
            speed: 10
          })
        },
        attr: item.attr
      })
      graphicLayer.addGraphic(graphic)
      graphic.bindTooltip("合肥欢迎您 - 火星科技")
    }
  })
}

function addDemoGraphic10() {
  const primitive = new mars3d.graphic.WallEntity({
    positions: [
      [117.251382, 31.824055, 28.4],
      [117.278989, 31.819766, 27.3],
      [117.279566, 31.799699, 3.9],
      [117.265249, 31.797702, 26.3],
      [117.245146, 31.811783, 29]
    ],
    style: {
      closure: true,
      diffHeight: 500,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.WallScroll, {
        image: "img/textures/fence.png",
        color: Cesium.Color.CHARTREUSE,
        count: 3,
        speed: 20,
        bloom: true
      })
    },
    attr: { remark: "示例10" }
  })
  graphicLayer.addGraphic(primitive)
}

// 边界墙绘制 - 数据获取
function queryAreasData() {
  return mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/areas/340100.json" })
}

// 在图层级处理一些事物
function bindLayerEvent() {
  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  /* graphicLayer.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听layer，鼠标移入了矢量对象", event)
  })
  graphicLayer.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听layer，鼠标移出了矢量对象", event)
  }) */

  // 数据编辑相关事件， 用于属性弹窗的交互
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    eventTarget.fire("graphicEditor-start", e)
  })
  graphicLayer.on(
    [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
    function (e) {
      eventTarget.fire("graphicEditor-update", e)
    }
  )
  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    eventTarget.fire("graphicEditor-stop", e)
  })
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}

// 绑定右键菜单
function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.startEditing) {
          return false
        }
        return !graphic.isEditing
      },
      callback: function (e) {
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
        if (!graphic) {
          return false
        }
        return graphic.isEditing
      },
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.stopEditing(graphic)
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
      callback: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic._parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      callback: function (e) {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算围合面积",
      icon: "fa fa-reorder",
      callback: function (e) {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}

function updateLayerHasEdit(val) {
  graphicLayer.hasEdit = val
}

// 按钮事件
function startDrawGraphic() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800
      // label: {
      //   show: true,
      //   text: "警戒线",
      //   font_size: 18,
      //   color: "#55ff33",
      //   distanceDisplayCondition: true,
      //   distanceDisplayCondition_far: 500000,
      //   distanceDisplayCondition_near: 0
      // }
    }
  })
}
function onClickDrawModelClosure() {
  // 开始绘制
  graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      closure: true
    }
  })
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  /* graphic.on(mars3d.EventType.click, function (event) {
    console.log("监听graphic，单击了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOver, function (event) {
    console.log("监听graphic，鼠标移入了矢量对象", event)
  })
  graphic.on(mars3d.EventType.mouseOut, function (event) {
    console.log("监听graphic，鼠标移出了矢量对象", event)
  }) */

  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: function (e) {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}