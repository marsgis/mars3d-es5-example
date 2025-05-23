// 矢量瓦片的目前最佳方案：使用 TileServer GL 开源地图服务工具：https://github.com/maptiler/tileserver-gl
// 它利用 MapLibre GL Native 进行服务器端的矢量图层渲染，将pbf矢量瓦片转为普通瓦片数据后提供通过 WMTS 协议在Mars3D前端进行加载展示。

// import * as mars3d from "mars3d"
// import { PbfolLayer } from "../../../../../public/lib/mars3d/thirdParty/pbf-ol/PbfolLayer.js"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 20.758452, lng: 108.198353, alt: 7733736, heading: 358, pitch: -82 },
    globe: {
      baseColor: "#ffffff"
    },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "OSM开源地图",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/osm.png",
      type: "mvt", // lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js 中定义的类型
      url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
      key: mars3d.Token.mapbox,
      style: "mapbox-streets-v6",
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify("已知问题提示", `(1) mapbox的token已失效，请您自行申请替换mars3d.Token.updateMapbox("key value")。`)

  globalNotify("已知问题提示", `(1) 不支持所有PBF的style类型。(2) 如果部分PBF数据未显示，需要扩展开发对应解析style代码。`)

  // 在lib\mars3d\thirdParty\pbf-ol\PbfolLayer.js 中定义的
  // const pbfLayer = new PbfolLayer({
  //   url: "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}",
  //   key: mars3d.Token.mapbox,
  //   style: "mapbox-streets-v6"
  // })
  // map.addLayer(pbfLayer)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}
