// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // smallTooltip是一种简易的tooltip，目前标绘中用到的就是smallTooltip
  // map.smallTooltip.direction = true; //改变方向到左侧显示

  // 关闭tooltip
  map.closeSmallTooltip()

  map.mouseEvent.enabledMoveDelay = false
  map.on(mars3d.EventType.mouseMove, (event) => {
    map.openSmallTooltip(event.windowPosition, "可以放任意html信息")
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

/**
 * 禁用和启用tooltip
 *
 * @param {boolean} enabled 组件面板传入的值
 * @returns {void} 无
 */
function enabledSmallTooltip(enabled) {
  map.smallTooltip.enabled = enabled
}
