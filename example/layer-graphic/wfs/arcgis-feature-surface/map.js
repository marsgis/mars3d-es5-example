// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.838348, lng: 117.206494, alt: 752, heading: 359, pitch: -54 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "//data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: -24 },
    maximumScreenSpaceError: 1,
    maximumMemoryUsage: 1024
  })

  const tiles3dLayer2 = new mars3d.layer.ArcGisWfsLayer({
    name: "兴趣点",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/hefei/MapServer/1",
    where: " NAME like '%大学%' ",
    minimumLevel: 15,
    symbol: {
      type: "billboardP",
      styleOptions: {
        image: "img/marker/mark3.png",
        scale: 0.7,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        label: {
          text: "{NAME}",
          font_size: 15,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -30
        }
      }
    },
    popup: "名称：{NAME}<br />地址：{address}",
    show: true
  })

  // 绑定事件
  map.on(mars3d.EventType.load, function (event) {
    console.log("数据加载完成", event)

    map.addLayer(tiles3dLayer)
    map.addLayer(tiles3dLayer2)
  })

  // 绑定回调处理
  const layerPoint = map.getLayer("兴趣点", "name")
  layerPoint.on(mars3d.EventType.addGraphic, function (event) {
    // 添加entity的回调，方便自定义控制。
    updateAutoSurfaceHeight(event.graphic)
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 点的自动贴地处理
function updateAutoSurfaceHeight(graphic) {
  if (!graphic.position) {
    return
  }

  // 点贴模型测试
  let position = graphic.position
  position = mars3d.PointUtil.getSurfaceHeight(map.scene, position, {
    asyn: true, // 是否异步求准确高度
    has3dtiles: true, // 是否先求贴模型上（无模型时改为false，提高效率）
    callback: function (newHeight, cartOld) {
      console.log("原始高度为：" + cartOld.height.toFixed(2) + ",贴地高度：" + newHeight.toFixed(2))

      const positionNew = Cesium.Cartesian3.fromRadians(cartOld.longitude, cartOld.latitude, newHeight)
      graphic.position = positionNew
    }
  })
}