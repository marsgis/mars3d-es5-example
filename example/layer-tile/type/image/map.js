// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 21.373802, lng: 105.112505, alt: 12964001, heading: 2, pitch: -85 },
    highDynamicRange: false,
    globe: {
      enableLighting: true
    }
  },
  terrain: false,
  control: {
    terrainProviderViewModels: []
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "单张图片",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/bing_img.png",
      type: "image",
      url: "https://data.mars3d.cn/img/map/world/world.jpg"
    },
    {
      name: "夜晚图片",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_night.png",
      type: "image",
      url: "https://data.mars3d.cn/img/map/world/night.jpg",
      dayAlpha: 0.0,
      nightAlpha: 1.0,
      brightness: 3.5
    },
    {
      name: "蓝色底图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/my_blue.png",
      type: "image",
      url: "https://data.mars3d.cn/img/map/world/blue.jpg",
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 叠加的图层
let tileLayer

function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.ImageLayer({
    url: "https://data.mars3d.cn/img/map/radar/201906211112.PNG",
    rectangle: { xmin: 73.16895, xmax: 134.86816, ymin: 12.2023, ymax: 54.11485 },
    alpha: 0.7
  })
  map.addLayer(tileLayer)

  // 图片加载完成事件
  tileLayer.readyPromise.then((layer) => {
    console.log("图片加载完成", layer.image)
  })
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}
