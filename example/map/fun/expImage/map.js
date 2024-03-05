// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 30.309522, lng: 116.275765, alt: 69659, heading: 0, pitch: -45 },
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true // 截图是黑色时，需要将该项设置为true
      }
    }
  },
  layers: [
    {
      type: "geojson",
      name: "示例数据",
      url: "//data.mars3d.cn/file/geojson/mars3d-draw.json",
      popup: "{type} {name}",
      show: true
    },
    {
      type: "3dtiles",
      name: "测试模型",
      url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 116.313536, lat: 31.217297, alt: 80 },
      scale: 100,
      show: true
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

  // 三维模型
  const tilesetLayer = new mars3d.layer.TilesetLayer({
    url: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    position: { alt: 38.8 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tilesetLayer)

  globalNotify(
    "已知问题提示",
    `(1)含DIV部分下载 功能，因当前示例特殊机制使用了iframe，且浏览器安全性要求无法下载，可以本地运行或无ifarme项目中正常使用；
    `
  )

  // 创建DIV数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  addGraphic_06(graphicLayer)
  addGraphic_08(graphicLayer)
  addGraphic_09(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 查看场景出图
function showMapImg(options = {}) {
  return map.expImage({ download: false, ...options }).then((result) => {
    return result.image
  })
}

// 下载场景出图
function downLoad() {
  map.expImage()
}

// 下载场景缩略图
function downLoad2() {
  map.expImage({
    height: 300, // 指定 高度 或 宽度(指定1种就行，对应的自动缩放)
    // width: 300, //同时指定后去裁剪中间部分
    download: true
  })
}

async function downLoadDiv() {
  // 地图DIV的webgl
  const mapImg = await map.expImage({ download: false })
  console.log("downLoadDiv：1. 地图部分截图成功")

  const filterNode = map.container.getElementsByClassName("cesium-viewer-cesiumWidgetContainer")

  // 其他部分DIV，使用 lib/dom2img/dom-to-image.js
  const divImg = await window.domtoimage.toPng(map.container, {
    filter: function (node) {
      return node !== filterNode[0]
    }
  })
  console.log("downLoadDiv：2.DIV部分截图成功")

  // 其他部分DIV，使用 lib/dom2img/html2canvas.js
  // const divImg = await window.html2canvas(map.container, {
  //   ignoreElements: function (node) {
  //     return node !== filterNode[0]
  //   },
  //   backgroundColor: null,
  //   allowTaint: true
  // })
  // console.log("downLoadDiv：2.DIV部分截图成功")

  // 合并
  const newImg = await mergeImage(mapImg.image, divImg, mapImg.width, mapImg.height)
  console.log("downLoadDiv：3.合并2个图片完成")

  mars3d.Util.downloadBase64Image("场景出图_含DIV.png", newImg) // 下载图片
}

// 合并2张图片
function mergeImage(base1, base2, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const image = new Image() // MAP图片
    image.crossOrigin = "Anonymous" // 支持跨域图片
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height)

      const image2 = new Image() // div图片
      image2.crossOrigin = "Anonymous" // 支持跨域图片
      image2.onload = () => {
        ctx.drawImage(image2, 0, 0, width, height)

        // 合并后的图片
        const base64 = canvas.toDataURL("image/png")
        resolve(base64)
      }
      image2.src = base2
    }
    image.src = base1
  })
}

// 内置扩展的动态文本 DivBoderLabel
function addGraphic_06(graphicLayer) {
  const graphic = new mars3d.graphic.DivBoderLabel({
    position: [116.460722, 31.140888, 781],
    style: {
      text: "火星科技Mars3D平台",
      font_size: 15,
      font_family: "微软雅黑",
      color: "#ccc",
      boderColor: "#15d1f2"
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 类似popup/toolitp的自定义html
function addGraphic_08(graphicLayer) {
  const graphic = new mars3d.graphic.Popup({
    position: [116.146461, 31.380152, 395.1],
    style: {
      html: `这里可以放入任意html代码<br /> Popup和Tooltip也是继承自DivGraphic`,
      closeButton: false,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示

      // 高亮时的样式
      highlight: {
        type: mars3d.EventType.click,
        className: "mars-popup-highlight"
      }
    }
  })
  graphicLayer.addGraphic(graphic)
}

// 倾斜指向左下角的面板样式
function addGraphic_09(graphicLayer) {
  const graphic = new mars3d.graphic.DivGraphic({
    position: [116.138686, 31.101009, 1230],
    style: {
      html: `<div class="marsTiltPanel marsTiltPanel-theme-red">
          <div class="marsTiltPanel-wrap">
              <div class="area">
                  <div class="arrow-lt"></div>
                  <div class="b-t"></div>
                  <div class="b-r"></div>
                  <div class="b-b"></div>
                  <div class="b-l"></div>
                  <div class="arrow-rb"></div>
                  <div class="label-wrap">
                      <div class="title">火星水厂</div>
                      <div class="label-content">
                          <div class="data-li">
                              <div class="data-label">实时流量：</div>
                              <div class="data-value"><span id="lablLiuliang" class="label-num">39</span><span class="label-unit">m³/s</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水池液位：</div>
                              <div class="data-value"><span id="lablYeWei"  class="label-num">10.22</span><span class="label-unit">m</span>
                              </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">水泵状态：</div>
                              <div class="data-value">
                                <span id="lablSBZT1"  class="label-tag data-value-status-1" title="中间状态">1号</span>
                                <span id="lablSBZT2"  class="label-tag data-value-status-0" title="关闭状态">2号</span>
                                </div>
                          </div>
                          <div class="data-li">
                              <div class="data-label">出水阀门：</div>
                              <div class="data-value">
                                <span id="lablCSFM1"   class="label-tag data-value-status-1" title="中间状态">1号</span>
                                <span id="lablCSFM2"   class="label-tag data-value-status-2" title="打开状态">2号</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="b-t-l"></div>
              <div class="b-b-r"></div>
          </div>
          <div class="arrow" ></div>
      </div>`,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
      clampToGround: true
    },
    attr: { remark: "示例9" },
    pointerEvents: false // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
  })
  graphicLayer.addGraphic(graphic)

  // 刷新局部DOM,不影响面板的其他控件操作
  // [建议读取到后端接口数据后主动去修改DOM，比下面演示的实时刷新效率高些]
  graphic.on(mars3d.EventType.popupRender, function (event) {
    const container = event.container // popup对应的DOM

    const lablLiuliang = container.querySelector("#lablLiuliang")
    if (lablLiuliang) {
      lablLiuliang.innerHTML = (Math.random() * 100).toFixed(0) // 测试的随机数
    }

    const lablYeWei = container.querySelector("#lablYeWei")
    if (lablYeWei) {
      lablYeWei.innerHTML = mars3d.Util.formatDate(new Date(), "ss.S") // 测试的随机数
    }
  })
}
