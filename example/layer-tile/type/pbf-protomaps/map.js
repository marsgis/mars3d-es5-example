// // // // import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.794987, lng: 117.22661, alt: 4142.1, heading: 356.4, pitch: -60.8 }
  },
  // 方式1：在创建地球前的参数中配置
  layers: [
    {
      name: "矢量瓦片图层",
      icon: "img/basemaps/osm.png",
      type: "arcgis-pbf", //  \lib\mars3d\thirdParty\pbf-protomaps\ArcGISPbfLayer.js 中定义的类型
      url: "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
      styleUrl: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json",
      show: true
    }
  ]
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2023
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}
