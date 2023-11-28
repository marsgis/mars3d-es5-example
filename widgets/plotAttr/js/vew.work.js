/* eslint-disable no-var */
let thisWidget
let availabilityList = []

//当前页面业务
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget

  //清除所有标号
  $("#btnDelete").click(function () {
    thisWidget.deleteEntity()
  })

  $("#btnCenter").click(function (e) {
    thisWidget.centerCurrentEntity()
  })

  $("#btn_plot_savefile").click(function () {
    let data = thisWidget.getGeoJson()
    haoutil.file.downloadFile("标绘item.json", JSON.stringify(data))
  })

  $("#btn_avali_add").click(function () {
    let newTimeSlot = { start: null, stop: null }
    const avaLength = availabilityList.length
    if (!avaLength) {
      newTimeSlot = thisWidget.getAndSetMapTime()
    } else {
      const copiedTime = availabilityList[avaLength - 1]

      newTimeSlot.start = thisWidget.getAndSetMapTime(copiedTime.stop)
      newTimeSlot.stop = thisWidget.getAndSetMapTime(newTimeSlot.start)
    }

    availabilityList.push(newTimeSlot)
    changeAvali(availabilityList)
  })

  $("#btn_avali_delete").click(function () {
    $("#table-box").empty()
    availabilityList = []
    changeAvali(availabilityList)
  })

  plotEdit.initEvent()
  thisWidget.startEditing()

  availabilityList = thisWidget.getAvailability() || []
  if (availabilityList && !thisWidget.config?.hideAvaliability) {
    changeAvali(availabilityList)
  }

  if (thisWidget.config?.hideAvaliability) {
    $("#tab_availability").hide()
  }
}

let newAttr = {} // 解决的问题：在updateAttr捕获到内容改变后，会导致仅保留最后一次更改的属性数据
//属性编辑相关
var plotEdit = {
  hasEditSylte: true,

  initEvent: function () {
    let that = this
    if (!this.hasEditSylte) {
      $("#attr_style_view").hide()
    }

    //改变高度 - 高程全部设置为
    $("#plot_latlngs_allheight").bind("input propertychange", function () {
      $("#plot_latlngs_addheight").val("")

      let thisval = Number($(this).val()) //高度（米）
      if (isNaN(thisval)) {
        thisval = 1
      }

      let latlngs = []
      $(".plot_latlngs").each(function () {
        if ($(this).attr("data-type") == "height") {
          $(this).val(thisval)
          latlngs.push(thisval)
        } else {
          latlngs.push(Number($(this).val())) //经纬度值
        }
      })

      let arrPoint = []
      for (let i = 0; i < latlngs.length; i += 3) {
        arrPoint.push([latlngs[i], latlngs[i + 1], latlngs[i + 2]])
      }
      thisWidget.updatePoints2map(arrPoint)
    })

    //改变高度 - 在地表高程偏移
    $("#plot_latlngs_addheight").bind("input propertychange", function () {
      $("#plot_latlngs_allheight").val("")
      let thisval = Number($(this).val()) //高度（米）
      if (isNaN(thisval)) {
        thisval = 1
      }

      let latlngs = []
      $(".plot_latlngs").each(function () {
        if ($(this).attr("data-type") == "height") {
          let oldval = Number($(this).attr("oldvalue"))
          $(this).val(oldval + thisval)
          latlngs.push(oldval + thisval)
        } else {
          latlngs.push(Number($(this).val())) //经纬度值
        }
      })

      let arrPoint = []
      for (let i = 0; i < latlngs.length; i += 3) {
        arrPoint.push([latlngs[i], latlngs[i + 1], latlngs[i + 2]])
      }
      thisWidget.updatePoints2map(arrPoint)
    })
  },
  _last_attr: null,
  //选中标号，激活属性面板
  startEditing: function (attr, latlngs) {
    if (!window.styleConfig) {
      return
    }
    if (attr && attr.attr) {
      attr = {
        ...attr,
        ...attr.attr
      }
    }

    this._last_attr = attr

    let config = window.styleConfig[attr.type] || window.styleConfig[attr.styleType] || {}
    config.style = config.style || {}

    function getViewShow(cfg, styleOptions) {
      if (typeof cfg.show === "function") {
        return cfg.show(styleOptions, attr.style, attr.type)
      }
      return true
    }

    if (latlngs) {
      this._hasHeight = true

      if (attr.style.clampToGround) {
        this._hasHeight = false
      } else if (attr.type == "rectangle" || attr.type == "corridor") {
        this._hasHeight = false
      }

      this.updateLatlngsHtml(latlngs)
    }

    let arrFun = []
    let parname, inHtml
    //==============style==================
    if (this.hasEditSylte) {
      parname = "plot_attr_style_"
      inHtml = `<tr><td class="nametd">所在图层：</td><td>${thisWidget.getLayerName() || "默认图层"}</td></tr>
      <tr><td class="nametd">标号类型：</td><td>${attr.type}</td></tr>
      <tr><td class="nametd">样式类型：</td><td>${config.type || "未配置"}</td></tr>`

      for (let idx = 0; idx < config.style.length; idx++) {
        let edit = config.style[idx]
        if (!getViewShow(edit, attr.style)) {
          continue
        }

        let attrName = edit.name
        let attrVal = attr.style[attrName] ?? edit.defval

        //材质时
        if (edit.name === "materialType") {
          attrVal = this._materialType_selectd || attrVal

          let input = this.getAttrInput(parname, attrName, attrVal, edit)
          if (input.fun) {
            arrFun.push({ parname: parname, name: attrName, value: attrVal, edit: edit, fun: input.fun })
          }
          inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"

          let defStyle //style.js 材质默认值
          edit.data.forEach((m) => {
            if (m.value === attrVal) {
              defStyle = m.defval || {}
            }
          })

          const materialOptions = attr.style.materialOptions || {}

          let thisMaterialConfig = window.materialConfig[attrVal.split("-")[0]]
          thisMaterialConfig.forEach((maItem) => {
            if (!getViewShow(maItem, materialOptions)) {
              return
            }
            let parnamemat = "plot_attr_style_mat"
            // 初始化进入默认值的取值顺序 1. 本身属性 2. style中的属性 3. style.js 材质默认值 4. material.js 的默认值
            materialOptions[maItem.name] = materialOptions[maItem.name] ?? attr.style[maItem.name] ?? defStyle[maItem.name] ?? maItem.defval

            let input = this.getAttrInput(parnamemat, maItem.name, materialOptions[maItem.name], maItem)
            if (input.fun) {
              arrFun.push({ parname: parnamemat, name: maItem.name, value: materialOptions[maItem.name], edit: maItem, fun: input.fun })
            }
            inHtml +=
              '<tr  id="' + parnamemat + "tr_" + maItem.name + '" > <td class="nametd">' + maItem.label + "</td>  <td>" + input.html + "</td>  </tr>"
          })
        } else {
          let input = this.getAttrInput(parname, attrName, attrVal, edit)
          if (input.fun) {
            arrFun.push({ parname: parname, name: attrName, value: attrVal, edit: edit, fun: input.fun })
          }
          inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"
        }
      }
      $("#talbe_style").html(inHtml)

      //注记属性
      if (attr.style.label) {
        let configLbl = window.styleConfig["label"] || {}

        parname = "plot_attr_stylelabel_"
        inHtml = ""
        for (let idx = 0; idx < configLbl.style.length; idx++) {
          let edit = configLbl.style[idx]
          if (!getViewShow(edit, attr.style.label)) {
            continue
          }

          let attrName = edit.name
          let attrVal = attr.style.label[attrName] ?? edit.defval
          attr.style.label[attrName] = attrVal

          let input = this.getAttrInput(parname, attrName, attrVal, edit)
          if (input.fun) {
            arrFun.push({ parname: parname, name: attrName, value: attrVal, edit: edit, fun: input.fun })
          }

          inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"
        }
        $("#talbe_stylelabel").html(inHtml)
        $("#attr_stylelabel_view").show()
      } else {
        $("#attr_stylelabel_view").hide()
      }
    }
    //==============attr==================
    parname = "plot_attr_attr_"
    inHtml = ""
    attr.attr = attr.attr || {}

    let attrcfg = thisWidget.getAttrList()

    let tempKyes = {}
    for (let idx = 0; idx < attrcfg.length; idx++) {
      let edit = attrcfg[idx]
      tempKyes[edit.name] = true
    }
    for (let key in attr.attr) {
      let attrVal = attr.attr[key]
      if (tempKyes[key]) {
        continue
      }

      if (haoutil.isutil.isString(attrVal)) {
        attrcfg.push({ name: key, label: key, type: "text", defval: "" })
      } else if (haoutil.isutil.isNumber(attrVal)) {
        attrcfg.push({ name: key, label: key, type: "number", defval: 0.0 })
      } else if (typeof attrVal === "boolean") {
        attrcfg.push({ name: key, label: key, type: "radio", defval: false })
      }
    }

    for (let idx = 0; idx < attrcfg.length; idx++) {
      let edit = attrcfg[idx]
      if (edit.type == "hidden") {
        continue
      }

      let attrName = edit.name
      let attrVal = attr.attr[attrName] ?? edit.defval ?? ""

      let input = this.getAttrInput(parname, attrName, attrVal, edit)
      if (input.fun) {
        arrFun.push({ parname: parname, name: attrName, value: attrVal, edit: edit, fun: input.fun })
      }

      inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"
    }

    $("#talbe_attr").html(inHtml)

    //执行各方法
    for (let idx = 0; idx < arrFun.length; idx++) {
      let item = arrFun[idx]
      item.fun(item.parname, item.name, item.value, item.edit)
    }

    window.tab2attr() //切换面板
  },
  updateLatlngsHtml: function (latlngs) {
    $("#plot_latlngs_addheight").val("")
    $("#plot_latlngs_allheight").val("")
    $("#view_updateheight").hide()

    //显示坐标信息
    let inHtml = ""
    if (!latlngs || latlngs.length == 0) {
      //
    } else if (latlngs.length == 1) {
      let latlng = latlngs[0]
      let jd = latlng[0]
      let wd = latlng[1]
      let height = latlng.length == 3 ? latlng[2] : 0

      inHtml +=
        ' <div class="mp_attr" style=" margin-top: 10px;"><table>' +
        ' <tr> <td class="nametd">经度：</td> <td><input type="number" class="mp_input plot_latlngs" data-type="jd" step="0.000001"  value="' +
        jd +
        '"></td></tr>' +
        '<tr>  <td class="nametd">纬度：</td> <td><input type="number" class="mp_input plot_latlngs" data-type="wd" step="0.000001"  value="' +
        wd +
        '"></td></tr>'
      if (this._hasHeight) {
        inHtml +=
          '<tr><td class="nametd">高程：</td> <td><input type="number" class="mp_input plot_latlngs" data-type="height" step="0.1" value="' +
          height +
          '" oldvalue="' +
          height +
          '"></td></tr>'
      }
      inHtml += " </table> </div>"
    } else {
      if (this._hasHeight) {
        $("#view_updateheight").show()
      }

      let delhtml = ""

      if (latlngs.length > thisWidget.getMinPointNum()) {
        delhtml = '<i class="fa fa-trash-o latlng-del" title="删除点" ></i>'
      }

      for (let idx = 0; idx < latlngs.length; idx++) {
        let latlng = latlngs[idx]

        let jd = latlng[0]
        let wd = latlng[1]
        let height = latlng.length == 3 ? latlng[2] : 0

        let addthml = ""
        if (latlngs.length < thisWidget.getMaxPointNum()) {
          addthml = '<i class="fa  fa-plus-square-o latlng-install" title="插入点" data-index="' + idx + '" ></i>&nbsp;&nbsp;'
        }

        //
        inHtml +=
          '<div><div class="open"><i class="tree_icon">-</i>第' +
          (idx + 1) +
          '点 <label style="width:100px;">&nbsp;</label>    ' +
          addthml +
          delhtml +
          ' </div><div class="mp_attr"><table>' +
          '<tr> <td class="nametd">经度：</td> <td><input  type="number" class="mp_input plot_latlngs" data-type="jd"  step="0.000001" data-index="' +
          idx +
          '" value="' +
          jd +
          '"></td>  </tr> ' +
          '<tr>  <td class="nametd">纬度：</td> <td><input  type="number" class="mp_input plot_latlngs" data-type="wd"  step="0.000001" data-index="' +
          idx +
          '" value="' +
          wd +
          '"></td> </tr> '
        if (this._hasHeight) {
          inHtml +=
            '<tr>  <td class="nametd">高程：</td> <td><input  type="number" step="0.1" class="mp_input plot_latlngs" data-type="height" data-index="' +
            idx +
            '" value="' +
            height +
            '" oldvalue="' +
            height +
            '"></td> </tr> '
        }
        inHtml += " </table> </div> </div>"
      }
    }
    $("#view_latlngs").html(inHtml)
    $("#view_latlngs .open").click(window.changeOpenShowHide)

    let that = this
    $("#view_latlngs .latlng-del").click(function () {
      $(this).parent().parent().remove()

      let latlngs = []
      let withHeight = false
      $(".plot_latlngs").each(function () {
        latlngs.push(Number($(this).val()))
        if ($(this).attr("data-type") === "height") {
          withHeight = true
        }
      })

      //重新修改界面
      let arr = []
      if (withHeight) {
        for (let i = 0; i < latlngs.length; i += 3) {
          arr.push([latlngs[i], latlngs[i + 1], latlngs[i + 2]])
        }
      } else {
        for (let i = 0; i < latlngs.length; i += 2) {
          arr.push([latlngs[i], latlngs[i + 1]])
        }
      }
      that.updateLatlngsHtml(arr)
      thisWidget.updatePoints2map(arr)
    })
    $("#view_latlngs .latlng-install").click(function () {
      let idx = Number($(this).attr("data-index"))

      let latlngs = []
      let withHeight = false
      $(".plot_latlngs").each(function () {
        latlngs.push(Number($(this).val() || 0))
        if ($(this).attr("data-type") === "height") {
          withHeight = true
        }
      })

      //重新修改界面
      let arr = []
      if (withHeight) {
        for (let i = 0; i < latlngs.length; i += 3) {
          arr.push([latlngs[i], latlngs[i + 1], latlngs[i + 2]])
        }
      } else {
        for (let i = 0; i < latlngs.length; i += 2) {
          arr.push([latlngs[i], latlngs[i + 1]])
        }
      }

      let pt1 = arr[idx]
      let pt2 = idx == arr.length - 1 ? arr[0] : arr[idx + 1]
      let jd = Number(((pt1[0] + pt2[0]) / 2).toFixed(6))
      let wd = Number(((pt1[1] + pt2[1]) / 2).toFixed(6))

      if (withHeight) {
        let gd = Number(((pt1[2] + pt2[2]) / 2).toFixed(1))
        arr.splice(idx + 1, 0, [jd, wd, gd])
      } else {
        arr.splice(idx + 1, 0, [jd, wd])
      }

      that.updateLatlngsHtml(arr)
      thisWidget.updatePoints2map(arr)
    })

    $(".plot_latlngs").bind("input propertychange", function () {
      let latlngs = []
      let withHeight = false
      $(".plot_latlngs").each(function () {
        latlngs.push(Number($(this).val()))
        if ($(this).attr("data-type") === "height") {
          withHeight = true
        }
      })

      let arrPoint = []
      if (withHeight) {
        for (let i = 0; i < latlngs.length; i += 3) {
          arrPoint.push([latlngs[i], latlngs[i + 1], latlngs[i + 2]])
        }
      } else {
        for (let i = 0; i < latlngs.length; i += 2) {
          arrPoint.push([latlngs[i], latlngs[i + 1]])
        }
      }
      thisWidget.updatePoints2map(arrPoint)
    })
  },
  // //单击地图空白，释放属性面板
  // stopEditing: function () {
  //     $("#talbe_style").html('');
  //     $("#talbe_attr").html('');
  //     this._last_attr = null;
  // },
  //获取各属性的编辑html和change方法
  getAttrInput: function (parname, attrName, attrVal, edit) {
    if (attrVal == null || attrVal == undefined) {
      attrVal = ""
    }

    let that = this

    let inHtml = ""
    let fun = null
    switch (edit.type) {
      default:
      case "label":
        inHtml = attrVal
        break
      case "text":
        inHtml = '<input id="' + parname + attrName + '" type="text" value="' + attrVal + '"    class="mp_input" />'

        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).on("input propertychange", function (e) {
            let attrVal = $(this).val()
            that.updateAttr(parname, attrName, attrVal, edit)
          })
        }
        break
      case "textarea":
        attrVal = attrVal.replace(new RegExp("<br />", "gm"), "\n")
        inHtml = '<textarea  id="' + parname + attrName + '"     class="mp_input" style="height:50px;resize: none;" >' + attrVal + "</textarea>"

        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).on("input propertychange", function (e) {
            let attrVal = $(this).val()
            if (attrVal.length == 0) {
              attrVal = ""
            }
            attrVal = attrVal.replace(/\n/g, "<br />")

            that.updateAttr(parname, attrName, attrVal, edit)
          })
        }
        break
      case "number":
        inHtml = '<input id="' + parname + attrName + '" type="number" value="' + (attrVal || 0) + '"    class="mp_input"/>'
        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).on("input propertychange", function (e) {
            let attrVal = Number($(this).val())

            that.updateAttr(parname, attrName, attrVal, edit)
          })
        }
        break
      case "slider":
        if (edit.max !== 1) {
          //同"number"
          inHtml = '<input id="' + parname + attrName + '" type="number" value="' + (attrVal || 0) + '"    class="mp_input"/>'
          fun = function (parname, attrName, attrVal, edit) {
            $("#" + parname + attrName).on("input propertychange", function (e) {
              let attrVal = Number($(this).val())

              that.updateAttr(parname, attrName, attrVal, edit)
            })
          }
        } else {
          inHtml = '<input id="' + parname + attrName + '"  type="text" value="' + attrVal * 100 + '"   data-value="' + attrVal + '" />'
          fun = function (parname, attrName, attrVal, edit) {
            let _width = $(".mp_tab_card").width() * 0.6 - 30
            $("#" + parname + attrName).progress(_width) //绑定样式
            $("#" + parname + attrName).change(function () {
              let attrVal = Number($(this).val()) / 100

              that.updateAttr(parname, attrName, attrVal, edit)
            })
          }
        }

        break

      case "combobox":
        inHtml = '<select id="' + parname + attrName + '" class="mp_select"    data-value="' + attrVal + '" >'
        for (let jj = 0; jj < edit.data.length; jj++) {
          let temp = edit.data[jj]
          inHtml += '<option value="' + temp.value + '">' + temp.label + "</option>"
        }
        inHtml += "</select>"

        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).select() //绑定样式
          $("#" + parname + attrName).change(function () {
            let attrVal = $(this).attr("data-value")

            let thisSel
            for (let jj = 0; jj < edit.data.length; jj++) {
              let temp = edit.data[jj]
              if (temp.impact == null) {
                continue
              }
              if (temp.value === attrVal) {
                thisSel = temp
                continue
              }
              that.changeViewByAttr(parname, temp.impact, false)
            }
            if (thisSel) {
              that.changeViewByAttr(parname, thisSel.impact, true)
            }
            if (edit.valType == "number") {
              attrVal = Number(attrVal)
            }
            that.updateAttr(parname, attrName, attrVal, edit)
          })

          let thisSel
          for (let jj = 0; jj < edit.data.length; jj++) {
            let temp = edit.data[jj]
            if (temp.impact == null) {
              continue
            }
            if (temp.value === attrVal) {
              thisSel = temp
              continue
            }
            that.changeViewByAttr(parname, temp.impact, false)
          }
          if (thisSel) {
            that.changeViewByAttr(parname, thisSel.impact, true)
          }
        }
        break

      case "radio":
        {
          let _name_key = parname + attrName
          inHtml = `<div class="radio radio-info radio-inline" id="${_name_key}"  data-value="${attrVal}" >
            <input type="radio" id="${_name_key}_1" value="1"  name="${_name_key}" ${attrVal ? 'checked="checked"' : ""}>
            <label for="${_name_key}_1"> 是</label>
          </div>
          <div class="radio radio-info radio-inline">
            <input type="radio" id="${_name_key}_0" value="0" name="${_name_key}" ${attrVal ? "" : 'checked="checked"'}">
            <label for="${_name_key}_0"> 否 </label>
          </div>`

          fun = function (parname, attrName, attrVal, edit) {
            $('input:radio[name="' + parname + attrName + '"]').change(function () {
              let attrVal = $(this).val() == "1"
              let isOK = that.updateAttr(parname, attrName, attrVal, edit)
              if (isOK) {
                that.changeViewByAttr(parname, edit.impact, attrVal)
              }
            })
            that.changeViewByAttr(parname, edit.impact, attrVal)
          }
        }
        break
      case "color":
        inHtml = '<input id="' + parname + attrName + '"  class="mp_input" style="width: 100%;"  value="' + attrVal + '" />'

        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).minicolors({
            position: "bottom right",
            control: "saturation",
            change: function (hex, opacity) {
              that.updateAttr(parname, attrName, hex, edit)
            }
          })
        }
        break
      case "window":
        inHtml = '<input id="' + parname + attrName + '" type="text" value="' + attrVal + '" readonly   class="mp_input" />'

        fun = function (parname, attrName, attrVal, edit) {
          $("#" + parname + attrName).on("click", function (e) {
            thisWidget.showEditAttrWindow({
              data: that._last_attr,
              parname: parname,
              attrName: attrName,
              attrVal: attrVal
            })
          })

          $("#" + parname + attrName).on("input propertychange", function (e) {
            let attrVal = $(this).val()
            that.updateAttr(parname, attrName, attrVal, edit)
          })
        }
        break
    }
    return { html: inHtml, fun: fun }
  },
  //联动属性控制
  changeViewByAttr: function (parname, arrimpact, show) {
    if (arrimpact && arrimpact.length > 0) {
      for (let jj = 0; jj < arrimpact.length; jj++) {
        let attrName = arrimpact[jj]
        if (show) {
          $("#" + parname + "tr_" + attrName).show()

          let attrVal = $("#" + parname + attrName).attr("data-value")
          if (!attrVal) {
            attrVal = $("#" + parname + attrName).val()
          }
          // if (attrVal !== null && attrVal !== undefined) {
          //   this._last_attr.style[attrName] = attrVal;
          // }
        } else {
          // delete this._last_attr.style[attrName];
          $("#" + parname + "tr_" + attrName).hide()
        }
      }
    }
  },

  //属性面板值修改后触发此方法
  updateAttr: function (parname, attrName, attrVal, edit) {
    switch (parname) {
      default:
        break
      case "plot_attr_style_": {
        let newStyle = {}
        newStyle[attrName] = attrVal
        this._last_attr.style[attrName] = attrVal

        let type = this._last_attr.styleType || this._last_attr.type
        if (
          (attrName == "fill" || attrName == "outline") &&
          attrVal === false &&
          (type == "plane" ||
            type == "circle" ||
            type == "ellipse" ||
            type == "cylinder" ||
            type == "ellipsoid" ||
            type == "box" ||
            type == "polylineVolume" ||
            type == "wall" ||
            type == "corridor" ||
            type == "rectangle" ||
            type == "polygon")
        ) {
          if (!(this._last_attr.style["fill"] ?? true) && !this._last_attr.style["outline"]) {
            this._last_attr.style[attrName] = true
            $("input[name='" + parname + attrName + "']:eq(0)").attr("checked", "checked")
            $("input[name='" + parname + attrName + "']:eq(0)").click()
            haoutil.msg("填充和边框不能同时为否，需要至少开启一个！")
            return false
          }
        }

        // 材质类型 materialType 改变时的特殊处理
        if (attrName === "materialType") {
          newStyle.materialOptions = {}

          let defStyle //style.js 材质默认值
          edit.data.forEach((m) => {
            if (m.value === attrVal) {
              defStyle = m.defval || {}
            }
          })
          this._materialType_selectd = attrVal

          attrVal = attrVal.split("-")[0]
          window.materialConfig[attrVal].forEach((p) => {
            // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.json 的默认值
            newStyle.materialOptions[p.name] = defStyle[p.name] ?? p.defval
          })
          this._last_attr.style.materialOptions = newStyle.materialOptions

          newStyle[attrName] = attrVal
          this._last_attr.style[attrName] = attrVal

          this.startEditing(this._last_attr)
        } else if (edit.type == "radio") {
          this.startEditing(this._last_attr)
        }

        thisWidget.updateStyle2map(newStyle)
        break
      }
      case "plot_attr_style_mat": {
        let newStyle = {}
        newStyle[attrName] = attrVal

        this._last_attr.style.materialOptions = this._last_attr.style.materialOptions || {}
        this._last_attr.style.materialOptions[attrName] = attrVal

        this.startEditing(this._last_attr)

        thisWidget.updateStyle2map({ materialOptions: newStyle })
        break
      }

      case "plot_attr_stylelabel_": {
        let newStyle = {}
        newStyle[attrName] = attrVal

        this._last_attr.style.label = this._last_attr.style.label || {}
        this._last_attr.style.label[attrName] = attrVal

        if (edit.type == "radio") {
          this.startEditing(this._last_attr)
        }

        thisWidget.updateStyle2map({ label: newStyle })

        break
      }
      case "plot_attr_attr_": {
        this._last_attr.attr[attrName] = attrVal
        newAttr[attrName] = attrVal
        thisWidget.updateAttr2map(newAttr)
        break
      }
    }

    return true
  }
}

// 时序相关
function changeAvali() {
  $("#table-box").empty()
  //   <li id="btnAdd" onclick="addAvaliItem('ava-title${index + 1}')" class="ava-btn"><i class="fa fa-plus" title="新增"></i></li>

  availabilityList.forEach((item, index) => {
    const span = $(`
        <span class="ava-title" id="ava-title${index + 1}">第${index + 1}个时间段
        <ul class="ava-tools">
        <li id="btnDelete" onclick="deleteAvali('ava-title${index + 1}')" class="ava-btn"><i class="fa fa-trash" title="删除"></i></li>
        </ul>
        </span>
        `)
    const table = $(
      `<table id='ava-table' class='mars-table'>
        <tbody>
          <tr>
            <td>开始时间</td>
            <td><input type='text' class='form-control' id='startTime${index + 1}' placeholder='YYYY-MM-DD' /></td>
        </tr>
        <tr>
            <td>结束时间</td>
            <td><input type='text' class='form-control' id='endTime${index + 1}' placeholder='YYYY-MM-DD' /></td>
        </tr>
        </tbody>
        </table>`
    )
    $("#table-box").append(span)
    $("#table-box").append(table)

    const startMinmaxData = getMinData(availabilityList, index, "start")
    jeDate(`#startTime${index + 1}`, {
      theme: {
        bgcolor: "#135b91",
        pnColor: "#00CCFF"
      },
      format: "YYYY-MM-DD hh:mm:ss",
      isClear: false,
      minDate: startMinmaxData.minDate,
      maxDate: startMinmaxData.maxDate,
      donefun: function (obj) {
        const { isChange, message } = getMinData(availabilityList, index, "start", obj.val)
        if (isChange) {
          availabilityList[index].start = obj.val
          thisWidget.availabilityChange(availabilityList)
        } else {
          toastr.warning(message)
          $(obj.elem).val(availabilityList[index].start)
        }
      }
    })

    const endMinmaxData = getMinData(availabilityList, index, "stop")
    jeDate(`#endTime${index + 1}`, {
      theme: {
        bgcolor: "#135b91",
        pnColor: "#00CCFF"
      },
      format: "YYYY-MM-DD hh:mm:ss",
      isClear: false,
      minDate: endMinmaxData.minDate,
      maxDate: endMinmaxData.maxDate,
      donefun: function (obj) {
        const { isChange, message } = getMinData(availabilityList, index, "stop", obj.val)
        if (isChange) {
          availabilityList[index].stop = obj.val
          thisWidget.availabilityChange(availabilityList)
        } else {
          toastr.warning(message)
          $(obj.elem).val(availabilityList[index].stop)
        }
      }
    })

    $(`#startTime${index + 1}`).val(availabilityList[index].start)
    $(`#endTime${index + 1}`).val(availabilityList[index].stop)
  })

  thisWidget.availabilityChange(availabilityList)
}

// function addAvaliItem(pos) {
//   const arr = [...pos]
//   const index = Number(arr[arr.length - 1])

//   const start = $(`#startTime${index}`).val()
//   const stop = $(`#endTime${index}`).val()

//   availabilityList.splice(index, 0, {
//     start: start,
//     stop: stop
//   })
//   changeAvali(availabilityList)
// }

function deleteAvali(domId) {
  const arr = [...domId]
  const index = arr[arr.length - 1]
  availabilityList.splice(index - 1, 1)
  changeAvali(availabilityList)
}

function getMinData(avaList, index, key, val) {
  let startTime = null
  let endTime = null

  const lastTimeSlot = avaList[index - 1]
  const currentTimeSlot = avaList[index]
  const nextTimeSlot = avaList[index + 1]

  switch (key) {
    case "start":
      if (lastTimeSlot) {
        startTime = lastTimeSlot.stop
      }
      endTime = currentTimeSlot.stop
      break
    case "stop":
      startTime = currentTimeSlot.start
      if (nextTimeSlot) {
        endTime = nextTimeSlot.start
      }

      break

    default:
      break
  }

  if (val) {
    if (startTime && new Date(val) < new Date(startTime)) {
      console.log(`选中时间小于开始时间！\n选中：${val}\n 开始时间：${startTime}`)
      return { isChange: false, message: `请重新选择时间，须大于${startTime}` }
    } else if (endTime && new Date(val) > new Date(endTime)) {
      console.log(`选中时间大于结束时间！\n选中：${val}\n 结束时间：${endTime}`)
      return { isChange: false, message: `请重新选择时间，须小于${endTime}` }
    } else {
      return { isChange: true, message: "" }
    }
  } else {
    return {
      minDate: startTime || jeDate.nowDate({ DD: -360 * 100 }),
      maxDate: endTime || jeDate.nowDate({ DD: 360 * 100 })
    }
  }
}
