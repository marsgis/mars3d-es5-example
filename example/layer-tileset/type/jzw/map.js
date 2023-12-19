// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

let tiles3dLayer
let brightnessEffect
let bloomEffect

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.795446, lng: 117.219725, alt: 1816, heading: 15, pitch: -34 }
    // sceneMode: 2
  },
  layers: [
    {
      type: "geojson",
      name: "道路线",
      url: "//data.mars3d.cn/file/geojson/hefei-road.json",
      symbol: {
        styleOptions: {
          width: 12,
          materialType: "PolylineGlow",
          materialOptions: {
            color: "#FF4500",
            opacity: 0.8,
            glowPower: 0.2
          }
        }
      },
      popup: "{name}",
      zIndex: 20,
      show: true
    },
    {
      type: "geojson",
      name: "河流(面状)",
      url: "//data.mars3d.cn/file/geojson/hefei-water.json",
      symbol: {
        type: "waterC",
        styleOptions: {
          normalMap: "img/textures/waterNormals.jpg", // 水正常扰动的法线图
          frequency: 5000.0, // 控制波数的数字。
          animationSpeed: 0.05, // 控制水的动画速度的数字。
          amplitude: 9.0, // 控制水波振幅的数字。
          specularIntensity: 0.8, // 控制镜面反射强度的数字。
          baseWaterColor: "#00baff", // rgba颜色对象基础颜色的水。#00ffff,#00baff,#006ab4
          blendColor: "#00baff" // 从水中混合到非水域时使用的rgba颜色对象。
          // clampToGround: true,
        }
      },
      popup: "{name}",
      zIndex: 10,
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
  map.basemap = 2017 // 切换到蓝色底图

  // 固定光照时间
  map.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2022-11-01 12:00:00"))
  // map.clock.shouldAnimate = false

  // 固定光照方向
  map.scene.light = new Cesium.DirectionalLight({
    direction: map.scene.camera.direction
  })
  map.camera.percentageChanged = 0.001
  map.on(mars3d.EventType.cameraChanged, function (event) {
    map.scene.light.direction = map.scene.camera.direction
  })

  bloomEffect = new mars3d.effect.BloomEffect({
    enabled: false
  })
  map.addEffect(bloomEffect)

  addbrightnessEffect(1.5)

  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    // projectTo2D: true,
    popup: [
      { field: "objectid", name: "编号" },
      { field: "name", name: "名称" },
      { field: "height", name: "楼高", unit: "米" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

// 开启亮度
function addbrightnessEffect(brightness) {
  brightnessEffect = new mars3d.effect.BrightnessEffect({
    enabled: false,
    brightness
  })
  map.addEffect(brightnessEffect)
}

function setStyleDef() {
  if (tiles3dLayer) {
    tiles3dLayer.remove()
  }
  // 模型
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "合肥市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-hefei/tileset.json",
    maximumScreenSpaceError: 1,
    popup: [
      { field: "objectid", name: "编号" },
      { field: "name", name: "名称" },
      { field: "height", name: "楼高", unit: "米" }
    ]
  })
  map.addLayer(tiles3dLayer)
}

// mars3d 内置marsJzwStyle属性
function setStyle1() {
  tiles3dLayer.customShader = undefined

  tiles3dLayer.marsJzwStyle = true // 打开建筑物特效（内置Shader代码）

  // tiles3dLayer.marsJzwStyle = {
  //   baseHeight: 0.0, // 物体的基础高度，需要修改成一个合适的建筑基础高度
  //   heightRange: 280.0, // 高亮的范围  (baseHeight ~ baseHeight + heightRange)
  //   glowRange: 300.0 // 光环的移动范围
  // }
}

// customShader参数方式
function setStyle2() {
  tiles3dLayer.marsJzwStyle = false
  tiles3dLayer.customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT,
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
      {
        vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置

        // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
        float _baseHeight = 50.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
        float _heightRange = 380.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
        float _glowRange = 400.0; // 光环的移动范围(高度)

        // 建筑基础色
        float mars_height = position.z - _baseHeight;
        float mars_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
        float mars_a12 = mars_height / _heightRange + sin(mars_a11) * 0.1;

        material.diffuse = vec3(0.0, 0.0, 1.0); // 颜色
        material.diffuse *= vec3(mars_a12);// 渐变

        // 动态光环
        float time = fract(czm_frameNumber / 360.0);
        time = abs(time - 0.5) * 2.0;
        float mars_h = clamp(mars_height / _glowRange, 0.0, 1.0);
        float mars_diff = step(0.005, abs(mars_h - time));
        material.diffuse += material.diffuse * (1.0 - mars_diff);
      } `
  })
}

// customShader参数方式 夜景贴图
function setStyle3() {
  tiles3dLayer.marsJzwStyle = false
  tiles3dLayer.customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT,
    varyings: {
      v_mars3d_normalMC: Cesium.VaryingType.VEC3
    },
    uniforms: {
      u_mars3d_texture: {
        value: new Cesium.TextureUniform({
          url: "/img/textures/buildings.png"
        }),
        type: Cesium.UniformType.SAMPLER_2D
      }
    },
    vertexShaderText: /* glsl */ `
    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput){
        v_mars3d_normalMC = vsInput.attributes.normalMC;
      }`,
    fragmentShaderText: /* glsl 如果贴图方向不对，用下面这个 */ `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      vec3 positionMC = fsInput.attributes.positionMC;
      if (dot(vec3(0.0, 0.0, 1.0), v_mars3d_normalMC) > 0.95) {
        //处理楼顶:统一处理成深色。
        material.diffuse = vec3(0.079, 0.107, 0.111);
      } else {
        //处理四个侧面: 贴一样的图
        float mars3d_width = 100.0;
        float mars3d_height = 100.0;
        float mars3d_textureX = 0.0;
        float mars3d_dotXAxis = dot(vec3(0.0, 1.0, 0.0), v_mars3d_normalMC);
        if (mars3d_dotXAxis > 0.52 || mars3d_dotXAxis < -0.52) {
          mars3d_textureX = mod(positionMC.x, mars3d_width) / mars3d_width;
        } else {
          mars3d_textureX = mod(positionMC.y, mars3d_width) / mars3d_width; //positionMC.z
        }
        float mars3d_textureY = mod(positionMC.z, mars3d_height) / mars3d_height; //positionMC.y
        material.diffuse = texture(u_mars3d_texture, vec2(mars3d_textureX, mars3d_textureY)).rgb;
      }
    }`
  })
}

// 颜色改变
function changeColor(color) {
  tiles3dLayer.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", `color("${color}")`]]
    }
  })
}

// 开启泛光
function chkBloom(val) {
  bloomEffect.enabled = val
}

// 开启光照
function chkShadows(val) {
  map.viewer.shadows = val
  if (val) {
    setTimeout(function () {
      // 光照沿着相机方向
      map.scene.shadowMap._lightCamera = map.scene.camera
    }, 500)
  }
}

// 调整亮度
function chkBrightness(val) {
  brightnessEffect.enabled = val
}

function alphaChange(value) {
  brightnessEffect.brightness = value
}
