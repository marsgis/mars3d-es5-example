// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = function (option) {
  option.control = {
    toolbar: {
      position: "right-top"
    },
    baseLayerPicker: false // 是否显示图层选择控件
  }
  return option
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const baseLayerPicker = new mars3d.control.BaseLayerPicker({})
  map.addControl(baseLayerPicker)

  map.on(mars3d.EventType.changeBasemap, (event) => {
    console.log("切换了底图，当前底图为", map.basemap)
  })

  // setTimeout(() => {
  //   map.basemap = 2017
  // }, 5000)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 获取自定义底图切换
function getImageryProviderArr() {
  const providerViewModels = []
  let imgModel

  imgModel = new Cesium.ProviderViewModel({
    name: "本地图片",
    tooltip: "本地单张图片",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/offline.png",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "image",
        url: "https://data.mars3d.cn/img/map/world/world.jpg"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "天地图影像",
    tooltip: "天地图全球影像地图服务（国家测绘局）",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
    category: "标准坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_d",
          key: mars3d.Token.tiandituArr
        }),
        mars3d.LayerUtil.createImageryProvider({
          type: "tdt",
          layer: "img_z",
          key: mars3d.Token.tiandituArr
        })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "Bing影像",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/bing_img.png",
    tooltip: "微软提供的高清影像地图",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "bing",
        layer: "Aerial"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "ESRI影像",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/arcgis_img.png",
    tooltip: "ESRI提供的高清影像地图",
    category: "标准坐标系",
    creationFunction: function () {
      return mars3d.LayerUtil.createImageryProvider({
        type: "arcgis",
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      })
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "谷歌影像",
    tooltip: "谷歌影像地图服务",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/google_img.png",
    category: "国测局偏移坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "google", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  imgModel = new Cesium.ProviderViewModel({
    name: "高德影像",
    tooltip: "高德影像地图服务",
    iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/gaode_img.png",
    category: "国测局偏移坐标系",
    creationFunction: function () {
      return [
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_d" }),
        mars3d.LayerUtil.createImageryProvider({ type: "gaode", layer: "img_z" })
      ]
    }
  })
  providerViewModels.push(imgModel)

  return providerViewModels
}

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "无地形",
      tooltip: "WGS84标准球体",
      iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/TerrainEllipsoid.png",
      creationFunction: function () {
        return new Cesium.EllipsoidTerrainProvider({
          ellipsoid: Cesium.Ellipsoid.WGS84
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "全球地形",
      tooltip: "由 Cesium官方 提供的高分辨率全球地形",
      iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/TerrainSTK.png",
      creationFunction: function () {
        return Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "中国地形",
      tooltip: "由 Mars3D 提供的中国国内地形",
      iconUrl: "https://data.mars3d.cn/img/thumbnail/basemap/TerrainSTK.png",
      creationFunction: function () {
        return new Cesium.CesiumTerrainProvider({
          url: "http://data.mars3d.cn/terrain",
          requestWaterMask: true,
          requestVertexNormals: true
        })
      }
    })
  ]
}
