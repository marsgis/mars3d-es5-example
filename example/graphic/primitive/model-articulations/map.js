// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphic
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
  addRockets()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

let model

function addRockets() {
  // // 绑定到UI界面控制参数
  // const viewModel = {
  //   articulations: [],
  //   stages: [],
  //   selectedArticulation: undefined
  // }

  // 创建矢量数据图层
  const graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    let nodeName = event.pickedObject?.detail?.node?._node?.articulationName
    if (nodeName) {
      nodeName = namesCN[nodeName] || nodeName
      globalMsg("单击了构件：" + nodeName)
    }

    console.log("监听layer，单击了矢量对象", event)
  })

  const expandModelShader = new Cesium.CustomShader({
    uniforms: {
      u_drag: {
        type: Cesium.UniformType.VEC2,
        value: new Cesium.Cartesian2(1.0, 1.0) // 从最新拖动中心到鼠标的向量
      }
    },
    vertexShaderText: `
      // 如果鼠标向右拖动，模型就会增长 ， 如果鼠标向左拖动，则模型收缩
      void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput)
      {
          vsOutput.positionMC += 0.1 * u_drag.x * vsInput.attributes.normalMC;
      } `
  })
  bindUpdateModelShader(expandModelShader)

  graphic = new mars3d.graphic.ModelPrimitive({
    position: [113.693, 31.243, 220000],
    style: {
      url: "//data.mars3d.cn/gltf/sample/launchvehicle/launchvehicle.glb",
      scale: 20,
      minimumPixelSize: 128,
      heading: 0,
      customShader: expandModelShader
    }
  })
  graphicLayer.addGraphic(graphic)

  // gltf模型加载完成事件
  graphic.on(mars3d.EventType.load, (event) => {
    model = event.model

    // 缩放区域到模型所在位置
    const controller = map.scene.screenSpaceCameraController
    const r = 2.0 * Math.max(model.boundingSphere.radius, map.camera.frustum.near)
    controller.minimumZoomDistance = r * 0.2

    const center = Cesium.Matrix4.multiplyByPoint(model.modelMatrix, Cesium.Cartesian3.ZERO, new Cesium.Cartesian3())
    const heading = Cesium.Math.toRadians(0.0)
    const pitch = Cesium.Math.toRadians(-10.0)
    map.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, r * 1.5))

    // 设置参数效果
    model.setArticulationStage("LaunchVehicle Pitch", -60) // 火箭整体Pitch角度
    model.setArticulationStage("SRBFlames Size", 1) // 助推器火焰大小
    model.applyArticulations()

    // 读取gltf内的构件信息 cesium 1.97之前版本
    // const articulationsByName = model._runtime.articulationsByName
    // const articulations = Object.keys(articulationsByName).map(function (articulationName) {
    //   return {
    //     name: articulationName,
    //     name_cn: namesCN[articulationName] || articulationName, // 汉化
    //     stages: articulationsByName[articulationName].stages.map(function (stage) {
    //       const stageModel = {
    //         name: stage.name,
    //         name_cn: namesCN[stage.name] || stage.name, // 汉化
    //         minimum: stage.minimumValue,
    //         maximum: stage.maximumValue,
    //         current: stage.currentValue
    //       }
    //       return stageModel
    //     })
    //   }
    // })

    // 读取gltf内的构件信息  cesium 1.97+之后版本
    const articulationsByName = model.sceneGraph._runtimeArticulations
    const articulations = Object.keys(articulationsByName).map(function (articulationName) {
      return {
        name: articulationName,
        name_cn: namesCN[articulationName] || articulationName, // 汉化
        stages: articulationsByName[articulationName]._runtimeStages.map(function (stage) {
          const stageModel = {
            name: stage.name,
            name_cn: namesCN[stage.name] || stage.name, // 汉化
            minimum: stage.minimumValue,
            maximum: stage.maximumValue,
            current: stage.currentValue
          }
          return stageModel
        })
      }
    })

    console.log("完成gltf内的构件信息读取", articulations)

    eventTarget.fire("loadGltfModel", { articulations })
  })
}

// 设置参数效果
function setArticulationStage(groupName, stageName, current) {
  const name = groupName + " " + stageName
  model.setArticulationStage(name, Number(current))
  model.applyArticulations()
}

// 汉化属性名称
const namesCN = {
  // 属性分组
  LaunchVehicle: "火箭整体",
  Fairing: "整流罩",

  UpperStage: "二级部分",
  UpperStageEngines: "二级发动机",
  UpperStageFlames: "二级火焰",

  InterstageAdapter: "级间段",

  Booster: "一级部分",
  BoosterEngines: "一级发动机",
  BoosterFlames: "一级火焰",

  SRBs: "助推器",
  SRBFlames: "助推器火焰",

  // 属性
  MoveX: "X方向移动",
  MoveY: "Y方向移动",
  MoveZ: "Z方向移动",
  Yaw: "Yaw角度",
  Pitch: "Pitch角度",
  Roll: "Roll角度",
  Size: "大小",
  Separate: "分离",
  Drop: "下降",
  Open: "打开",
  Rotate: "旋转"
}

// 鼠标拖动模型,模型散开效果
function bindUpdateModelShader(expandModelShader) {
  let dragActive = false
  const dragCenter = new Cesium.Cartesian2()
  const scratchDrag = new Cesium.Cartesian2()
  map.on(mars3d.EventType.leftDown, function (event) {
    if (!Cesium.defined(event.graphic)) {
      return
    }

    map.scene.screenSpaceCameraController.enableInputs = false

    dragActive = true
    event.position.clone(dragCenter)
  })

  map.on(mars3d.EventType.mouseMove, function (event) {
    if (!dragActive) {
      return
    }
    const drag = Cesium.Cartesian3.subtract(event.endPosition, dragCenter, scratchDrag)
    expandModelShader.setUniform("u_drag", drag)
  })

  map.on(mars3d.EventType.leftUp, function (event) {
    map.scene.screenSpaceCameraController.enableInputs = true
    dragActive = false
  })
}
