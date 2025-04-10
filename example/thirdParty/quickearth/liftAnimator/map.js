// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 23.238632, lng: 105.710856, alt: 510314.9, heading: 359.5, pitch: -41.4 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  initDemoData()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

let animator
async function initDemoData() {
  const { consts, getBinary, resourceService, MicapsDiamond131GridDataProvider, DataAnimationService, DataAnimationType } = window.QE // quickearth.core.js
  const { CPixelLayer } = window.QEC // quickearth.cesium.js

  // public静态资源的路径
  consts.resourcePath = "https://data.mars3d.cn/file/qe"
  // consts.defaultLegendPath = "https://data.mars3d.cn/file/qe/styles/colors"
  // consts.wasmPath = "/lib/mars3d/thirdParty/quickearth/wasm"
  // consts.workerPath = "/lib/mars3d/thirdParty/quickearth/workers"

  globalMsg("数据加载中...")
  showLoading()

  // config资源配置
  await resourceService.loadResourceFromConfigPath("styles/demo.config.json")

  // 加载数据[原始二进制气象数据时]
  const buffers = await getBinary("http://data.mars3d.cn/file/qe/data/Z_OTHE_RADAMOSAIC_20220412000000.bin.zip")
  const provider = new MicapsDiamond131GridDataProvider(buffers[0])
  // mars3d.Util.downloadFile("Z_OTHE_RADAMOSAIC_20220412000000.json", JSON.stringify(provider.toJSON()))

  // 加载数据[JSON格式数据时]
  // const json = await mars3d.Util.fetchJson({ url: "http://data.mars3d.cn/file/qe/data/Z_OTHE_RADAMOSAIC_20220412000000.json" })
  // console.log("JSON数据加载完成", json)
  // const provider = new JsonGridDataProvider(json)

  // 构造渲染图层
  const style = {
    fillColor: "color-cr#res",
    zScale: 5
  }
  // API文档： https://qeapi.dev.91weather.com/classes/CPixelLayer.html
  // 或查看 public\lib\mars3d\thirdParty\quickearth\quickearth.cesium.d.ts文件
  const layer = new CPixelLayer({ interpFromPreSource: true }).setDrawOptions(style).setDataSource(provider)
  map.scene.primitives.add(layer)

  animator = new DataAnimationService(provider, {
    type: DataAnimationType.Level,
    layer,
    all: provider.gridOptions.zValues.length,
    delta: 0.2
  })
  animator.start()

  globalMsg("数据加载完成")
  hideLoading()
}

function start() {
  animator?.start()
}
function stop() {
  animator?.stop()
}

function changeChangeDelta(delta) {
  animator?.setDelta(delta)
}
