// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

var eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.811646, lng: 117.22232, alt: 842.4, heading: 358.5, pitch: -45 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  graphicLayer = new mars3d.layer.GraphicLayer({
    hasEdit: true,
    isAutoEditing: true // 绘制完成后是否自动激活编辑
  })
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  const editUpdateFun = mars3d.Util.funDebounce(openGraphicOptionsWidget, 500)
  graphicLayer.on([mars3d.EventType.click, mars3d.EventType.drawCreated, mars3d.EventType.editStart, mars3d.EventType.editStyle], editUpdateFun)
  const removeFun = mars3d.Util.funDebounce(closeGraphicOptionsWidget, 500)
  graphicLayer.on(mars3d.EventType.removeGraphic, removeFun)

  // 加载模型列表
  const configUrl = "https://data.mars3d.cn/gltf/list.json"
  mars3d.Util.fetchJson({ url: configUrl })
    .then(function (data) {
      eventTarget.fire("loadModelList", { data })
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  if (graphicLayer) {
    graphicLayer.destroy() // 销毁内部会释放所有事件及数据
    graphicLayer = null
  }

  map = null
}

// 修改样式，修改点，删除点等操作去激活或更新面板
function openGraphicOptionsWidget(e) {
  const graphic = e.graphic
  if (!graphic || graphic.isDestroy || graphic.isDrawing || graphic.isPrivate || graphic.isCombine) {
    return
  }
  eventTarget.fire("updateGraphicOptionsWidget", { graphicId: graphic.id, layerId: graphicLayer.id })
}

function closeGraphicOptionsWidget(e) {
  eventTarget.fire("updateGraphicOptionsWidget", { disable: true })
}

// 绘制模型
async function startDrawModel(styleOptions) {
  const style = mars3d.Util.clone(styleOptions)

  const graphic = await graphicLayer.startDraw({
    type: "model",
    drawShow: true, // 绘制时，是否显示模型，可避免在3dtiles上拾取坐标存在问题。
    style
  })
  console.log("标绘完成", graphic.toJSON())
}

// 深度检测
function chkTestTerrain(val) {
  map.scene.globe.depthTestAgainstTerrain = val
}

function onlyVertexPosition(val) {
  map.onlyVertexPosition = val
}

function deleteAll() {
  graphicLayer.clear()
}

/**
 *打开geojson文件
 *
 * @export
 * @param {FileInfo} file 文件名称
 * @returns {void} 无
 */
function openGeoJSON(file) {
  const fileName = file.name
  const fileType = fileName?.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      const json = this.result
      graphicLayer.loadGeoJSON(json, {
        flyTo: true
      })
    }
  } else if (fileType === "glb" || fileType === "gltf") {
    graphicLayer.clear()
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = function (e) {
      const arrayBuffer = this.result
      const graphic = new mars3d.graphic.ModelPrimitive({
        position: [117.221674, 31.823752, 34.7],
        style: {
          basePath: fileName,
          url: new Uint8Array(arrayBuffer),
          scale: 1,
          minimumPixelSize: 50
        },
        hasEdit: false
      })
      graphicLayer.addGraphic(graphic)

      graphic.flyTo({ radius: 1000 })
    }
  } else {
    globalMsg("暂不支持 " + fileType + " 文件类型的数据！")
  }
}

// 保存文件
function saveGeoJSON() {
  if (graphicLayer.length === 0) {
    globalMsg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toGeoJSON()
  mars3d.Util.downloadFile("模型标绘.json", JSON.stringify(geojson))
}
