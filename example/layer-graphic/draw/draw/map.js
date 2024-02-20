// import * as mars3d from "mars3d"
// // import kgUtil from "kml-geojson"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

var mapOptions = {
  // scene: {
  //   center: { lat: 30.846849, lng: 116.335307, alt: 739, heading: 360, pitch: -45 }
  // },
  control: {
    infoBox: false
  },
  layers: [
    {
      name: "合肥市",
      type: "geojson",
      url: "//data.mars3d.cn/file/geojson/areas/340100_full.json",
      symbol: {
        styleOptions: {
          fill: true,
          randomColor: true, // 随机色
          opacity: 0.3,
          outline: true,
          outlineStyle: {
            color: "#FED976",
            width: 3,
            opacity: 1
          },
          highlight: {
            opacity: 0.9
          }
        }
      },
      popup: "{name}",
      flyTo: true,
      show: true
    }
  ]
}

var eventTarget = new mars3d.BaseClass()

let keyDownCode // 一直按着的键对应的code

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 设置编辑点样式
  // mars3d.DrawUtil.setEditPointStyle(mars3d.EditPointType.Control, {
  //   type: mars3d.GraphicType.billboardP, // 支持设置type指定编辑点类型
  //   image: "img/icon/move.png",
  //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  //   verticalOrigin: Cesium.VerticalOrigin.CENTER
  // })

  graphicLayer = new mars3d.layer.GraphicLayer({
    // isRestorePositions: true,
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
    // drawAddEventType: false,
    // drawEndEventType: mars3d.EventType.rightClick,
    // drawDelEventType: mars3d.EventType.middleClick
  })
  map.addLayer(graphicLayer)

  // 修改文本
  // map.setLangText({
  //   _双击完成绘制: "右击完成绘制",
  //   _右击删除点: "中键单击完成绘制"
  // })

  // map.on(mars3d.EventType.mouseOver, function (event) {
  //   console.log("mouseover")
  // })
  map.on(mars3d.EventType.mouseOut, function (event) {
    map.closeSmallTooltip()
  })

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  // 绑定layer标绘相关事件监听(可以自行加相关代码实现业务需求，此处主要做示例)
  graphicLayer.on(mars3d.EventType.drawStart, function (e) {
    console.log("开始绘制", e)
  })
  graphicLayer.on(mars3d.EventType.drawAddPoint, function (e) {
    console.log("绘制过程中增加了点", e)
  })
  graphicLayer.on(mars3d.EventType.drawRemovePoint, function (e) {
    console.log("绘制过程中删除了点", e)
  })
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    console.log("创建完成", e)
  })
  graphicLayer.on(mars3d.EventType.editStart, function (e) {
    console.log("开始编辑", e)
  })
  graphicLayer.on(mars3d.EventType.editMovePoint, function (e) {
    console.log("编辑修改了点", e)
  })
  graphicLayer.on(mars3d.EventType.editAddPoint, function (e) {
    console.log("编辑新增了点", e)
  })
  graphicLayer.on(mars3d.EventType.editRemovePoint, function (e) {
    console.log("编辑删除了点", e)
  })
  graphicLayer.on(mars3d.EventType.editStop, function (e) {
    console.log("停止编辑", e)
  })
  graphicLayer.on(mars3d.EventType.removeGraphic, function (e) {
    console.log("删除了对象", e)
  })

  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  loadDemoData()

  // map.on(mars3d.EventType.keyup, function (e) {
  //   console.log("按下了键盘", e)

  //   // ESC按键
  //   if (e.keyCode === 27) {
  //     graphicLayer._graphic_drawing._positions_draw.pop() // 删除最后一个点
  //   }
  // })

  // 按键按下
  map.on(mars3d.EventType.keydown, function (e) {
    keyDownCode = e.keyCode // 一直按着的键对应的code
  })

  // 按键按下后释放
  map.on(mars3d.EventType.keyup, function (e) {
    keyDownCode = undefined
  })

  // 自定义提示
  // map.setLangText({
  //   _双击完成绘制: "",
  //   _单击开始绘制: "新的提示内容",
  //   _单击增加点右击删除点: "新的提示内容"
  // })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function drawPoint() {
  // graphicLayer.isContinued = true
  graphicLayer.startDraw({
    type: "point",
    style: {
      pixelSize: 12,
      color: "#3388ff",
      label: {
        // 不需要文字时，去掉label配置即可
        text: "可以同时支持文字",
        font_size: 20,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -20
      }
    }
  })
}

function drawMarker() {
  graphicLayer.startDraw({
    type: "billboard",
    style: {
      image: "img/marker/mark-red.png",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      label: {
        // 不需要文字时，去掉label配置即可
        text: "可以同时支持文字",
        font_size: 26,
        color: "#ffffff",
        outline: true,
        outlineColor: "#000000",
        pixelOffsetY: -60
      }
    }
  })
}

function drawLabel() {
  graphicLayer.startDraw({
    type: "label",
    style: {
      text: "火星科技三维地球",
      color: "#0081c2",
      font_size: 50,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    }
  })
}

function startDrawModel() {
  graphicLayer.startDraw({
    type: "model",
    style: {
      scale: 10,
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche.gltf"
    }
  })
}

function drawPolyline(clampToGround) {
  // map.highlightEnabled = false
  // map.popup.enabled = false

  graphicLayer.startDraw({
    type: "polyline",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    },
    // 绘制时，外部自定义更新坐标,可以自定义处理特殊业务返回修改后的新坐标。
    updateDrawPosition: function (position, graphic) {
      if (keyDownCode === 67) {
        // 按下C键 ,限定在纬度线上
        position = updateDrawPosition(position, graphic.lastDrawPoint, 1)
      } else if (keyDownCode === 86) {
        // 按下V键 ,限定在经度线上
        position = updateDrawPosition(position, graphic.lastDrawPoint, 2)
      }
      return position
    }
    // 外部自定义校验坐标，return false 时坐标无效，不参与绘制
    // validDrawPosition: function (position, graphic) {
    //   const point = mars3d.LngLatPoint.fromCartesian(position)
    //   return (point.lng > 115 && point.lng < 117)
    // }
  })

  // .then(() => {
  //   map.highlightEnabled = true
  //   map.popup.enabled = true
  // })
}

function updateDrawPosition(thisPoint, lastPoint, type) {
  if (!lastPoint || !thisPoint) {
    return thisPoint
  }
  thisPoint = mars3d.LngLatPoint.fromCartesian(thisPoint)
  lastPoint = mars3d.LngLatPoint.fromCartesian(lastPoint)

  if (type === 1) {
    thisPoint.lat = lastPoint.lat
  } else {
    thisPoint.lng = lastPoint.lng
  }
  return thisPoint.toCartesian()
}

function drawBrushLine(clampToGround) {
  graphicLayer.startDraw({
    type: "brushLine",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
}

function drawPolygon(clampToGround) {
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.5,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function drawCurve(clampToGround) {
  graphicLayer.startDraw({
    type: "curve",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      width: 3,
      clampToGround
    }
  })
}

function drawCorridor(clampToGround) {
  graphicLayer.startDraw({
    type: "corridor",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      width: 500,
      clampToGround
    }
  })
}

function drawEllipse(clampToGround) {
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function drawRectangle(clampToGround) {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: clampToGround ? "#ffff00" : "#3388ff",
      opacity: 0.6,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2.0,
      clampToGround
    }
  })
}

function draPlane() {
  graphicLayer.startDraw({
    type: "plane",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      plane_normal: "x",
      dimensions_x: 1000.0,
      dimensions_y: 1000.0
    }
  })
}

function draWall(closure) {
  graphicLayer.startDraw({
    type: "wall",
    style: {
      color: "#00ff00",
      opacity: 0.8,
      diffHeight: 400,
      closure // 是否闭合
    }
  })
}

function drawBox() {
  graphicLayer.startDraw({
    type: "box",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      dimensions_x: 1000.0,
      dimensions_y: 1000.0,
      dimensions_z: 1000.0
    }
  })
}

function drawCylinder() {
  graphicLayer.startDraw({
    type: "cylinder",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6,
      length: 1000
    }
  })
}

function drawEllipsoid() {
  graphicLayer.startDraw({
    type: "ellipsoid",
    style: {
      fill: true,
      color: "#00ff00",
      opacity: 0.6
    }
  })
}

function drawExtrudedPolygon() {
  graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawExtrudedRectangle() {
  graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawExtrudedCircle() {
  graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#00ff00",
      opacity: 0.6,
      diffHeight: 300
    }
  })
}

function drawSatellite() {
  graphicLayer
    .startDraw({
      type: "satellite",
      style: {
        tle1: "1 39150U 13018A   21180.50843864  .00000088  00000-0  19781-4 0  9997",
        tle2: "2 39150  97.8300 252.9072 0018449 344.7422  15.3253 14.76581022440650",
        path_show: true,
        path_color: "#00ff00",
        path_width: 1,
        model_show: true,
        model_url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
        model_scale: 1,
        model_minimumPixelSize: 90
      }
    })
    .then((graphic) => {
      setTimeout(() => {
        graphic.flyToPoint()
      }, 100)
    })
}

// 在图层绑定Popup弹窗
function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr })
  })
}

function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        globalAlert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        globalAlert("该对象的面积为:" + strArea)
      }
    }
  ])
}

function updateonlyVertexPosition(value) {
  map.onlyVertexPosition = value
}

/**
 * 打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件
 * @returns {void} 无
 */
function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let geojson = this.result
      geojson = simplifyGeoJSON(geojson) // 简化geojson的点
      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
    }
  } else if (fileType === "kml") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const strkml = this.result
      kgUtil.toGeoJSON(strkml).then((geojson) => {
        geojson = simplifyGeoJSON(geojson) // 简化geojson的点
        console.log("kml2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, {
          flyTo: true
        })
      })
    }
  } else if (fileType === "kmz") {
    // 加载input文件控件的二进制流
    kgUtil.toGeoJSON(file).then((geojson) => {
      geojson = simplifyGeoJSON(geojson) // 简化geojson的点
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
    })
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

// 简化geojson的坐标
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.000001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// 点击保存GeoJSON
function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("我的标注.json", JSON.stringify(geojson))
}

// 点击保存KML
function saveKML() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }

  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const kml = kgUtil.toKml(geojsonObject, {
    name: "Mars3D标绘数据",
    documentName: "Mars3D标绘数据文件",
    documentDescription: "标绘数据 by mars3d.cn",
    simplestyle: true
  })

  mars3d.Util.downloadFile("我的标注.kml", kml)
}

// 点击保存WKT
function saveWKT() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  let geojsonObject = graphicLayer.toGeoJSON()
  if (geojsonObject == null) {
    return null
  }
  geojsonObject = JSON.parse(JSON.stringify(geojsonObject))

  const arrWKT = []
  let index = 0
  geojsonObject.features.forEach((feature) => {
    const attr = feature.properties
    const style = feature.properties.style

    const wkt = Terraformer.WKT.convert(feature.geometry) // geojson转换WKT格式 ,terraformer库
    arrWKT.push({
      id: ++index,
      name: attr.name || "",
      remark: attr.remark || "",
      style,
      wkt
    })
  })
  mars3d.Util.downloadFile("我的标注wkt.txt", JSON.stringify(arrWKT))
}

// 加载演示数据
function loadDemoData() {
  // if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  //   // 本地不显示历史数据
  //   return
  // }

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/geojson/mars3d-draw.json" }).then(function (json) {
    graphicLayer.loadGeoJSON(json, { clear: true, flyTo: true })
  })
}
