// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 31.830035, lng: 117.159801, alt: 409, heading: 41, pitch: 0 },
    showSkyAtmosphere: false, // 需要关闭
    skyBox: {
      type: "ground",
      sources: {
        positiveX: "/img/skybox_near/qingtian/rightav9.jpg",
        negativeX: "/img/skybox_near/qingtian/leftav9.jpg",
        positiveY: "/img/skybox_near/qingtian/frontav9.jpg",
        negativeY: "/img/skybox_near/qingtian/backav9.jpg",
        positiveZ: "/img/skybox_near/qingtian/topav9.jpg",
        negativeZ: "/img/skybox_near/qingtian/bottomav9.jpg"
      }
    }
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
  // map.scene.skyAtmosphere.show = false
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function sunny() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "/img/skybox_near/qingtian/rightav9.jpg",
      negativeX: "/img/skybox_near/qingtian/leftav9.jpg",
      positiveY: "/img/skybox_near/qingtian/frontav9.jpg",
      negativeY: "/img/skybox_near/qingtian/backav9.jpg",
      positiveZ: "/img/skybox_near/qingtian/topav9.jpg",
      negativeZ: "/img/skybox_near/qingtian/bottomav9.jpg"
    }
  })
}

function sunsetGlow() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "/img/skybox_near/wanxia/SunSetRight.png",
      negativeX: "/img/skybox_near/wanxia/SunSetLeft.png",
      positiveY: "/img/skybox_near/wanxia/SunSetFront.png",
      negativeY: "/img/skybox_near/wanxia/SunSetBack.png",
      positiveZ: "/img/skybox_near/wanxia/SunSetUp.png",
      negativeZ: "/img/skybox_near/wanxia/SunSetDown.png"
    }
  })
}

function blueSky() {
  // map.scene.skyBox = new mars3d.GroundSkyBox({
  //   sources: {
  //     positiveX: "/img/skybox_near/lantian/Right.jpg",
  //     negativeX: "/img/skybox_near/lantian/Left.jpg",
  //     positiveY: "/img/skybox_near/lantian/Front.jpg",
  //     negativeY: "/img/skybox_near/lantian/Back.jpg",
  //     positiveZ: "/img/skybox_near/lantian/Up.jpg",
  //     negativeZ: "/img/skybox_near/lantian/Down.jpg"
  //   }
  // })

  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: {
        type: "ground",
        sources: {
          positiveX: "/img/skybox_near/lantian/Right.jpg",
          negativeX: "/img/skybox_near/lantian/Left.jpg",
          positiveY: "/img/skybox_near/lantian/Front.jpg",
          negativeY: "/img/skybox_near/lantian/Back.jpg",
          positiveZ: "/img/skybox_near/lantian/Up.jpg",
          negativeZ: "/img/skybox_near/lantian/Down.jpg"
        }
      }
    }
  })
}

function defaultSky() {
  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: { type: "default" }
    }
  })
}
