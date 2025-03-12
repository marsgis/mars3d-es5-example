/* eslint-disable no-var */
let thisWidget

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

  plotEdit.initEvent()

  let inHtml = ""
  thisWidget.startEditing(null, (graphicOptions, isAloneType) => {
    if (isAloneType) {
      const allStyleConfig = window.styleConfig[graphicOptions.type]

      inHtml += `<div class="open"><i class="tree_icon">-</i>${allStyleConfig.name}样式</div>
    <div class="mp_attr">
      <table id="talbe_style_alonetype_${graphicOptions.type}"></table>
    </div>`
      $("#attr_style_view").html(inHtml)
    } else {
      inHtml = `<div class="open"><i class="tree_icon">-</i>样式信息</div>
      <div class="mp_attr">
        <table id="talbe_style"></table>
      </div>`

      $("#attr_style_view").html(inHtml)
    }
  })
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
  startEditing: function (attr) {
    if (!window.styleConfig) {
      return
    }
    if (attr && attr.attr) {
      attr = {
        ...attr,
        ...attr.attr
      }
    }

    this._last_attr = attr.parentType ? { ...this._last_attr, [attr.type]: { ...attr } } : attr

    let arrFun = []
    //==============style==================
    if (this.hasEditSylte) {
      this.initAlontStyle(attr)
    }
    //==============baseinfo==================
    if (!attr.parentType) {
      this.initGraphicBaseInfo(attr, arrFun)
    }

    //执行各方法
    for (let idx = 0; idx < arrFun.length; idx++) {
      let item = arrFun[idx]
      item.fun(item.parname, item.name, item.value, item.edit)
    }

    window.tab2attr() //切换面板
  },
  initAlontStyle: function (attr) {
    const arrFun = []
    let config = window.styleConfig[attr.type] || window.styleConfig[attr.styleType] || {}
    config.style = config.style || {}

    const parentType = attr.parentType
    const allStyle = attr.style || {}
    const parname = parentType ? `plot_alonestyle_${attr.type}_` : "plot_attr_style_"
    let inHtml

    if (parentType) {
      const edit = { type: "radio", label: "是否配置：", name: "show", defval: attr.style.show }
      const attrName = "show-" + attr.type

      let input = this.getAttrInput(parname, attrName, attr.style.show, edit)
      if (input.fun) {
        arrFun.push({
          parname: parname,
          name: attrName,
          value: attr.style.show,
          edit: { ...edit, graphicType: attr.type, parentType: parentType },
          fun: input.fun
        })
      }
      inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"
    } else {
      inHtml = `<tr><td class="nametd">标号类型：</td><td>${attr.type}</td></tr>
      <tr><td class="nametd">样式类型：</td><td>${config.type || "未配置"}</td></tr>`
    }

    if (attr.style?.show ?? true) {
      for (let idx = 0; idx < config.style.length; idx++) {
        let edit = { ...config.style[idx], graphicType: attr.type, parentType: attr.parentType }
        if (!getViewShow(edit, attr.style)) {
          continue
        }

        let attrName = edit.name
        let attrVal = attr.style[attrName] ?? getViewDefval(edit) ?? {}

        if (edit?.next) {
          if (edit.next === "materialType") {
            attrVal = this._next_materialType_selectd ?? attrVal[edit.next]

            let input = this.getAttrInput(parname, attrName, attrVal, edit)

            if (input.fun) {
              const name = attrName + "-" + edit.next
              arrFun.push({ parname: parname, name: name, value: attrVal, edit: edit, fun: input.fun })
            }
            inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"

            setMaterial(allStyle[edit.name], edit, (maItem, materialOptions) => {
              let parnamemat = parname + "mat"
              let input = this.getAttrInput(parnamemat, maItem.name, materialOptions[maItem.name], { ...maItem, parent: edit })
              if (input.fun) {
                const name = maItem.name + "-" + edit.next
                arrFun.push({
                  parname: parnamemat,
                  name: name,
                  value: materialOptions[maItem.name],
                  edit: { ...maItem, parent: edit, graphicType: attr.type },
                  fun: input.fun
                })
              }
              inHtml +=
                '<tr  id="' +
                parnamemat +
                "tr_" +
                maItem.name +
                '" > <td class="nametd">' +
                maItem.label +
                "</td>  <td>" +
                input.html +
                "</td>  </tr>"
            })
          } else {
            if (!attr.style[attrName]) {
              attr.style[attrName] = {}
            }

            let val = null
            if (edit.contant && attr.style[edit.contant]) {
              val = attr.style[edit.contant]
            }

            attrVal = attr.style[attrName][edit.next] ?? val ?? getViewDefval(edit)

            let input = this.getAttrInput(parname, attrName, attrVal, edit)
            if (input.fun) {
              let name = attrName + "-" + edit.next
              arrFun.push({ parname: parname, name: name, value: attrVal, edit: edit, fun: input.fun })
            }
            inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"

            allStyle[attrName][edit.next] = attrVal
          }
        } else if (edit.name === "materialType") {
          attrVal = this._materialType_selectd || attrVal

          let input = this.getAttrInput(parname, attrName, attrVal, edit)
          if (input.fun) {
            arrFun.push({ parname: parname, name: attrName, value: attrVal, edit: edit, fun: input.fun })
          }
          inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"

          setMaterial(allStyle, edit, (maItem, materialOptions) => {
            let parnamemat = parname + "mat"
            let input = this.getAttrInput(parnamemat, maItem.name, materialOptions[maItem.name], {
              ...maItem,
              parent: edit
            })
            if (input.fun) {
              let name = maItem.name
              if (edit.next) {
                name = name + "-" + edit.next
              }
              arrFun.push({
                parname: parnamemat,
                name: name,
                value: materialOptions[maItem.name],
                edit: { ...maItem, parent: edit, graphicType: attr.type },
                fun: input.fun
              })
            }
            inHtml +=
              '<tr  id="' + parnamemat + "tr_" + maItem.name + '" > <td class="nametd">' + maItem.label + "</td>  <td>" + input.html + "</td>  </tr>"
          })
        } else {
          let input = this.getAttrInput(parname, attrName, attrVal, edit)
          if (input.fun) {
            let name = attrName
            if (edit.next) {
              name = name + "-" + edit.next
            }
            arrFun.push({ parname: parname, name: name, value: attrVal, edit: edit, fun: input.fun })
          }
          inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + edit.label + "</td>  <td>" + input.html + "</td>  </tr>"

          allStyle[attrName] = attrVal
        }
      }
    }

    if (parentType) {
      $(`#talbe_style_alonetype_${attr.type}`).html(inHtml)
    } else {
      $("#talbe_style").html(inHtml)
    }

    //注记属性
    if (!parentType && attr.style.label) {
      let configLbl = window.styleConfig["label"] || {}

      const parname = "plot_attr_stylelabel_"
      inHtml = ""
      for (let idx = 0; idx < configLbl.style.length; idx++) {
        let edit = configLbl.style[idx]
        if (!getViewShow(edit, attr.style.label)) {
          continue
        }

        let attrName = edit.name
        let attrVal = attr.style.label[attrName] ?? getViewDefval(edit)
        attr.style.label[attrName] = attrVal
        allStyle.label[attrName] = attrVal

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

    //执行各方法
    for (let idx = 0; idx < arrFun.length; idx++) {
      let item = arrFun[idx]
      item.fun(item.parname, item.name, item.value, item.edit)
    }

    //==============公用方法==================
    function getViewShow(cfg, styleOptions) {
      if (typeof cfg.show === "function") {
        return cfg.show({ style: attr.style, allStyle, graphicType: attr.type, parentType })
      }
      return true
    }
    function getViewDefval(config, styleOptions) {
      if (typeof config?.defval === "function") {
        return config.defval(attr.style, attr.type)
      } else {
        return config?.defval
      }
    }

    function setMaterial(dataRef, materialTypeOption, callback) {
      /**
       * 设置材质,没有材质但有color值时，默认是Color，都没有值时，默认为null
       * 材质同一类但有多个不同参数设置时，根据-*区分的(如LineFlow-2)，使用workMaterialType记录下，便于业务区分
       */
      function getMaterialType() {
        if (dataRef.workMaterialType) {
          dataRef.materialType = dataRef.workMaterialType
          return dataRef.materialType
        } else if (dataRef.materialType) {
          return dataRef.materialType
        } else {
          return "Color"
        }
      }
      const materialType = getMaterialType()

      if (materialType && materialTypeOption) {
        if (!dataRef.materialOptions) {
          dataRef.materialOptions = {}
        }

        const realyMaterialType = materialType?.split("-")[0]
        const materialResult = materialTypeOption.data.find((item) => item.value === realyMaterialType)
        const defval = materialResult?.defval ?? {}
        const viewMaterialsConfig = [...(window.materialConfig[realyMaterialType] ?? [])]

        viewMaterialsConfig.forEach((p) => {
          if (!getViewShow(p, attr.style)) {
            return
          }

          const val = dataRef.materialOptions[p.name]
          // 初始化进入默认值的取值顺序 1. 本身属性 2. style中的属性 3. style.js 材质默认值 4. material.js 的默认值
          dataRef.materialOptions[p.name] = val ?? dataRef[p.name] ?? defval[p.name] ?? getViewDefval(p, dataRef.materialOptions)

          // 纯色材质特殊处理下
          if (materialType === "Color") {
            dataRef[p.name] = dataRef.materialOptions[p.name]
          }

          if (callback) {
            callback && callback(p, dataRef.materialOptions)
          }
        })

        return viewMaterialsConfig
      }
      return null
    }
  },
  initGraphicBaseInfo: function (attr, arrFun) {
    const config = window.baseConfig
    const parname = "plot_baseinfo_"

    let inHtml
    for (let i = 0; i < config.length; i++) {
      const infoItem = config[i]

      const attrName = infoItem.name
      const attrVal = attr[attrName] ?? infoItem.defval

      let input = this.getAttrInput(parname, attrName, attrVal, { ...infoItem })
      if (input.fun) {
        let name = attrName
        arrFun.push({ parname: parname, name: name, value: attrVal, edit: infoItem, fun: input.fun })
      }
      inHtml += '<tr  id="' + parname + "tr_" + attrName + '" > <td class="nametd">' + infoItem.label + "</td>  <td>" + input.html + "</td>  </tr>"
    }
    $("#talbe_baseinfo").html(inHtml)
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

    if (edit.next) {
      attrName = attrName + "-" + edit.next
    }

    if (edit.parent && edit.parent?.next) {
      attrName = attrName + "-" + edit.parent.next
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
          $("#" + parname + attrName).on("change", function (e) {
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
        if (edit.toFixed) {
          attrVal = attrVal.toFixed(edit.toFixed)
        }

        inHtml = '<input id="' + parname + attrName + '" type="number" value="' + (attrVal || 0) + '" step="0.01"   class="mp_input"/>'
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
          if (attrVal === "Image2" && temp.value === "Image") {
            inHtml += '<option value="Image2">' + temp.label + "</option>"
          } else {
            inHtml += '<option value="' + temp.value + '">' + temp.label + "</option>"
          }
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
              if (temp.value === attrVal || temp.value === attrVal + "2") {
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
    attrName = attrName.split("-")[0]

    // console.log("parname, attrName, attrVal, edit", parname, attrName, attrVal, edit)

    switch (parname) {
      default:
        break
      case "plot_attr_style_": {
        let newStyle = {}

        // 拥有二级菜单
        if (edit.next) {
          newStyle[attrName] = {}
          newStyle[attrName][edit.next] = attrVal

          if (!this._last_attr.style[attrName]) {
            this._last_attr.style[attrName] = {}
          }
          this._last_attr.style[attrName][edit.next] = attrVal
        } else {
          newStyle[attrName] = attrVal
          this._last_attr.style[attrName] = attrVal
        }

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
              defStyle = getViewDefval(m) ?? {}
            }
          })
          this._materialType_selectd = attrVal

          attrVal = attrVal.split("-")[0]
          window.materialConfig[attrVal].forEach((p) => {
            // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.json 的默认值
            newStyle.materialOptions[p.name] = defStyle[p.name] ?? getViewDefval(p)
          })
          this._last_attr.style.materialOptions = newStyle.materialOptions

          newStyle[attrName] = attrVal
          this._last_attr.style[attrName] = attrVal

          this.startEditing(this._last_attr)
        } else if (edit.next && edit.next === "materialType") {
          newStyle[attrName].materialOptions = {}

          let defStyle //父元素 材质默认值
          edit.data.forEach((m) => {
            if (m.value === attrVal) {
              defStyle = getViewDefval(m) || {}
            }
          })
          this._next_materialType_selectd = attrVal

          attrVal = attrVal.split("-")[0]
          window.materialConfig[attrVal].forEach((p) => {
            // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.json 的默认值
            newStyle[attrName].materialOptions[p.name] = defStyle[p.name] ?? getViewDefval(p)
          })
          this._last_attr.style[attrName].materialOptions = newStyle[attrName].materialOptions

          newStyle[attrName][edit.next] = attrVal
          this._last_attr.style[attrName][edit.next] = attrVal

          this.startEditing(this._last_attr)
        } else if (edit.type == "radio") {
          this.startEditing(this._last_attr)
        }

        thisWidget.updateStyle2map(newStyle)
        break
      }
      case "plot_attr_style_mat": {
        let newStyle = this._last_attr.style.materialOptions ?? {}

        // 拥有二级菜单
        if (edit?.parent?.next) {
          const parent = edit?.parent
          newStyle[parent.name] = this._last_attr.style[parent.name]?.materialOptions ?? {}
          newStyle[parent.name][attrName] = attrVal

          if (!this._last_attr.style[parent.name].materialOptions) {
            this._last_attr.style[parent.name].materialOptions = {}
          }
          this._last_attr.style[parent.name].materialOptions[attrName] = attrVal
        } else {
          newStyle[attrName] = attrVal

          this._last_attr.style.materialOptions = this._last_attr.style.materialOptions || {}
          this._last_attr.style.materialOptions[attrName] = attrVal
        }

        if (edit.type == "radio") {
          this.startEditing(this._last_attr)
        }

        thisWidget.updateStyle2map({ materialOptions: newStyle })
        break
      }
      case "plot_alonestyle_" + edit.graphicType + "_": {
        const graphicType = edit.graphicType
        const newOptions = {}

        if (this._last_attr[graphicType]) {
          newOptions[attrName] = attrVal
          this._last_attr[graphicType].style[attrName] = attrVal

          // 材质类型 materialType 改变时的特殊处理
          if (attrName === "materialType") {
            newOptions.materialOptions = {}

            let defStyle //style.js 材质默认值
            edit.data.forEach((m) => {
              if (m.value === attrVal) {
                defStyle = getViewDefval(m) ?? {}
              }
            })
            this._materialType_selectd = attrVal

            attrVal = attrVal.split("-")[0]
            window.materialConfig[attrVal].forEach((p) => {
              // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.json 的默认值
              newOptions.materialOptions[p.name] = defStyle[p.name] ?? getViewDefval(p)
            })

            this._last_attr[graphicType].style.materialOptions = newOptions.materialOptions

            newOptions[attrName] = attrVal
            this.initAlontStyle(this._last_attr[graphicType])
          } else if (edit.type == "radio") {
            this.initAlontStyle(this._last_attr[graphicType])
          }

          thisWidget.updateOptions2map({ [graphicType]: { ...newOptions } })
        }
        break
      }
      case "plot_alonestyle_" + edit.graphicType + "_mat": {
        const graphicType = edit.graphicType
        const newOptions = { [graphicType]: {} }

        if (this._last_attr[graphicType]) {
          this._last_attr[graphicType].style.materialOptions[attrName] = attrVal

          if (!newOptions[graphicType].materialOptions) {
            newOptions[graphicType].materialOptions = {}
          }
          newOptions[graphicType].materialOptions[attrName] = attrVal

          thisWidget.updateOptions2map(newOptions)
        }
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
      case "plot_baseinfo_": {
        let newBaseInfo = {}

        this._last_attr[attrName] = attrVal
        newBaseInfo[attrName] = attrVal

        thisWidget.updateOptions2map(newBaseInfo)
        break
      }
    }

    function getViewDefval(config) {
      if (typeof config?.defval === "function") {
        return config.defval(this._last_attr.style, this._last_attr.type)
      } else {
        return config?.defval
      }
    }

    return true
  }
}
