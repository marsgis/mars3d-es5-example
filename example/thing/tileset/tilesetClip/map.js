// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

var mapOptions = {
  scene: {
    center: { lat: 31.826361, lng: 117.223374, alt: 805, heading: 206, pitch: -38 }
  }
}

let tilesetLayer

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify("已知问题提示", `(1) 目前不支持所有类型3dtile数据，请替换url进行自测`)

  showTehDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// true:  精确模式, 直接存储范围,但传入的范围顶点数量多时，就会造成一定程度的卡顿；
// false: 掩膜模式，栅格化范围,效率与范围顶点数量无关,但放大后锯齿化严重
const precise = false

function showDytDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { alt: -27 },
    maximumScreenSpaceError: 1, // 可传入TilesetFlat构造参数，下面是演示压平区域
    clip: {
      precise: precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.clip是TilesetClip对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function showTehDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    flyTo: true,

    // 可传入TilesetClip构造参数，下面是演示压平区域
    clip: {
      precise: precise,
      area: [
        {
          positions: [
            [117.217219, 31.81957, 33.1],
            [117.220855, 31.818821, 31.8],
            [117.220938, 31.817249, 30.6],
            [117.21743, 31.816218, 31.7]
          ]
        }
      ],
      enabled: true
    }
  })
  map.addLayer(tilesetLayer)

  // 会执行多次，重新加载一次完成后都会回调
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  //   console.log("触发allTilesLoaded事件", event)
  // })

  // tilesetLayer.clip是TilesetClip对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function showXianDemo() {
  removeLayer()

  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    skipLevelOfDetail: true,
    preferLeaves: true,
    cullWithChildrenBounds: false,
    center: { lat: 28.440675, lng: 119.487735, alt: 639, heading: 269, pitch: -38 },
    clip: {
      precise: precise,
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // 会执行多次，重新加载一次完成后都会回调
  // tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
  //   console.log("触发allTilesLoaded事件", event)
  // })

  // tilesetLayer.clip是TilesetClip对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.clip.on(mars3d.EventType.addItem, onAddClipArea)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// 添加了压平区域后的回调事件
function onAddClipArea(event) {
  eventTarget.fire("addItem", event)
}

// 绘制矩形
function btnDrawExtent() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.clip.addArea(positions)
    }
  })
}
// 绘制裁剪区
function btnDraw() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.clip.addArea(positions)
    }
  })
}
// 清除
function removeAll() {
  map.graphicLayer.clear()
  tilesetLayer.clip.clear()
}

// 定位至模型
function flyToGraphic(item) {
  const graphic = tilesetLayer.clip.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
function deletedGraphic(item) {
  tilesetLayer.clip.removeArea(item)
}

function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.clip.showArea(id)
  } else {
    tilesetLayer.clip.hideArea(id)
  }
}
