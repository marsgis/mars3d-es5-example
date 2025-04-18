// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.931953, lng: 117.352307, alt: 207201, heading: 0, pitch: -64 }
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "ArcGIS影像",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/arcgis_img.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      enablePickFeatures: false,
      czm: true,
      show: true
    },
    {
      name: "ArcGIS电子街道",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/arcgis_vec.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "ArcGIS NatGeo",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/google_vec.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
      enablePickFeatures: false
    },
    {
      name: "蓝色底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_blue.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02,
      invertColor: true,
      filterColor: "#4e70a6",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0
    },
    {
      name: "灰色底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_dark.png",
      type: "arcgis",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false,
      chinaCRS: mars3d.ChinaCRS.GCJ02,
      invertColor: true,
      filterColor: "#909090",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0
    }
  ],
  layers: [
    {
      name: "合肥市",
      type: "geojson",
      url: "https://data.mars3d.cn/file/geojson/areas/340100_full.json",
      allowDrillPick: true, // 允许穿透，wms可以正常popup
      symbol: {
        styleOptions: {
          fill: true,
          color: "#ffffff",
          opacity: 0.1,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 500000,
          distanceDisplayCondition_near: 0,
          outline: true,
          outlineStyle: {
            color: "#FED976",
            width: 3,
            opacity: 1
          },
          label: {
            // 面中心点，显示文字的配置
            text: "{name}", // 对应的属性名称
            opacity: 1,
            font_size: 40,
            color: "#ffffff",

            font_family: "楷体",
            outline: true,
            outlineColor: "#000000",
            outlineWidth: 3,

            background: false,
            backgroundColor: "#000000",
            backgroundOpacity: 0.1,

            font_weight: "normal",
            font_style: "normal",

            scaleByDistance: true,
            scaleByDistance_far: 20000000,
            scaleByDistance_farValue: 0.1,
            scaleByDistance_near: 1000,
            scaleByDistance_nearValue: 1,

            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 200000,
            distanceDisplayCondition_near: 0,
            visibleDepth: false
          }
        }
      },
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  addTileLayer()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 如需转义 layerDefs 花括号
// Cesium.Resource.ReplaceUrl = function (url) {
//   if (url.startsWith("http://server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer")) {
//     return url.replace(/\{/gm, "%200").replace(/\}/gm, "%20")
//   } else {
//     return url
//   }
// }

// 叠加的图层
let arcGisLayer
function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  arcGisLayer = new mars3d.layer.ArcGisLayer({
    name: "合肥建筑物",
    url: "//server.mars3d.cn/arcgis/rest/services/mars/guihua/MapServer",
    // layerDefs: `{ 0: "用地编号 = 'R2'" }`,

    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4326/MapServer',
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4490/MapServer', //大地2000地理坐标系
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw4548/MapServer', //大地2000高斯投影坐标系
    // url: '//server.mars3d.cn/arcgis/rest/services/crs/ssjzw2000/MapServer',  //大地2000高斯投影坐标系
    // usePreCachedTilesIfAvailable: false, //大地2000高斯投影坐标系时，如果是瓦片，请打开此参数
    highlight: {
      clampToGround: true,
      fill: true,
      color: "#2deaf7",
      opacity: 0.6,
      outline: true,
      outlineWidth: 3,
      outlineColor: "#e000d9",
      outlineOpacity: 1.0
    },
    popup: "all",
    popupOptions: {
      showNull: true
    },
    flyTo: true
  })
  map.addLayer(arcGisLayer)

  // 绑定事件
  arcGisLayer.on(mars3d.EventType.loadConfig, function (event) {
    console.log("加载完成服务信息", event)
  })

  arcGisLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })
}

function removeTileLayer() {
  if (arcGisLayer) {
    map.removeLayer(arcGisLayer, true)
    arcGisLayer = null
  }
}

// 特别的自定义参数的加载方式。
// function addTileLayer2() {
//   arcGisLayer = new mars3d.layer.XyzLayer({
//     url: "http://218.94.6.92:6080/arcgis/rest/services/jssl_vector_map_2023/MapServer/tile/{custom_z}/{y}/{x}",
//     // minimumLevel: 4,
//     // maximumLevel: 18,
//     customTags: {
//       custom_z: function (imageryProvider, x, y, level) {
//         return level - 3
//       }
//     },
//     flyTo: true
//   })
//   map.addLayer(arcGisLayer)
// }
