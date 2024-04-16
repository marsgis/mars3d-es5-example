// import * as mars3d from "mars3d"

var map
let graphicLayer
let terrainClip

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并)
var mapOptions = {
  scene: {
    center: { lat: 30.773023, lng: 116.473055, alt: 133111.3, heading: 40.4, pitch: -47.9 },
    orderIndependentTranslucency: false,
    backgroundImage: "url(/img/tietu/backGroundImg.jpg)",
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
    }
  },
  control: {
    baseLayerPicker: true
  },
  terrain: { show: false }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017

  // 添加矢量图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // graphicLayer 图层下的所有矢量数据都会触发该事件
  graphicLayer.on(mars3d.EventType.click, (event) => {
    const attr = event.graphic?.attr
    if (attr) {
      globalMsg(attr.name + ":" + attr.adcode)
    }
  })

  // map.scene.debugShowFramesPerSecond = true

  terrainClip = new mars3d.thing.TerrainClip({
    image: false,
    splitNum: 80 // 井边界插值数
  })
  map.addThing(terrainClip)

  mars3d.Util.fetchJson({ url: "http://data.mars3d.cn/file/geojson/areas/340100.json" })
    .then(function (geojson) {
      const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson
      const options = arr[0]

      terrainClip.addArea(options.positions, { simplify: { tolerance: 0.002 } })
      terrainClip.clipOutSide = true

      const polylineGraphic = new mars3d.graphic.PolylineEntity({
        positions: options.positions,
        style: {
          width: 10,
          color: "#b3e0ff",
          depthFail: false,
          materialType: mars3d.MaterialType.PolylineGlow,
          materialOptions: {
            color: "#b3e0ff",
            glowPower: 0.3,
            taperPower: 1.0
          }
        }
      })
      graphicLayer.addGraphic(polylineGraphic)

      const wall = new mars3d.graphic.WallPrimitive({
        positions: options.positions,
        style: {
          setHeight: -20000,
          diffHeight: 20000, // 墙高
          width: 10,
          materialType: mars3d.MaterialType.Image2,
          materialOptions: {
            image: "./img/textures/fence-top.png",
            color: "#0b88e3"
          }
        }
      })
      graphicLayer.addGraphic(wall)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  mars3d.Util.fetchJson({ url: "http://data.mars3d.cn/file/geojson/areas/340100_full.json" }).then(function (geojson) {
    const arr = mars3d.Util.geoJsonToGraphics(geojson) // 解析geojson
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      const attr = item.attr // 属性信息

      const graphic = new mars3d.graphic.PolylinePrimitive({
        positions: item.positions,
        style: {
          color: "rgba(255,255,255,0.3)",
          depthFail: true,
          width: 2
        },
        attr
      })
      graphicLayer.addGraphic(graphic)

      addCenterGraphi(attr)
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addCenterGraphi(attr) {
  const circleGraphic = new mars3d.graphic.CircleEntity({
    position: new mars3d.LngLatPoint(attr.centroid[0], attr.centroid[1], 100),
    style: {
      radius: 5000,
      materialType: mars3d.MaterialType.CircleWave,
      materialOptions: {
        color: "#0b88e3",
        count: 2,
        speed: 10
      }
    },
    attr
  })
  graphicLayer.addGraphic(circleGraphic)

  const divGraphic = new mars3d.graphic.DivGraphic({
    position: attr.centroid,
    style: {
      html: `<div class="mars-four-color mars3d-animation">
                <img src="${getImage()}"  class="four-color_bg"></img>
                <div class="four-color_name">${attr.name}</div>
            </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      clampToGround: true
    },
    attr
  })
  graphicLayer.addGraphic(divGraphic)
}

// 简化geojson的坐标
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.009, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// 根据随机数字取图片
function getImage() {
  const num = Math.floor(Math.random() * 5)
  switch (num) {
    case 1:
      return "/img/icon/map-title-y.png"
    case 2:
      return "/img/icon/map-title-h.png"
    case 3:
      return "/img/icon/map-title-o.png"
    case 4:
      return "/img/icon/map-title-r.png"
    default:
      return "/img/icon/map-title-b.png"
  }
}
