// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let floodByGraphic
let drawPotions

var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 基于polygon矢量面抬高模拟，只支持单个区域
  floodByGraphic = new mars3d.thing.FloodByGraphic({
    // perPositionHeight: true, // 是否每个分析点高度都不一样
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    }
  })
  map.addThing(floodByGraphic)

  floodByGraphic.on(mars3d.EventType.start, function (e) {
    console.log("开始分析", e)
  })
  floodByGraphic.on(mars3d.EventType.change, function (e) {
    const height = e.height
    eventTarget.fire("heightChange", { height })
  })
  floodByGraphic.on(mars3d.EventType.end, function (e) {
    console.log("结束分析", e)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  clearDraw()
  floodByGraphic.remove()
  floodByGraphic = null

  map = null
}

// 绘制矩形
function btnDrawExtent(callback) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)

      // 区域
      drawPotions = positions

      if (floodByGraphic.options.perPositionHeight) {
        // eslint-disable-next-line
        callback(-100, 100)
      } else {
        showLoading()
        // 求最大、最小高度值
        graphic.show = false // 会遮挡深度图，所以需要隐藏
        mars3d.PolyUtil.interPolygonByDepth({ scene: map.scene, positions }).then((result) => {
          graphic.show = true // 恢复显示
          hideLoading()
          callback(result.minHeight, result.maxHeight)
        })
      }
    }
  })
}
// 绘制多边形
function btnDraw(callback) {
  clearDraw()

  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      const positions = graphic.positionsShow

      drawPotions = positions

      if (floodByGraphic.options.perPositionHeight) {
        // eslint-disable-next-line
        callback(-100, 100)
      } else {
        showLoading()
        // 求最大、最小高度值
        graphic.show = false // 会遮挡深度图，所以需要隐藏
        mars3d.PolyUtil.interPolygonByDepth({ scene: map.scene, positions }).then((result) => {
          graphic.show = true // 恢复显示
          hideLoading()
          callback(result.minHeight, result.maxHeight)
        })
      }
    }
  })
}

function clearDraw() {
  drawPotions = null
  map.graphicLayer.clear()

  if (floodByGraphic) {
    floodByGraphic.clear()
  }
}

// 开始分析
function begin(data, callback) {
  if (drawPotions == null) {
    globalMsg("请首先绘制分析区域！")
    return
  }
  map.graphicLayer.clear()

  floodByGraphic.setOptions({
    positions: drawPotions,
    minHeight: Number(data.minHeight),
    maxHeight: Number(data.maxHeight),
    speed: Number(data.speed)
  })
  floodByGraphic.start()

  callback()
}

// 高度选择
function onChangeHeight(height) {
  floodByGraphic.height = height
}

// 自动播放
function startPlay() {
  if (floodByGraphic.isStart) {
    floodByGraphic.stop()
  } else {
    floodByGraphic.start()
  }
}
