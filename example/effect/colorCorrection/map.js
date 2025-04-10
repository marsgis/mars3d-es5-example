// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let colorCorrection

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 33.591015, lng: 119.032698, alt: 73, heading: 343, pitch: -21 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    url: "https://data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false
  })
  map.addLayer(tiles3dLayer)

  // 构造效果
  colorCorrection = new mars3d.effect.ColorCorrection()
  map.addEffect(colorCorrection)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 是否开启特效
function setDepthOfField(val) {
  colorCorrection.enabled = val
}
// 修改对应参数
function setBrightness(val) {
  colorCorrection.brightness = val
}

function setContrast(val) {
  colorCorrection.contrast = val
}

function setHue(val) {
  colorCorrection.hue = val
}

function setSaturation(val) {
  colorCorrection.saturation = val
}
