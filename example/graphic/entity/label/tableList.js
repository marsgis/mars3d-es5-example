function tabInit(data) {
  $("#graphicTable").bootstrapTable({
    data: data,
    pagination: false,
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
          },
          "click .edit": function (e, value, row, index) {
            const graphic = graphicLayer.getGraphicById(row.id)
            showEditor(graphic)
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
      flyToModel(row.id)
    },
    //勾选显示
    onCheck: function (row) {
      onSelect(row.id, true)
    },
    //取消勾选显示
    onUncheck: function (row) {
      onSelect(row.id, false)
    }
  })
}

// 删除表格中的指定项
function removeTableItem(id) {
  $("#graphicTable").bootstrapTable("remove", { field: "id", values: id })
}

function showEditor(graphic) {
  if (!graphic._conventStyleJson) {
    graphic.options.style = graphic.toJSON().style //因为示例中的样式可能有复杂对象，需要转为单个json简单对象
    graphic._conventStyleJson = true //只处理一次
  }

  let plotAttr = es5widget.getClass("widgets/plotAttr/widget.js")
  if (plotAttr && plotAttr.isActivate) {
    plotAttr.startEditing(graphic, graphic.coordinates)
  } else {
    es5widget.activate({
      map: map,
      uri: "widgets/plotAttr/widget.js",
      name: "属性编辑",
      graphic: graphic,
      lonlats: graphic.coordinates
    })
  }
}

eventTarget.on("graphicList", function (event) {
  tabInit(event.graphicList)
})
eventTarget.on("removeGraphic", function (event) {
  removeTableItem(event.graphicId)
})

function flyToModel(id) {
  const graphic = graphicLayer.getGraphicById(id)
  if (graphic) {
    graphic.flyTo()
  }
}

function onSelect(id, selected) {
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
    eventTarget.fire("removeGraphic", { graphicId })
  })

  const graphics = graphicLayer.getGraphics()

  graphics.forEach((graphic) => {
    const itemObj = {
      id: graphic.id,
      name: getItemName(graphic),
      type: graphic.type,
      show: true
    }
    graphicList.push(itemObj)
  })
  eventTarget.fire("graphicList", { graphicList })
}

let graphicIndex = 0
function getItemName(graphic) {
  if (graphic?.style?.label?.text) {
    return `${graphic.type} - ${graphic.style.label.text}`
  }

  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`
  }

  graphic.name = `未命名${++graphicIndex}`
  return `${graphic.type} - ${graphic.name}`
}
