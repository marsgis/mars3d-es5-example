// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

let lineLayer // 矢量图层对象,用于graphic绑定展示
let tilesetLayer // 3dtiles模型；添加模型选择

var mapOptions = {
  scene: {
    center: { lat: 34.215539, lng: 108.959582, alt: 817, heading: 2, pitch: -46 }
  }
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
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  globalNotify("已知问题提示", `(1) 目前不支持所有类型3dtile数据，请替换url进行自测`)

  // 创建矢量数据图层
  lineLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(lineLayer)

  showDytDemo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function showDytDemo() {
  removeLayer()

  // 加模型
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "大雁塔",
    url: "//data.mars3d.cn/3dtiles/qx-dyt/tileset.json",
    position: { lng: 108.963363, lat: 34.221298, alt: -27 },
    maximumScreenSpaceError: 1,

    // 可传入TilesetFlat构造参数，下面是演示压平区域
    flat: {
      area: [
        {
          positions: [
            [108.962938, 34.221141, 402.4],
            [108.963847, 34.221141, 402.4],
            [108.963847, 34.221868, 402.4],
            [108.962938, 34.221868, 402.4]
          ]
        }
      ],
      editHeight: 420 // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

function showTehDemo() {
  removeLayer()

  // 以下数据为cesiumlab v3处理，目前其材质有做偏移处理，不知道内部逻辑及具体值，无法平整压平。
  tilesetLayer = new mars3d.layer.TilesetLayer({
    name: "合肥天鹅湖",
    url: "//data.mars3d.cn/3dtiles/qx-teh/tileset.json",
    position: { lng: 117.218434, lat: 31.81807, alt: 163 },
    editHeight: -130.0, // 相对高度 (单位：米)，基于 压平/淹没区域 最低点高度的偏移量
    maximumScreenSpaceError: 16,
    dynamicScreenSpaceError: true,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 31.795308, lng: 117.21948, alt: 1820, heading: 0, pitch: -39 },
    flat: {
      enabled: true
    },
    flyTo: true
  })
  map.addLayer(tilesetLayer)

  // tilesetLayer.flat是TilesetFlat对象，因为与模型是1对1关系，已经内置进去
  tilesetLayer.flat.on(mars3d.EventType.addItem, onAddFlatArea)
}

// 添加了压平区域后的回调事件
function onAddFlatArea(event) {
  const areaObj = event.area
  areaObj.lineId = addTestLine(areaObj.positions)

  // 触发自定义事件 addItem
  eventTarget.fire("addItem", event)
}

function removeLayer() {
  if (tilesetLayer) {
    map.removeLayer(tilesetLayer, true)
    tilesetLayer = null
  }
}

// 添加矩形
function btnDrawExtent(height) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.2,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.flat.addArea(positions, { height: height })
    }
  })
}
// 绘制多边形
function btnDraw(height) {
  map.graphicLayer.clear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log("绘制坐标为", JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 方便测试拷贝坐标

      tilesetLayer.flat.addArea(positions, { height: height })
    }
  })
}
// 清除
function removeAll() {
  tilesetLayer.flat.clear()

  map.graphicLayer.clear()
  lineLayer.clear()
}

// 改变压平的高度
function changeFlatHeight(val) {
  tilesetLayer.flat.updateHeight(val)
}

// 是否显示测试边界线
function chkShowLine(val) {
  lineLayer.show = val
}

function showHideArea(id, selected) {
  if (selected) {
    tilesetLayer.flat.showArea(id)
  } else {
    tilesetLayer.flat.hideArea(id)
  }
}

// 定位至模型
function flyToGraphic(item) {
  const graphic = tilesetLayer.flat.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

// 删除模型
function deletedGraphic(areaId, lineId) {
  tilesetLayer.flat.removeArea(areaId)

  const graphicLine = lineLayer.getGraphicById(lineId)
  lineLayer.removeGraphic(graphicLine)
}

function addTestLine(positions) {
  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      closure: true,
      color: "#ffffff",
      opacity: 0.8,
      width: 2,
      clampToGround: true
    }
  })
  lineLayer.addGraphic(graphic)

  // const graphic = new mars3d.graphic.PolygonEntity({
  //   positions: positions,
  //   style: {
  //     materialType: mars3d.MaterialType.Image,
  //     materialOptions: {
  //       image: "img/textures/poly-soil.jpg",
  //       opacity: 0.8 // 透明度
  //     },
  //     clampToGround: true
  //   }
  // })
  // lineLayer.addGraphic(graphic)

  return graphic.id
}
