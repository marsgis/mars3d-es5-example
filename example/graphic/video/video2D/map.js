// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer

let selectedView

// 事件对象，用于抛出事件给面板
var eventTarget = new mars3d.BaseClass()

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.844146, lng: 117.20555, alt: 125, heading: 184, pitch: -17 }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  // 添加参考三维模型
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥国家大学科技园",
    url: "https://data.mars3d.cn/3dtiles/qx-hfdxy/tileset.json",
    position: { alt: 43.7 },
    maximumScreenSpaceError: 1
  })
  map.addLayer(tiles3dLayer)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 2.在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    selectedView = event.graphic
    console.log("监听layer，单击了矢量对象", event)
  })

  // 可在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindPopup("我是layer上绑定的Popup")

  // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphicLayer.removeGraphic(graphic)
        }
      }
    }
  ])

  // 加一些演示数据
  addDemoGraphic1()
  addDemoGraphic3()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// 加载已配置好的视频（此参数为界面上“打印参数”按钮获取的）
function addDemoGraphic1() {
  const video2D = new mars3d.graphic.Video2D({
    position: [117.205459, 31.842988, 64.3],
    style: {
      url: "https://data.mars3d.cn/file/video/duimian.mp4",
      // maskImage: "https://data.mars3d.cn/img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      // vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
      // textureCoordinates: {
      //   positions: [new Cesium.Cartesian2(0, 1), new Cesium.Cartesian2(1, 1), new Cesium.Cartesian2(1, 0), new Cesium.Cartesian2(0, 0)]
      // },
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  // setTimeout(() => {
  //   video2D.setStyle({
  //     url: "https://data.mars3d.cn/file/video/lukou.mp4"
  //   })
  // }, 10000)
}

function addDemoGraphic3() {
  const video3D = new mars3d.graphic.Video2D({
    position: {
      type: "time", // 时序动态坐标
      speed: 60,
      list: [
        [117.210592, 31.842438, 100],
        [117.207898, 31.842374, 100],
        [117.205376, 31.842337, 100],
        [117.204489, 31.842824, 100]
      ]
    },
    style: {
      url: "https://data.mars3d.cn/file/video/menqian.mp4",
      // maskImage: "https://data.mars3d.cn/img/textures/video-mask.png", // 羽化视频四周，融合更美观
      angle: 20,
      angle2: 10,
      heading: 88.5,
      pitch: -90,
      distance: 70,
      showFrustum: true
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(video3D)

  // map.on(mars3d.EventType.mouseMove, function (event) {
  //   if (event.cartesian && video3D.isAdded) {
  //     video3D.position = mars3d.PointUtil.addPositionsHeight(event.cartesian, 10)
  //   }
  // })
}

function getGraphic(graphicId) {
  selectedView = graphicLayer.getGraphicById(graphicId)
  return selectedView
}

// 生成演示数据(测试数据量)
function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.Video2D({
      position,
      style: {
        url: "https://data.mars3d.cn/file/video/duimian.mp4",
        angle: 46.3,
        angle2: 15.5,
        heading: 88.5,
        pitch: 8.2,
        distance: 1178,
        showFrustum: true
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 投射视频
async function startDrawGraphic() {
  // 开始绘制
  const graphic = await graphicLayer.startDraw({
    type: "video2D",
    style: {
      url: "https://data.mars3d.cn/file/video/lukou.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 178.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  console.log("标绘完成", graphic.toJSON())
}

// 按当前相机投射视频
async function startDrawGraphic2() {
  // 取屏幕中心点
  const targetPosition = map.getCenter({ format: false })
  if (!targetPosition) {
    return
  }

  const cameraPosition = Cesium.clone(map.camera.position)

  // 构造投射体
  const video2D = new mars3d.graphic.Video2D({
    position: cameraPosition,
    targetPosition,
    style: {
      url: "https://data.mars3d.cn/file/video/lukou.mp4",
      angle: 46.3,
      angle2: 15.5,
      heading: 88.5,
      pitch: 8.2,
      distance: 78,
      showFrustum: true
    }
  })
  graphicLayer.addGraphic(video2D)

  selectedView = video2D // 记录下
}

// 播放暂停
function playOrpause() {
  selectedView.play = !selectedView.play
}

// 修改水平角度
function onChangeAngle(value) {
  if (selectedView) {
    selectedView.angle = value
  }
}

// 修改垂直角度
function onChangeAngle2(value) {
  if (selectedView) {
    selectedView.angle2 = value
  }
}

// 修改投射距离
function onChangeDistance(value) {
  if (selectedView) {
    selectedView.distance = value
  }
}

// 修改四周距离 value 修改后的数值
function onChangeHeading(value) {
  if (selectedView) {
    selectedView.heading = value
  }
}

//  修改俯仰角数值   value 修改后的数值
function onChangePitch(value) {
  if (selectedView) {
    selectedView.pitch = value
  }
}

//   线框是否显示   isCheckde 修改后的数值
function showFrustum(isCheckde) {
  if (selectedView) {
    selectedView.showFrustum = isCheckde
  }
}

// 修改视频的透明度   opacity 透明度数值
function onChangeOpacity(opacity) {
  if (selectedView) {
    selectedView.setOpacity(opacity)
  }
}

function onChangeMirror(value) {
  if (selectedView) {
    selectedView.flipx = value
  }
}

/**
 * 视频角度
 *
 * @param {number} num 0-360°
 * @returns {void}
 */
function rotateDeg(num) {
  if (selectedView) {
    selectedView.setStyle({ stRotationDegree: num })
  }
}

// 视角定位
function locate() {
  if (selectedView) {
    selectedView.setView()
  }
}

// 打印参数
function printParameters() {
  if (selectedView) {
    const params = selectedView.toJSON()
    console.log(JSON.stringify(params))
  }
}

// 视频位置
async function selCamera() {
  if (!selectedView) {
    return
  }

  if (selectedView.options?.position?.type && selectedView.options.position.type === "time") {
    globalMsg("当前为时序坐标，不支持选点操作")
    return
  }

  const graphic = await map.graphicLayer.startDraw({
    type: "point"
  })
  const point = graphic.coord
  graphic.remove() // 删除绘制的点

  selectedView.position = point
}

// 四周视角选点
async function onClickSelView() {
  if (!selectedView) {
    return
  }
  if (selectedView.options?.position?.type && selectedView.options.position.type === "time") {
    globalMsg("当前为时序坐标，不支持选点操作")
    return
  }

  const graphic = await map.graphicLayer.startDraw({ type: "point" })
  const point = graphic.coord
  graphic.remove() // 删除绘制的点

  selectedView.targetPosition = point
}

// 历史参数转为当前最新版本的参数
// function oldStyle2New(oldStyle) {
//   const camera = new Cesium.Camera(map.scene)
//   camera.position = oldStyle.camera.position
//   camera.direction = oldStyle.camera.direction
//   camera.up = oldStyle.camera.up
//   camera.right = oldStyle.camera.right

//   let angle
//   if (oldStyle.fov) {
//     angle = Cesium.Math.toDegrees(oldStyle.fov / 2)
//   } else if (oldStyle.fovDegree) {
//     angle = oldStyle.fovDegree / 2
//   }

//   return {
//     distance: oldStyle.dis,

//     angle: angle,
//     angle2: angle / oldStyle.aspectRatio,

//     heading: Cesium.Math.toDegrees(camera.heading) - 90,
//     pitch: Cesium.Math.toRadians(camera.pitch),
//     roll: Cesium.Math.toRadians(camera.roll)
//   }
// }
