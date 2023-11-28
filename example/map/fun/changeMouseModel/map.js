// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  control: {
    mouseDownView: {
      rightDrag: true
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

  // 限定pitch角度： max ，min(默认-90)
  map.setPitchRange(-10)

  // 设置鼠标操作习惯,更换中键和右键
  map.changeMouseModel(true)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function shadingMaterials(val) {
  if (val === 1) {
    // 设置鼠标操作习惯,更换中键和右键
    map.changeMouseModel(true)
  } else {
    map.changeMouseModel(false)
  }
}


// 解除ALT按键的操作
// const getInputAction_old = Cesium.ScreenSpaceEventHandler.prototype.getInputAction
// Cesium.ScreenSpaceEventHandler.prototype.getInputAction = function (type, modifier) {
//   if (modifier === Cesium.KeyboardEventModifier.ALT) {
//     modifier = undefined
//   }
//   return getInputAction_old.bind(this)(type, modifier)
// }
