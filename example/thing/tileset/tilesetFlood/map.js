////import * as mars3d from "mars3d"

let map // mars3d.Map三维地图对象
let tilesetFlood

var mapOptions = {
  scene: {
    center: { lat: 31.797067, lng: 117.21963, alt: 1512, heading: 360, pitch: -36 }
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
  map = mapInstance // 记录map

  globalNotify("已知问题：", `
    (1) 对3dtiles数据有要求，仅适用于无自带着色器的纹理格式 模型
    (2) 目前不支持所有3dtiles数据，请替换url进行自测。`)

  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
  addLayer()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addLayer() {
  // 加模型
  var tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    type: "3dtiles",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    maximumScreenSpaceError: 16,
    maximumMemoryUsage: 1024,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true
  })
  map.addLayer(tilesetLayer)

  // 会执行多次，重新加载一次完成后都会回调
  tilesetLayer.on(mars3d.EventType.allTilesLoaded, function (event) {
    console.log("触发allTilesLoaded事件", event)
  })

  // 模型淹没处理类
  tilesetFlood = new mars3d.thing.TilesetFlood({
    layer: tilesetLayer,
    floodAll: false
  })
  map.addThing(tilesetFlood)

  tilesetFlood.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  tilesetFlood.on(mars3d.EventType.change, function (e) {
    var height = e.height
    eventTarget.fire("heightChange", { height })
  })
  tilesetFlood.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

// 高度选择
function onChangeHeight(height) {
  tilesetFlood.height = height
}

// 修改分析方式
function changeFloodType(val) {
  if (val === "1") {
    tilesetFlood.floodAll = true
  } else {
    tilesetFlood.floodAll = false
  }
}

// 绘制矩形
function btnDrawExtent() {
  stop()
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
      var positions = graphic.getOutlinePositions(false)

      tilesetFlood.addArea(positions)
    }
  })
}
// 绘制多边形
function btnDraw() {
  stop()
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      var positions = graphic.positionsShow

      tilesetFlood.addArea(positions)

      console.log("绘制坐标为", JSON.stringify(mars3d.PointTrans.cartesians2lonlats(positions))) // 方便测试拷贝坐标
    }
  })
}

// 开始分析
function begin(data) {
  if (!tilesetFlood.floodAll && tilesetFlood.length === 0) {
    globalMsg("请首先绘制分析区域！")
    return false
  }
  map.graphicLayer.clear()

  var minValue = Number(data.minHeight)
  var maxValue = Number(data.maxHeight)
  var speed = Number(data.speed)
  if (minValue <= 27) {
    globalMsg("最低海拔过低，请耐心等候几秒")
  }
  if (minValue > maxValue) {
    globalMsg("当前最低海拔高于最高海拔")
    return false
  }

  console.log("当前参数", { minHeight: minValue, maxHeight: maxValue })

  tilesetFlood.setOptions({
    minHeight: minValue,
    maxHeight: maxValue,
    speed: speed
  })

  tilesetFlood.start()
  return true
}

function stop() {
  tilesetFlood.clear()
}
