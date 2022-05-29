////import * as mars3d from "mars3d"

let map // mars3d.Map三维地图对象
let routeLayer // 矢量数据图层
let gaodeRoute // 高德 路径规划

// 当前页面业务相关
let startGraphic, endGraphic

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.797919, lng: 117.281329, alt: 36236, heading: 358, pitch: -81 }
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

  // 创建矢量数据图层
  routeLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(routeLayer)

  gaodeRoute = new mars3d.query.GaodeRoute({})
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 开始分析按钮
function btnAnalyse(type) {
  if (!startGraphic || !endGraphic) {
    globalMsg("请设置起点和终点")
    return
  }
  queryRoute(type)
}

// 清除按钮
function removeAll() {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }
  if (endGraphic) {
    endGraphic.remove()
    endGraphic = null
  }

  routeLayer.clear()
}

/**
 * 起点按钮
 *
 * @export
 * @param {string} type 不同方式路线查询
 * @returns {string}
 */
function startPoint(type) {
  if (startGraphic) {
    startGraphic.remove()
    startGraphic = null
  }

  return map.graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        image: "img/marker/start.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    .then((graphic) => {
      startGraphic = graphic
      var point = graphic.point
      point.format()
      // 触发自定义事件，改变输入框的值
      queryRoute(type)

      return point.lng + "," + point.lat
    })
}

/**
 * 终点按钮
 *
 * @export
 * @param {string} type 不同方式路线查询
 * @returns {string}
 */
function endPoint(type) {
  if (endGraphic) {
    endGraphic.remove()
    endGraphic = null
  }

  return map.graphicLayer
    .startDraw({
      type: "billboard",
      style: {
        image: "img/marker/end.png",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    })
    .then((graphic) => {
      endGraphic = graphic
      var point = graphic.point
      point.format()
      queryRoute(type)

      return point.lng + "," + point.lat
    })
}

function queryRoute(type) {
  if (!startGraphic || !endGraphic) {
    return
  }

  routeLayer.clear()
  showLoading()

  gaodeRoute.query({
    type: Number(type),
    points: [startGraphic.coordinate, endGraphic.coordinate],
    success: function (data) {
      hideLoading()
      var firstItem = data.paths[0]
      var points = firstItem.points
      if (!points || points.length < 1) {
        return
      }

      var time = mars3d.Util.formatTime(firstItem.allDuration)
      var distance = mars3d.MeasureUtil.formatDistance(firstItem.allDistance)
      var html = "<div>总距离：" + distance + "<br/>所需时间：" + time + "</div>"

      var graphic = new mars3d.graphic.PolylineEntity({
        positions: points,
        style: {
          clampToGround: true,
          material: Cesium.Color.AQUA.withAlpha(0.8),
          width: 5
        },
        attr: firstItem,
        popup: html
      })
      routeLayer.addGraphic(graphic)

      var allTime = mars3d.Util.formatTime(firstItem.allDuration)
      var allDistance = mars3d.MeasureUtil.formatDistance(firstItem.allDistance)
      let dhHtml = ""
      for (let i = 0; i < firstItem.steps.length; i++) {
        var item = firstItem.steps[i]
        dhHtml += item.instruction + "；"
      }

      eventTarget.fire("analyse", { allTime, allDistance, dhHtml })
    },
    error: function (msg) {
      hideLoading()
      globalAlert(msg)
    }
  })
}

// 点击保存GeoJSON
function saveGeoJSON() {
  if (routeLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  var geojson = routeLayer.toGeoJSON()
  mars3d.Util.downloadFile("导航路径.json", JSON.stringify(geojson))
}
