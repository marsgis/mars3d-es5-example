// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

let drawLayer
let measure

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  control: {
    homeButton: true,
    sceneModePicker: true,
    infoBox: false,
    vrButton: true,
    geocoder: { service: "gaode", insertIndex: 0 },
    baseLayerPicker: true,
    fullscreenButton: true,
    navigationHelpButton: true,

    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件

    contextmenu: { hasDefault: true }, // 涉及到多语言的模块：右键菜单
    compass: { top: "10px", left: "5px" },
    distanceLegend: { left: "180px", bottom: "30px" },
    locationBar: {
      template:
        "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div>"
    }
  },

  basemaps: [
    {
      name: "Google Images",
      name_cn: "谷歌影像",
      name_en: "Google Images",
      icon: "/img/basemaps/google_img.png",
      type: "google",
      layer: "img_d",
      show: true
    },
    {
      name: "Tianditu Images",
      name_cn: "天地图影像",
      name_en: "Tianditu Images",
      icon: "/img/basemaps/tdt_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "img_d" },
        { name: "注记", type: "tdt", layer: "img_z" }
      ],
      show: false
    },
    {
      name: "Tianditu Electronic map",
      name_cn: "天地图电子",
      name_en: "Tianditu Electronic map",
      icon: "/img/basemaps/tdt_vec.png",
      type: "group",
      layers: [
        { name: "底图", type: "tdt", layer: "vec_d" },
        { name: "注记", type: "tdt", layer: "vec_z" }
      ]
    },
    {
      name: "not map",
      name_cn: "无底图",
      name_en: "not map",
      icon: "/img/basemaps/null.png",
      type: "grid",
      color: "#ffffff",
      alpha: 0.03,
      cells: 2
    }
  ],
  // eslint-disable-next-line no-undef
  lang: CustomLang // 使用自定义语言配置，配置信息在 ./CustomLang.js
}

var eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance
  map.toolbar.style.bottom = "55px" // 修改toolbar控件的样式

  // 涉及到多语言的模块：标绘提示
  drawLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(drawLayer)

  drawLayer.bindContextMenu([
    {
      text: () => {
        return map.getLangText("_删除")
      },
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
        drawLayer.removeGraphic(graphic)
        if (parent) {
          drawLayer.removeGraphic(parent)
        }
      }
    }
  ])

  // 涉及到多语言的模块：图上量算
  measure = new mars3d.thing.Measure({
    // 可设置文本样式
    label: {
      color: "#ffffff",
      font_family: "楷体",
      font_size: 20,
      background: false
    }
  })
  map.addThing(measure)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function toCustomLang() {
  map.options.basemaps.forEach((item) => {
    item.name = item.name_en
  })

  if (map.controls.locationBar) {
    map.controls.locationBar.options.template =
      "<div>lng:{lng}</div> <div>lat:{lat}</div> <div>alt：{alt} m</div> <div>level：{level}</div><div>heading：{heading}°</div> <div>pitch：{pitch}°</div><div>cameraHeight：{cameraHeight}m</div><div class='hide700'> {fps} FPS</div>"
  }

  // eslint-disable-next-line no-undef
  map.lang = CustomLang // 使用自定义语言配置，配置信息在 ./CustomLang.js
}

function toDefaultLange() {
  map.options.basemaps.forEach((item) => {
    item.name = item.name_cn
  })

  if (map.controls.locationBar) {
    map.controls.locationBar.options.template =
      "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div class='hide1000'>横{crsx}  纵{crsy}</div> <div>海拔：{alt}米</div> <div class='hide700'>层级：{level}</div><div>方向：{heading}°</div> <div>俯仰角：{pitch}°</div><div class='hide700'>视高：{cameraHeight}米</div><div class='hide700'>帧率：{fps} FPS</div>"
  }

  map.lang = mars3d.Lang // 使用默认配置
}

function distance() {
  drawLayer.stopDraw()
  measure.distance()
}

function area() {
  drawLayer.stopDraw()
  measure.area()
}

function height() {
  drawLayer.stopDraw()
  measure.heightTriangle()
}

function coordinate() {
  drawLayer.stopDraw()
  measure.point()
}
function angle() {
  drawLayer.stopDraw()
  measure.angle()
}

/**
 *开始标绘
 *
 * @startDraw
 * @param { string } type 矢量数据类型
 * @returns {void} 无
 */
function startDraw(type) {
  measure.stopDraw()
  drawLayer.startDraw({
    type,
    style: {
      color: "#00ffff",
      opacity: 0.6
    }
  })
}
