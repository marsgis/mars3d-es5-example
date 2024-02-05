// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let limitHeight

var mapOptions = {
  scene: {
    center: { lat: 31.794547, lng: 117.21215, alt: 1672, heading: 18, pitch: -33 }
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // // 创建矢量数据图层
  // const graphicLayer = new mars3d.layer.GraphicLayer()
  // map.addLayer(graphicLayer)

  // // 加gltf模型
  // const graphic = new mars3d.graphic.ModelPrimitive({
  //   name: "风机",
  //   position: [117.221189, 31.814105, 30],
  //   style: {
  //     url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
  //     colorBlendMode: Cesium.ColorBlendMode.MIX,
  //     scale: 50
  //   }
  // })
  // graphicLayer.addGraphic(graphic)

  // 加3dtiles模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    cacheBytes: 1073741824, // 1024MB = 1024*1024*1024
    maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  // 限高分析类
  limitHeight = new mars3d.thing.LimitHeight({
    color: "rgba(255,0,0,0.5)",
    height: 80, // 限高
    bottomHeight: 32, // 模型地面的海拔高度（单位：米）
    positions: [
      [117.210446, 31.829032, 0],
      [117.226334, 31.826662, 0],
      [117.226694, 31.807882, 0],
      [117.209776, 31.808359, 0],
      [117.209778, 31.808341, 0]
    ]
  })
  map.addThing(limitHeight)

  // 自动读取模型的高度，但不一定准确。
  // tilesetLayer.on(mars3d.EventType.load, function (event) {
  //   limitHeight.bottomHeight = mars3d.LngLatPoint.fromCartesian(tilesetLayer.boundingSphere.center).alt
  // })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 滑动条
function currHeight(value) {
  limitHeight.height = value
}

// 绘制矩形
function drawExtent() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.3,
      clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      limitHeight.positions = positions

      map.graphicLayer.clear()
    }
  })
}

// 绘制面
function drawPolygon() {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.3,
      clampToGround: true
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      limitHeight.positions = positions

      map.graphicLayer.clear()
      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标
    }
  })
}

function clear() {
  limitHeight.clear()
  map.graphicLayer.clear()
}
