// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let terrainUplift

var mapOptions = {
  scene: {
    center: { lat: 30.827414, lng: 116.378229, alt: 16933, heading: 0, pitch: -56 }
  }
}

var eventTabel = new mars3d.BaseClass()

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  terrainUplift = new mars3d.thing.TerrainUplift({
    upHeight: 2000, // 抬升的高度
    image: "img/textures/poly-land.png",
    // image: "./img/textures/mining.jpg",
    imageBottom: "img/textures/poly-land.png",
    diffHeight: 100,
    splitNum: 80 // 井边界插值数
  })
  map.addThing(terrainUplift)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function addTerrainUplift(height) {
  const areaItem = terrainUplift.addArea(
    [
      [116.334222, 30.899171, 645.46],
      [116.370874, 30.899171, 645.46],
      [116.370874, 30.944509, 645.46],
      [116.334222, 30.944509, 645.46]
    ],
    { diffHeight: height, exact: true }
  )
  addTableItem(areaItem)

  const areaItem2 = terrainUplift.addArea(
    [
      [116.416497, 30.934256, 775.89],
      [116.427392, 30.962941, 1084.88],
      [116.434838, 30.932608, 900.43],
      [116.462994, 30.923081, 771.42],
      [116.437571, 30.916044, 906.39],
      [116.44977, 30.894487, 776.06],
      [116.424183, 30.908752, 727.02],
      [116.402218, 30.898406, 593.08],
      [116.414309, 30.918806, 588.78],
      [116.387022, 30.933539, 700.65]
    ],
    { diffHeight: height, exact: true }
  )
  addTableItem(areaItem2)
}

// 添加矩形
function btnDrawExtent(height) {
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#007be6",
      opacity: 0.8
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.getOutlinePositions(false)
      map.graphicLayer.clear()

      console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 打印下边界

      // 挖地区域
      const areaItem = terrainUplift.addArea(positions, { diffHeight: height })
      addTableItem(areaItem)
    }
  })
}
// 添加多边形
function btnDraw(height) {
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#007be6",
      opacity: 0.5,
      outline: false
    },
    success: function (graphic) {
      // 绘制成功后回调
      const positions = graphic.positionsShow
      map.graphicLayer.clear()

      console.log(JSON.stringify(mars3d.LngLatArray.toArray(positions))) // 打印下边界

      const areaItem = terrainUplift.addArea(positions, { diffHeight: height })
      addTableItem(areaItem)
    }
  })
}

// 清除
function removeAll() {
  terrainUplift.clear() // 清除挖地区域
  table = []
}

function changeClipHeight(val) {
  // terrainUplift.diffHeight = val
}

function changeUpHeight(val) {
  terrainUplift.upHeight = val
}

// 是否挖地
function chkClippingPlanes(val) {
  terrainUplift.enabled = val
}

let table = []
// 区域表格添加一行记录
function addTableItem(item) {
  table.push({ key: item.id, name: "抬升区域" + item.id })

  eventTabel.fire("tableObject", { table })
}
function changeTable(data) {
  table = data
}

// 表格操作
function flyToGraphic(item) {
  const graphic = terrainUplift.getAreaById(item)
  map.flyToPositions(graphic.positions)
}

function deletedGraphic(item) {
  const graphic = terrainUplift.getAreaById(item)
  terrainUplift.removeArea(graphic)
}

function showHideArea(id, selected) {
  if (selected) {
    terrainUplift.showArea(id)
  } else {
    terrainUplift.hideArea(id)
  }
}
