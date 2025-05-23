// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.769641, lng: 116.318889, alt: 7432.2, heading: 1, pitch: -19.6 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  globalNotify("已知问题提示", `(1)视角很近时视角变动时会存在DIV抖动问题。`)

  map.on(mars3d.EventType.click, function (event) {
    console.log("监听map，单击了矢量对象", event)
  })

  // 创建DIV数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    // event.stopPropagation()
    console.log("监听layer，单击了矢量对象", event)
  })

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
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 一个黑色面板，指向左下角黄色连线
function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.29854, 30.937322, 568.1],
    style: {
      html: `<div class="marsBlackPanel  animation-spaceInDown">
              <div class="marsBlackPanel-text">大湖名城,创新高地</div>
          </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 400000), // 按视距距离显示
      clampToGround: true,
      // 高亮时的样式
      highlight: {
        // type: mars3d.EventType.click,
        className: "marsBlackPanel-highlight"
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)
}

// 一个渐变的文本面板,中间竖直连线
function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.266763, 30.9272, 905.9],
    style: {
      html: `<div class="marsBlueGradientPnl">
              <div>合肥火星科技有限公司</div>
          </div>`,
      scale: 10,
      heading: -80,

      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      offsetY: -89,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 400000), // 按视距距离显示

      // 高亮时的样式
      highlight: {
        type: mars3d.EventType.click,
        className: "marsBlueGradientPnl-highlight"
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)
}

//
function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.322645, 30.890187, 403.7],
    style: {
      html: `<div class="marsGreenGradientPnl" >安徽欢迎您</div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM

      // 高亮时的样式
      // highlight: {
      //   type: mars3d.EventType.click,
      //   className: "marsGreenGradientPnl-highlight"
      // }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)

  // 在指定时间范围显示对象 0-10，20-30,40-max
  const now = map.clock.currentTime
  graphic.availability = [
    { start: now, stop: Cesium.JulianDate.addSeconds(now, 10, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 20, new Cesium.JulianDate()), stop: Cesium.JulianDate.addSeconds(now, 30, new Cesium.JulianDate()) },
    { start: Cesium.JulianDate.addSeconds(now, 40, new Cesium.JulianDate()), stop: "2999-01-01 00:00:00" }
  ]
}

// 添加GIF图标，DIV方式
function addDemoGraphic4(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.29569, 30.905512, 583.8],
    style: {
      html: '<img src="https://data.mars3d.cn/img/marker/gif/typhoon.gif" style="width:50px;height:50px;" ></img>',
      scale: 10,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER
    },
    attr: { remark: "示例4" },
    pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic5(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.311175, 30.99863, 1300],
    style: {
      html: `<iframe style="width: 2000px; height: 1200px; border: none; "src="http://mars3d.cn/dev/guide/"  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe> `,
      scale: 3,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    },
    attr: { remark: "示例5" },
    testPoint: true
  })
  graphicLayer.addGraphic(graphic)
}

// 倾斜指向左下角的面板样式
function addDemoGraphic6(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.257574, 30.868632, 1142.2],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">火星水厂</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">实时流量：</div>
                              <div class="data-value"><span id="lablLiuliang" class="label-num">39</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水池液位：</div>
                              <div class="data-value"><span id="lablYeWei"  class="label-num">10.22</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水泵状态：</div>
                              <div class="data-value">
                                <span id="lablSBZT1"  class="label-tag data-value-status-1" title="中间状态">1号</span>
                                <span id="lablSBZT2"  class="label-tag data-value-status-0" title="关闭状态">2号</span>
                                </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">出水阀门：</div>
                              <div class="data-value">
                                <span id="lablCSFM1"   class="label-tag data-value-status-1" title="中间状态">1号</span>
                                <span id="lablCSFM2"   class="label-tag data-value-status-2" title="打开状态">2号</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
      clampToGround: true
    },
    attr: { remark: "示例6" },
    pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
  })
  graphicLayer.addGraphic(graphic)

  // 刷新局部DOM,不影响面板的其他控件操作
  // [建议读取到后端接口数据后主动去修改DOM，比下面演示的实时刷新效率高些]
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // popup对应的DOM

    const lablLiuliang = container.querySelector("#lablLiuliang")
    if (lablLiuliang) {
      lablLiuliang.innerHTML = (Math.random() * 100).toFixed(0) // 测试的随机数
    }

    const lablYeWei = container.querySelector("#lablYeWei")
    if (lablYeWei) {
      lablYeWei.innerHTML = mars3d.Util.formatDate(new Date(), "ss.S") // 测试的随机数
    }
  })
}

// 倾斜指向左下角的面板样式
function addDemoGraphic7(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: [116.330711, 30.873722, 378.3],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-green">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">大别山水厂</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">实时流量：</div>
                              <div class="data-value"><span class="label-num">99</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水池液位：</div>
                              <div class="data-value"><span class="label-num">20.02</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水泵状态：</div>
                              <div class="data-value"><span class="label-tag data-value-status-1" title="中间状态">1号</span><span
                                      class="label-tag data-value-status-0" title="关闭状态">2号</span></div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">出水阀门：</div>
                              <div class="data-value"><span class="label-tag data-value-status-1" title="中间状态">1号</span><span
                                      class="label-tag data-value-status-2" title="打开状态">2号</span></div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      heading: 60,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
      clampToGround: true
    },
    attr: { remark: "示例7" },
    // 可以传入自定义测试点样式
    // testPoint: {
    //   color: '#ff0000',
    //   pixelSize: 8,
    // },
    pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
  })
  graphicLayer.addGraphic(graphic)

  graphic.testPoint = true // 打开测试点，与DIV点进行对比位置调整css
}

// 倾斜指向左下角的面板样式
function addDemoGraphic8(graphicLayer) {
  const graphic = new mars3d.graphic.DivPlane({
    position: {
      type: "time", // 时序动态坐标
      speed: 800,
      list: [
        [116.213974, 30.974853, 580.3],
        [116.270249, 30.957078, 642.1],
        [116.308503, 30.974854, 1194.6],
        [116.378376, 30.969112, 841.1],
        [116.388025, 30.915534, 885.1]
      ]
    },
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-blue">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">岳西水厂</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">实时流量：</div>
                              <div class="data-value"><span class="label-num">98</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水池液位：</div>
                              <div class="data-value"><span class="label-num">13.14</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水泵状态：</div>
                              <div class="data-value">
                                <span id="btn-status1" class="label-tag data-value-status-1" title="中间状态">1号</span>
                                <span id="btn-status2" class="label-tag data-value-status-0" title="关闭状态">2号</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1000, 200000) // 按视距距离显示
    },
    attr: { remark: "示例8" }
  })
  graphic.on(mars3d.EventType.load, function (event) {
    const container = event.graphic.container // popup对应的DOM

    const btnStatus1 = container.querySelector("#btn-status1")
    if (btnStatus1) {
      btnStatus1.addEventListener("click", (e) => {
        e.stopPropagation()
        globalMsg("您单击了1号水泵")
      })
    }

    const btnStatus2 = container.querySelector("#btn-status2")
    if (btnStatus2) {
      btnStatus2.addEventListener("click", (e) => {
        e.stopPropagation()
        globalMsg("您单击了2号水泵")
      })
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 生成演示数据(测试数据量)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.DivPlane({
      position: position,
      style: {
        html: `<div class="marsGreenGradientPnl" >安徽欢迎您</div>`,
        scale: 10,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      },
      attr: { index: index },
      depthTest: false,
      hasZIndex: false,
      frameRate: 1
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
async function startDrawGraphic() {
  const graphic = await graphicLayer.startDraw({
    type: "divPlane",
    style: {
      html: `<div class="marsImgPanel2">
                    <div class="title">测试DIV点</div>
                    <div class="content">此处可以绑定任意Html代码和css效果</div>
                </div >`,
      scale: 10,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
  })
  console.log("标绘完成", graphic.toJSON())
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
      text: "复制",
      icon: "fa fa-copy",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          map.contextmenu.copyGraphic.layerId = graphicLayer.id
        }
      }
    },
    {
      text: "剪切",
      icon: "fa fa-scissors",
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          map.contextmenu.copyGraphic = graphic.toJSON() // map内置右键中"粘贴"菜单使用
          map.contextmenu.copyGraphic.layerId = graphicLayer.id

          graphic.remove(true) // 移除原有对象
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy || graphic.graphicIds) {
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
        graphic.stopEditing()
        graphicLayer.removeGraphic(graphic)
      }
    }
  ])
}
