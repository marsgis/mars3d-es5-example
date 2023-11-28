// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.675177, lng: 117.323257, alt: 81193, heading: 0, pitch: -79 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "mapbox影像图",
      icon: "img/basemaps/mapboxSatellite.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0adkar2b0e19mv9tpiewld",
      token: mars3d.Token.mapbox,
      show: true
    },
    {
      name: "mapbox街道图",
      icon: "img/basemaps/mapboxStreets.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a0ire3jvh19r92vwfau1e",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox基础底图",
      icon: "img/basemaps/mapboxTerrain.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki09kw472a8j19mvog00aoe0",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox黑色底图",
      icon: "img/basemaps/bd-c-dark.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a2mtc2vyo1bqu76p8ks8m",
      token: mars3d.Token.mapbox
    },
    {
      name: "mapbox灰色底图",
      icon: "img/basemaps/bd-c-grayscale.png",
      type: "mapbox",
      username: "marsgis",
      styleId: "cki0a92b123qo1aluk0e5v7sb",
      token: mars3d.Token.mapbox
    }
  ]
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

  globalNotify(
    "已知问题提示",
    `(1) mapbox的token已失效，请您自行申请替换mars3d.Token.updateMapbox("key value")。`
  )

}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer
function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.MapboxLayer({
    username: "marsgis",
    styleId: "cki0a92b123qo1aluk0e5v7sb",
    token: mars3d.Token.mapbox
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
