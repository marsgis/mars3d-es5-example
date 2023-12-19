"use script" //开发环境建议开启严格模式

// 在图层绑定Popup弹窗
function bindLayerPopup2() {
  graphicLayer.bindPopup(
    function (event) {
      const attr = getAttrForEvent(event)
      attr["类型"] = event.graphic?.type
      attr["来源"] = "我是layer上绑定的Popup"
      attr["备注"] = "我支持鼠标交互"

      return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })

      // return new Promise((resolve) => {
      //   //这里可以进行后端接口请求数据，setTimeout测试异步
      //   setTimeout(() => {
      //     resolve('Promise异步回调显示的弹窗内容信息')
      //   }, 2000)
      // })
    },
    { pointerEvents: true }
  )
}

// 绑定右键菜单
function bindLayerContextMenu2() {
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
    },
    {
      text: "计算长度",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "polyline" ||
          graphic.type === "polylineP" ||
          graphic.type === "curve" ||
          graphic.type === "curveP" ||
          graphic.type === "polylineVolume" ||
          graphic.type === "polylineVolumeP" ||
          graphic.type === "corridor" ||
          graphic.type === "corridorP" ||
          graphic.type === "wall" ||
          graphic.type === "wallP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        haoutil.alert("该对象的长度为:" + strDis)
      }
    },
    {
      text: "计算周长",
      icon: "fa fa-medium",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strDis = mars3d.MeasureUtil.formatDistance(graphic.distance)
        haoutil.alert("该对象的周长为:" + strDis)
      }
    },
    {
      text: "计算面积",
      icon: "fa fa-reorder",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return (
          graphic.type === "circle" ||
          graphic.type === "circleP" ||
          graphic.type === "rectangle" ||
          graphic.type === "rectangleP" ||
          graphic.type === "polygon" ||
          graphic.type === "polygonP" ||
          graphic.type === "scrollWall" ||
          graphic.type === "water"
        )
      },
      callback: (e) => {
        const graphic = e.graphic
        const strArea = mars3d.MeasureUtil.formatArea(graphic.area)
        haoutil.alert("该对象的面积为:" + strArea)
      }
    }
  ])
}

function getAttrForEvent(event) {
  if (event?.graphic?.attr) {
    return event.graphic.attr
  }
  if (!event.czmObject) {
    return {}
  }

  let attr = event.czmObject._attr || event.czmObject.properties || event.czmObject.attribute
  if (attr && attr.type && attr.attr) {
    attr = attr.attr // 兼容历史数据,V2内部标绘生产的geojson
  }
  return attr ?? {}
}

//  ***************************** 数据测试 ***********************  //
// 生成大数据
function onClickAddRandomGraohic(count) {
  haoutil.loading.show()
  const startTime = new Date().getTime()

  const result = addRandomGraphicByCount(count)

  haoutil.loading.close()
  const endTime = new Date().getTime()
  const usedTime = (endTime - startTime) / 1000 // 两个时间戳相差的毫秒数
  window.layer.msg(`生成${result || count}条数据，共耗时${usedTime.toFixed(2)}秒`)

  graphicLayer.flyTo({ duration: 0, heading: 0, pitch: -40, scale: 1.2 })
}
//  ***************************** 数据导出 ***********************  //
// 打开geojson
function onClickImpFile(file) {
  let fileName = file.name
  let fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()

  if (fileType == "json" || fileType == "geojson") {
    let reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let geojson = JSON.parse(this.result)

      if (geojson.type == "graphic" && geojson.data) {
        graphicLayer.addGraphic(geojson.data)
        graphicLayer.flyTo()
      } else {
        geojson = simplifyGeoJSON(geojson) //简化geojson的点
        graphicLayer.loadGeoJSON(geojson, { flyTo: true })
      }
      clearSelectFile()
      refreshTabel(graphicLayer)
    }
  } else if (fileType == "kml") {
    let reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onloadend = function (e) {
      let strkml = this.result
      kgUtil.toGeoJSON(strkml).then((geojson) => {
        geojson = simplifyGeoJSON(geojson) //简化geojson的点
        console.log("kml2geojson", geojson)

        graphicLayer.loadGeoJSON(geojson, {
          flyTo: true
        })
        clearSelectFile()
      })
      clearSelectFile()
    }
  } else if (fileType == "kmz") {
    //加载input文件控件的二进制流
    kgUtil.toGeoJSON(file).then((geojson) => {
      geojson = simplifyGeoJSON(geojson) //简化geojson的点
      console.log("kmz2geojson", geojson)

      graphicLayer.loadGeoJSON(geojson, {
        flyTo: true
      })
      clearSelectFile()
    })
  } else {
    window.layer.msg("暂不支持 " + fileType + " 文件类型的数据！")
    clearSelectFile()
  }
}

function clearSelectFile() {
  if (!window.addEventListener) {
    document.getElementById("input_draw_file").outerHTML += "" //IE
  } else {
    document.getElementById("input_draw_file").value = "" //FF
  }
}

//简化geojson的坐标
function simplifyGeoJSON(geojson) {
  try {
    geojson = turf.simplify(geojson, { tolerance: 0.000001, highQuality: true, mutate: true })
  } catch (e) {
    //
  }
  return geojson
}

// 保存geojson
function expGeoJSONFile() {
  if (graphicLayer.length === 0) {
    window.layer.msg("当前没有标注任何数据，无需保存！")
    return
  }

  let geojson = graphicLayer.toGeoJSON()
  haoutil.file.downloadFile("矢量数据GeoJSON.json", JSON.stringify(geojson))
}

// 保存json
function expJSONFile() {
  if (graphicLayer.length === 0) {
    window.layer.msg("当前没有标注任何数据，无需保存！")
    return
  }
  const geojson = graphicLayer.toJSON()
  mars3d.Util.downloadFile("矢量数据构造参数.json", JSON.stringify(geojson))
}

//  ***************************** 属性面板 ***********************  //
// 绑定事件，激活属性面板
function bindAttributePannel() {
  // 初始化表格数据
  if ($("#graphicTable")) {
    graphicLayer.readyPromise.then(function (layer) {
      getTableData(graphicLayer)
    })
  }
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    let val = $("#hasEdit").is(":checked")
    if (val) {
      showEditor(e)
    }
  })
  // 修改了矢量数据
  graphicLayer.on(
    [
      mars3d.EventType.editStart,
      mars3d.EventType.editStyle,
      mars3d.EventType.editAddPoint,
      mars3d.EventType.editMovePoint,
      mars3d.EventType.editRemovePoint
    ],
    function (e) {
      showEditor(e)
    }
  )

  // 停止编辑
  graphicLayer.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
    setTimeout(() => {
      if (!graphicLayer.isEditing) {
        stopEditing()
      }
    }, 100)
  })
}

//附加：激活属性编辑widget【非必需，可以注释该方法内部代码】
let timeTik

function showEditor(e) {
  const graphic = e.graphic
  clearTimeout(timeTik)

  if (!graphic._conventStyleJson) {
    graphic.options.style = graphic.toJSON().style //因为示例中的样式可能有复杂对象，需要转为单个json简单对象
    graphic._conventStyleJson = true //只处理一次
  }

  let plotAttr = es5widget.getClass("widgets/plotAttr/widget.js")
  if (plotAttr && plotAttr.isActivate) {
    plotAttr.startEditing(graphic, graphic.coordinates)
  } else {
    // 左侧没有弹出的修改面板时，弹出widget
    $("#infoview-left").length === 0 &&
      es5widget.activate({
        map: map,
        uri: "widgets/plotAttr/widget.js",
        name: "属性编辑",
        graphic: graphic,
        lonlats: graphic.coordinates
      })
  }
}

function stopEditing() {
  timeTik = setTimeout(function () {
    if (es5widget) {
      es5widget.disable("widgets/plotAttr/widget.js")
    }
  }, 200)
}
//附加：激活属性编辑widget【非必需，可以注释该方法内部代码】

//  ***************************** 数据列表 ***********************  //

let tableEventTarget = new mars3d.BaseClass()

function tableInit(data) {
  $("#graphicTable").bootstrapTable({
    data: data,
    pagination: true,
    pageList: [3, 5, 10],
    singleSelect: false,
    checkboxHeader: false,
    columns: [
      {
        title: "是否显示",
        field: "show",
        align: "center",
        checkbox: true,
        width: 50,
        formatter: function (value, row, index) {
          return {
            checked: true
          }
        }
      },
      {
        field: "name",
        title: "名称"
      },
      {
        title: "操作",
        align: "center",
        width: 80,
        events: {
          "click .remove": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            graphicLayer.removeGraphic(graphic)
            if ($("#infoview-left").length > 0) {
              $("#infoview-left").hide()
            }
          },
          "click .edit": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            // const graphic = getGraphic(row.id)
            // 矢量数据不能处于编辑状态，否则点光源示例点击编辑时会失去光
            // graphic.hasEdit && graphic.startEditing()
            if ($("#infoview-left").length > 0) {
              $("#infoview-left").show()
            } else {
              showEditor({ graphic })
            }
          }
        },
        formatter: function (value, row, index) {
          return [
            '<a class="edit" href="javascript:void(0)" title="编辑"><i class="fa fa-edit"></i></a>&nbsp;&nbsp;',
            '<a class="remove" href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>'
          ].join("")
        }
      }
    ],
    //定位区域
    onClickRow: function (row) {
      flyToTableItem(row.id)
    },
    //勾选显示
    onCheck: function (row) {
      onSelectTableItem(row.id, true)
    },
    //取消勾选显示
    onUncheck: function (row) {
      onSelectTableItem(row.id, false)
    }
  })
}

// 更新表格数据
function refreshTabel(layer) {
  const newData = getDataByLayer(layer)
  $("#graphicTable").bootstrapTable("load", newData)
}

// 删除表格中的指定项
function removeTableItem(id) {
  $("#graphicTable").bootstrapTable("remove", { field: "id", values: id })
}

// tableEventTarget.on("graphicList", function (event) {
//   tableInit(event.graphicList)
// })
// tableEventTarget.on("removeGraphic", function (event) {
//   removeTableItem(event.graphicId)
// })

function flyToTableItem(id) {
  const graphic = graphicLayer.getGraphicById(id)
  if (graphic) {
    graphic.flyTo()
  }
}

function onSelectTableItem(id, selected) {
  const graphic = graphicLayer.getGraphicById(id)
  if (!graphic) {
    return
  }
  if (selected) {
    graphic.show = true
    graphic.flyTo()
  } else {
    graphic.show = false
  }
}

// 获取图层数据，填充表格数据，同时监听图层操作
function getTableData(graphicLayer) {
  graphicLayer.on(mars3d.EventType.removeGraphic, function (event) {
    const graphicId = event.graphic.id
    removeTableItem(graphicId)
  })

  // 图上标绘触发事件
  graphicLayer.on(mars3d.EventType.drawCreated, function (event) {
    refreshTabel(graphicLayer)
  })

  const graphicList = getDataByLayer(graphicLayer)
  tableInit(graphicList)
}

function getItemName(graphic) {
  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.index) {
    return `${graphic.type} - ${graphic.attr.index}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }
  if (graphic?.style?.label?.text && graphic.style.label.text !== "0") {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  return `${graphic.type} - ${graphic.name || "未命名"}`
}

// 将layer中的数据转为表格中的数据
function getDataByLayer(graphicLayer) {
  const graphics = graphicLayer.getGraphics()

  let graphicList = []

  graphics.forEach((graphic) => {
    const itemObj = {
      id: graphic.id,
      name: getItemName(graphic),
      type: graphic.type,
      show: true
    }
    graphicList.push(itemObj)
  })

  return graphicList
}
