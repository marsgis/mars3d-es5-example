// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
var graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    fxaa: true,
    center: { lat: 30.857163, lng: 116.345129, alt: 926, heading: 33, pitch: -34 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 蓝色底图
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  addDemoGraphic4(graphicLayer)
  addDemoGraphic5(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null

  graphicLayer.remove()
  graphicLayer = null
}

function addDemoGraphic1(graphicLayer) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "警车",
    position: [116.346929, 30.861947, 401.34],
    style: {
      url: "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf",
      scale: 20,
      minimumPixelSize: 50,
      heading: 90,

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 10000,
      distanceDisplayPoint: {
        // 当视角距离超过一定距离(distanceDisplayCondition_far定义的) 后显示为点对象的样式
        color: "#00ff00",
        pixelSize: 8
      },

      label: {
        text: "我是原始的",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -50,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例1" }
  })
  graphicLayer.addGraphic(graphic)

  // 演示个性化处理graphic
  initGraphicManager(graphic)

  // graphic转geojson
  const geojson = graphic.toGeoJSON()
  console.log("转换后的geojson", geojson)
  addGeoJson(geojson, graphicLayer)
}

// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 3.在graphic上绑定监听事件
  // graphic.on(mars3d.EventType.click, function (event) {
  //   console.log("监听graphic，单击了矢量对象", event)
  // })
  // 绑定Tooltip
  // graphic.bindTooltip('我是graphic上绑定的Tooltip') //.openTooltip()

  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">我是graphic上绑定的Popup </th>
            </tr>
            <tr>
              <td>提示：</td>
              <td>这只是测试信息，可以任意html</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])

  // 测试 颜色闪烁
  if (graphic.startFlicker) {
    graphic.startFlicker({
      time: 20, // 闪烁时长（秒）
      maxAlpha: 0.5,
      color: Cesium.Color.YELLOW,
      onEnd: function () {
        // 结束后回调
      }
    })
  }
}

// 添加单个geojson为graphic，多个直接用graphicLayer.loadGeoJSON
function addGeoJson(geojson, graphicLayer) {
  const graphicCopy = mars3d.Util.geoJsonToGraphics(geojson)[0]
  delete graphicCopy.attr
  // 新的坐标
  graphicCopy.position = [116.348587, 30.859472, 373.8]
  graphicCopy.style.label = graphicCopy.style.label || {}
  graphicCopy.style.label.text = "我是转换后生成的"
  graphicLayer.addGraphic(graphicCopy)
}

function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "风机",
    position: [116.35104, 30.86225, 374.4],
    style: {
      url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      heading: 270,
      scale: 30,
      minimumPixelSize: 100,
      runAnimations: false, // 关闭启动动画

      distanceDisplayCondition: true,
      distanceDisplayCondition_near: 0,
      distanceDisplayCondition_far: 9000,
      distanceDisplayBillboard: {
        // 当视角距离超过一定距离(distanceDisplayCondition_far定义的) 后显示为图标对象的样式
        image: "img/marker/square.png",
        scale: 1
      },

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        silhouette: true,
        silhouetteColor: "#00ffff",
        silhouetteSize: 3
      }
    },
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

  // 手动按需启动动画
  graphic.on(mars3d.EventType.load, function (event) {
    console.log("风机 模型加载完成", event)
    const model = event.model

    // 参考API: http://mars3d.cn/api/cesium/ModelAnimationCollection.html
    model.activeAnimations.addAll({
      multiplier: 0.5, // Play at half-speed
      loop: Cesium.ModelAnimationLoop.REPEAT // Loop the animations
    })

    // let animation = model.activeAnimations.add({
    //   index: 0, //第一个叶子
    //   multiplier: 0.5, // Play at double speed
    //   loop: Cesium.ModelAnimationLoop.REPEAT, // Loop the animation
    // });

    // animation.start.addEventListener(function (model, animation) {
    //   console.log("Animation started: " + animation.name);
    // });
    // animation.update.addEventListener(function (model, animation, time) {
    //   console.log("Animation updated: " + animation.name + ". glTF animation time: " + time);
    // });
    // animation.stop.addEventListener(function (model, animation) {
    //   console.log("Animation stopped: " + animation.name);
    // });
  })
}

function addDemoGraphic3(graphicLayer) {
  // const textureUniformShader = new Cesium.CustomShader({
  //   uniforms: {
  //     // 动画的运行时间(以秒为单位)
  //     u_time: {
  //       type: Cesium.UniformType.FLOAT,
  //       value: 1
  //     },
  //     // 用户定义的纹理
  //     u_stripes: {
  //       type: Cesium.UniformType.SAMPLER_2D,
  //       value: new Cesium.TextureUniform({
  //         url: "/img/textures/colors.png"
  //       })
  //     }
  //   },
  //   // 将纹理应用到模型上，但是将纹理坐标移动一点，这样它就变成动画了。
  //   fragmentShaderText: `
  //     void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
  //     {
  //         vec2 texCoord = fsInput.attributes.texCoord_0 + 1.0 * vec2(u_time, 0.0);
  //         material.diffuse = texture(u_stripes, texCoord).rgb;
  //     }
  //     `
  // })
  // // 监听postUpdate，来演示修改uniforms变量
  // const startTime = performance.now()
  // setInterval(() => {
  //   const elapsedTimeSeconds = (performance.now() - startTime) / 1000
  //   textureUniformShader.setUniform("u_time", elapsedTimeSeconds)
  // }, 200)

  const graphic = new mars3d.graphic.ModelPrimitive({
    name: "汽车",
    position: [116.349194, 30.864603, 376.58],
    style: {
      url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
      scale: 0.5,
      minimumPixelSize: 50,
      silhouette: false,
      // customShader: textureUniformShader, // 自定义shader

      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        silhouette: true,
        silhouetteColor: "#ff0000",
        silhouetteSize: 4
      }
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(graphic)
}

function addDemoGraphic4(graphicLayer) {
  const propertyFJ = getSampledPositionProperty([
    [116.341348, 30.875522, 500],
    [116.341432, 30.871815, 500],
    [116.347965, 30.866654, 500],
    [116.352154, 30.855531, 500],
    [116.341181, 30.85326, 500],
    [116.334609, 30.856601, 500],
    [116.337695, 30.866505, 500],
    [116.345018, 30.870448, 500],
    [116.345028, 30.870436, 500]
  ])

  // 飞机
  const graphicModel = new mars3d.graphic.ModelPrimitive({
    position: propertyFJ,
    style: {
      url: "//data.mars3d.cn/gltf/mars/wrj.glb",
      scale: 0.1,
      minimumPixelSize: 20
    },
    frameRate: 1,
    attr: { remark: "示例4" },
    hasEdit: false
  })
  graphicLayer.addGraphic(graphicModel)
}

// 计算演示的SampledPositionProperty轨迹
function getSampledPositionProperty(points) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

  const start = map.clock.currentTime
  const positions = mars3d.LngLatArray.toCartesians(points)
  for (let i = 0; i < positions.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, i * 20, new Cesium.JulianDate())
    const position = positions[i]
    property.addSample(time, position)
  }
  return property
}

function addDemoGraphic5(graphicLayer) {
  // 自定义shader
  const pointCloudWaveShader = new Cesium.CustomShader({
    uniforms: {
      u_time: {
        type: Cesium.UniformType.FLOAT,
        value: 0
      }
    },
    vertexShaderText: `
        void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput)
        {
          // 这个模型的x和y坐标在[0,1]的范围内 方便地加倍作为UV坐标。
          vec2 uv = vsInput.attributes.positionMC.xy;
          // 使点云在空间和时间上都变化的复杂波中波动。振幅是基于点云的原始形状(它已经是一个波浪形表面)。波是相对于模型中心计算的，因此转换从[0,1]-> [- 1,1]-> [0,1]
          float amplitude = 2.0 * vsInput.attributes.positionMC.z - 1.0;
          float wave = amplitude * sin(2.0 * czm_pi * uv.x - 2.0 * u_time) * sin(u_time);
          vsOutput.positionMC.z = 0.5 + 0.5 * wave;
          // 通过改变点的大小，使点脉冲进出
          vsOutput.pointSize = 10.0 + 5.0 * sin(u_time);
        } `,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
            // 把这些点做成圆形而不是方形
            float distance = length(gl_PointCoord - 0.5);
            if (distance > 0.5) {
                discard;
            }
            // 制作一个正弦调色板，沿波的大致方向移动，但速度不同。系数是任意选择的。
            vec2 uv = fsInput.attributes.positionMC.xy;
            material.diffuse = 0.2 * fsInput.attributes.color_0.rgb;
            material.diffuse += vec3(0.2, 0.3, 0.4) + vec3(0.2, 0.3, 0.4) * sin(2.0 * czm_pi * vec3(3.0, 2.0, 1.0) * uv.x - 3.0 * u_time);
        }`
  })
  // 监听postUpdate，来演示修改uniforms变量
  const startTime = performance.now()
  setInterval(() => {
    const elapsedTimeSeconds = (performance.now() - startTime) / 1000
    pointCloudWaveShader.setUniform("u_time", elapsedTimeSeconds)
  }, 200)

  const graphicModel = new mars3d.graphic.ModelPrimitive({
    position: new mars3d.LngLatPoint(116.35265, 30.860337, 364.3),
    style: {
      url: "//data.mars3d.cn/gltf/sample/PointCloudWave/PointCloudWave.glb",
      scale: 30,
      customShader: pointCloudWaveShader
    },
    attr: { remark: "示例5" }
  })
  graphicLayer.addGraphic(graphicModel)
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

    const graphic = new mars3d.graphic.ModelPrimitive({
      position,
      style: {
        url: "//data.mars3d.cn/gltf/mars/qiche.gltf",
        heading: 270,
        scale: 10
      },
      attr: { index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "modelP",
    style: {
      scale: 10,
      url: "//data.mars3d.cn/gltf/mars/firedrill/xiaofangche.gltf"
      // label: {
      //   // 不需要文字时，去掉label配置即可
      //   text: "可以同时支持文字",
      //   font_size: 20,
      //   color: "#ffffff",
      //   outline: true,
      //   outlineColor: "#000000",
      //   pixelOffsetY: -20
      // }
    }
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

// 绑定右键菜单
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
    }
  ])
}
