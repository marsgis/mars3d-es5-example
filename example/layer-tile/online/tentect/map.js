// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

const creditHtml = `©2023 Tencent - <span>审图号：GS(2023)1号</span>
- <a target="_blank" href="https://lbs.qq.com/terms.html">服务条款</a>`

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.82034, lng: 117.411297, alt: 56459, heading: 0, pitch: -87 },
    highDynamicRange: false
  },
  // 方式1：在创建地球前的参数中配置
  basemaps: [
    {
      name: "腾讯电子",
      icon: "img/basemaps/gaode_vec.png",
      type: "tencent",
      layer: "vec",
      show: true,
      credit: creditHtml
    },
    {
      name: "腾讯影像",
      icon: "img/basemaps/gaode_img.png",
      type: "group",
      layers: [
        { name: "底图", type: "tencent", layer: "img_d" },
        { name: "注记", type: "tencent", layer: "img_z" }
      ],
      credit: creditHtml
    },
    {
      name: "腾讯深蓝色",
      icon: "img/basemaps/bd-c-midnight.png",
      type: "tencent",
      layer: "custom",
      style: "4",
      credit: creditHtml
    }
  ]
}

var eventTarget = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  addCreditDOM()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  removeCreditDOM()
  map = null
}

// 叠加的图层
let tileLayer

function addTileLayer() {
  removeTileLayer()

  // 方式2：在创建地球后调用addLayer添加图层(直接new对应type类型的图层类)
  tileLayer = new mars3d.layer.TencentLayer({
    layer: "custom",
    style: "4"
  })
  map.addLayer(tileLayer)
}

function removeTileLayer() {
  if (tileLayer) {
    map.removeLayer(tileLayer, true)
    tileLayer = null
  }
}

// 在下侧状态栏增加一个额外div展示图层版权信息
let creditDOM
function addCreditDOM() {
  const locationBar = map.controls.locationBar?.container
  if (locationBar) {
    creditDOM = mars3d.DomUtil.create("div", "mars3d-locationbar-content mars3d-locationbar-autohide", locationBar)
    creditDOM.style["pointer-events"] = "all"
    creditDOM.style.float = "left"
    creditDOM.style.marginLeft = "20px"

    creditDOM.innerHTML = map.basemap?.options?.credit || ""

    map.on(mars3d.EventType.changeBasemap, function (event) {
      creditDOM.innerHTML = event.layer?.options?.credit || ""
    })
  }
}
function removeCreditDOM() {
  if (creditDOM) {
    mars3d.DomUtil.remove(creditDOM)
    creditDOM = null
  }
}
