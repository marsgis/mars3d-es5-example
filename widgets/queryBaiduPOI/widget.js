"use script" //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends es5widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ["view.css"]
    }

    //弹窗配置
    get view() {
      return {
        type: "append",
        url: "view.html",
        parent: "body"
      }
    }

    //初始化[仅执行1次]
    create() {
      this.storageName = "mars3d_queryBaiduPOI"
      this.pageSize = 6
      this.allpage = 0
      this.thispage = 0

      //创建矢量数据图层
      this.graphicLayer = new mars3d.layer.GraphicLayer({
        name: this.config.name,
        pid: 99 //图层管理 中使用，父节点id
      })
      //鼠标单击后的信息面板弹窗
      this.graphicLayer.bindPopup(function (event) {
        let item = event.graphic?.attr
        if (!item) {
          return
        }

        let name
        if (item.detailUrl) {
          name = '<a href="' + item.detailUrl + '"  target="_black" style="color: #ffffff; ">' + item.name + "</a>"
        } else {
          name = item.name
        }

        let inHtml = '<div class="mars-popup-titile">' + name + '</div><div class="mars-popup-content" >'

        let phone = $.trim(item.tel)
        if (phone != "") {
          inHtml += "<div><label>电话</label>" + phone + "</div>"
        }

        let dz = $.trim(item.address)
        if (dz != "") {
          inHtml += "<div><label>地址</label>" + dz + "</div>"
        }

        if (item.type) {
          let fl = $.trim(item.type)
          if (fl != "") {
            inHtml += "<div><label>类别</label>" + fl + "</div>"
          }
        }
        inHtml += "</div>"

        return inHtml
      })

      //查询控制器
      this._queryPoi = new mars3d.query.BaiduPOI({
        // city: '合肥市',
      })
    }
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      if (opt.type != "append") {
        return
      }
      let that = this
      let img = $("#map-querybar img")
      img.each((index, item) => {
        $(item).attr("src", this.path + $(item).attr("src"))
      })

      if (this.config.position) {
        $("#map-querybar").css(this.config.position)
      }
      if (this.config.style) {
        $("#map-querybar").css(this.config.style)
      }

      // 搜索框
      $("#txt_querypoi").click(function () {
        // 文本框内容为空
        if ($.trim($(this).val()).length === 0) {
          that.hideAllQueryBarView()
          that.showHistoryList() // 显示历史记录
        }
      })

      let timetik = 0

      // 搜索框绑定文本框值发生变化,隐藏默认搜索信息栏,显示匹配结果列表
      $("#txt_querypoi").bind("input propertychange", () => {
        clearTimeout(timetik)
        timetik = setTimeout(() => {
          this.hideAllQueryBarView()
          this.clearLayers()

          let queryVal = $.trim($("#txt_querypoi").val())
          if (queryVal.length == 0) {
            // 文本框内容为空,显示历史记录
            this.showHistoryList()
          } else {
            this.autoTipList(queryVal, true)
          }
        }, 500)
      })

      // 点击搜索查询按钮
      $("#btn_querypoi").click(() => {
        clearTimeout(timetik)
        this.hideAllQueryBarView()

        let queryVal = $.trim($("#txt_querypoi").val())
        this.strartQueryPOI(queryVal, true)
      })
      //绑定回车键
      $("#txt_querypoi").bind("keydown", (event) => {
        if (event.keyCode == "13") {
          $("#btn_querypoi").click()
        }
      })

      // 返回查询结果面板界面
      $("#querybar_detail_back").click(() => {
        this.hideAllQueryBarView()
        $("#querybar_resultlist_view").show()
      })
    }
    //打开激活
    activate() {
      this.map.addLayer(this.graphicLayer)

      // 下侧状态栏提示
      const locationBar = this.map.controls.locationBar?.container
      if (locationBar) {
        this.queryAddressDOM = mars3d.DomUtil.create(
          "div",
          "mars3d-locationbar-content mars3d-locationbar-autohide",
          this.map.controls.locationBar.container
        )
        this.queryAddressDOM.style.marginRight = "50px"
      }

      //单击地图事件
      this.map.on(mars3d.EventType.clickMap, this.onMapClick, this)
      this.map.on(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this)
      this.onMapCameraChanged()
    }
    //关闭释放
    disable() {
      this.map.removeLayer(this.graphicLayer)

      //释放单击地图事件
      this.map.off(mars3d.EventType.clickMap, this.onMapClick, this)
      this.map.off(mars3d.EventType.cameraChanged, this.onMapCameraChanged, this)

      if (this.queryAddressDOM) {
        mars3d.DomUtil.remove(this.queryAddressDOM)
        delete this.queryAddressDOM
      }

      this.hideAllQueryBarView()
      this.clearLayers()
    }
    onMapClick(event) {
      // 点击地图区域,隐藏所有弹出框
      if ($.trim($("#txt_querypoi").val()).length == 0) {
        this.hideAllQueryBarView()
        $("#txt_querypoi").blur()
      }
    }
    onMapCameraChanged(event) {
      let radius = this.map.camera.positionCartographic.height //单位：米
      if (radius > 100000) {
        this.address = null
        this.queryAddressDOM.innerHTML = ""
        return
      }

      this._queryPoi.getAddress({
        location: this.map.getCenter(),
        success: (result) => {
          // console.log("地址", result);
          this.address = result
          this.queryAddressDOM.innerHTML = "地址：" + result.address
        }
      })
    }
    hideAllQueryBarView() {
      $("#querybar_histroy_view").hide()
      $("#querybar_autotip_view").hide()
      $("#querybar_resultlist_view").hide()
    }

    // 点击面板条目,自动填充搜索框,并展示搜索结果面板
    autoSearch(name) {
      $("#txt_querypoi").val(name)
      $("#btn_querypoi").trigger("click")
    }

    //===================与后台交互========================

    //显示智能提示搜索结果
    autoTipList(text, queryEx) {
      //输入经纬度数字时
      if (this.isLonLat(text)) {
        return
      }

      //查询外部widget
      if (this.hasExWidget() && queryEx) {
        this.autoExTipList(text)
        return
      }
      //查询外部widget

      //搜索提示
      this._queryPoi.autoTip({
        text: text,
        city: this.address?.city,
        location: this.map.getCenter(),
        success: (result) => {
          let inhtml = ""
          let pois = result.list
          for (let index = 0; index < pois.length; index++) {
            let name = pois[index].name
            // var num = pois[index].num;
            // if (num > 0) continue;

            inhtml += "<li><i class='fa fa-search'></i><a href=\"javascript:queryBaiduPOIWidget.autoSearch('" + name + "');\">" + name + "</a></li>"
          }
          if (inhtml.length > 0) {
            $("#querybar_ul_autotip").html(inhtml)
            $("#querybar_autotip_view").show()
          }
        }
      })
    }

    // 根据输入框内容，查询显示列表
    strartQueryPOI(text, queryEx) {
      if (text.length == 0) {
        toastr.warning("请输入搜索关键字！")
        return
      }

      // TODO:根据文本框输入内容,从数据库模糊查询到所有匹配结果（分页显示）
      this.addHistory(text)

      this.hideAllQueryBarView()

      //输入经纬度数字时
      if (this.isLonLat(text)) {
        this.centerAtLonLat(text)
        return
      }

      //查询外部widget
      if (this.hasExWidget() && queryEx) {
        let qylist = this.queryExPOI(text)
        return
      }
      //查询外部widget

      this.thispage = 1
      this.queryText = text

      this.query_city = this.address?.city
      // this.query_location = this.map.getCenter()
      // this.query_radius = this.map.camera.positionCartographic.height //单位：米

      this.queryTextByServer()
    }
    queryTextByServer() {
      //查询获取数据
      this._queryPoi.queryText({
        text: this.queryText,
        count: this.pageSize,
        page: this.thispage - 1,
        city: this.query_city,
        // location: this.query_location,
        // radius: this.query_radius,
        success: (result) => {
          if (!this.isActivate) {
            return
          }
          this.showPOIPage(result.list, result.allcount)
        }
      })
    }

    //===================显示查询结果处理========================
    showPOIPage(data, counts) {
      // count -- 显示搜索结果的数量；data -- 结果的属性，如地址电话等

      if (counts < data.length) {
        counts = data.length
      }
      this.allpage = Math.ceil(counts / this.pageSize)

      let inhtml = ""
      if (counts == 0) {
        inhtml += '<div class="querybar-page"><div class="querybar-fl">没有找到"<strong>' + this.queryText + '</strong>"相关结果</div></div>'
      } else {
        this.objResultData = this.objResultData || {}
        for (let index = 0; index < data.length; index++) {
          let item = data[index]
          let startIdx = (this.thispage - 1) * this.pageSize
          item.index = startIdx + (index + 1)

          let _id = index

          inhtml += `<div class="querybar-site" onclick="queryGaodePOIWidget.showDetail('${_id}')">
            <div class="querybar-sitejj">
              <h3>${item.index}、${item.name}
              <a id="btnShowDetail" href="${item.detailUrl}" target="_blank" class="querybar-more">更多&gt;</a> </h3>
              <p> ${item.address || ""}</p>
            </div>
          </div> `

          this.objResultData[_id] = item
        }

        //分页信息
        let _fyhtml
        if (this.allpage > 1) {
          _fyhtml =
            '<div class="querybar-ye querybar-fr">' +
            this.thispage +
            "/" +
            this.allpage +
            '页  <a href="javascript:queryBaiduPOIWidget.showFirstPage()">首页</a> <a href="javascript:queryBaiduPOIWidget.showPretPage()">&lt;</a>  <a href="javascript:queryBaiduPOIWidget.showNextPage()">&gt;</a> </div>'
        } else {
          _fyhtml = ""
        }

        //底部信息
        inhtml += '<div class="querybar-page"><div class="querybar-fl">找到<strong>' + counts + "</strong>条结果</div>" + _fyhtml + "</div>"
      }
      $("#querybar_resultlist_view").html(inhtml)
      $("#querybar_resultlist_view").show()

      this.showPOIArr(data)
      if (counts == 1) {
        this.showDetail("0")
      }
    }
    showFirstPage() {
      this.thispage = 1
      this.queryTextByServer()
    }
    showNextPage() {
      this.thispage = this.thispage + 1
      if (this.thispage > this.allpage) {
        this.thispage = this.allpage
        toastr.warning("当前已是最后一页了")
        return
      }
      this.queryTextByServer()
    }

    showPretPage() {
      this.thispage = this.thispage - 1
      if (this.thispage < 1) {
        this.thispage = 1
        toastr.warning("当前已是第一页了")
        return
      }
      this.queryTextByServer()
    }
    //点击单个结果,显示详细
    showDetail(id) {
      let item = this.objResultData[id]
      this.flyTo(item)
    }
    clearLayers() {
      this.graphicLayer.closePopup()
      this.graphicLayer.clear()
    }
    showPOIArr(arr) {
      this.clearLayers()

      arr.forEach((item) => {
        let jd = Number(item.lng)
        let wd = Number(item.lat)
        if (isNaN(jd) || isNaN(wd)) {
          return
        }

        item.lng = jd
        item.lat = wd

        //添加实体
        let graphic = new mars3d.graphic.PointEntity({
          position: Cesium.Cartesian3.fromDegrees(jd, wd),
          style: {
            pixelSize: 10,
            color: "#3388ff",
            outline: true,
            outlineColor: "#ffffff",
            outlineWidth: 2,
            scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
            clampToGround: true, //贴地
            visibleDepth: false, //是否被遮挡
            label: {
              text: item.name,
              font_size: 20,
              color: "rgb(240,255,255)",
              outline: true,
              outlineWidth: 2,
              outlineColor: Cesium.Color.BLACK,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffsetY: -10, //偏移量
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000),
              clampToGround: true, //贴地
              visibleDepth: false //是否被遮挡
            }
          },
          attr: item
        })
        this.graphicLayer.addGraphic(graphic)

        item._graphic = graphic
      })

      if (arr.length > 1) {
        this.graphicLayer.flyTo()
      }
    }
    flyTo(item) {
      let graphic = item._graphic
      if (graphic == null) {
        window.toastr.warning(item.name + " 无经纬度坐标信息！")
        return
      }

      this.map.flyToGraphic(graphic, { radius: 2000 })

      setTimeout(() => {
        this.graphicLayer.openPopup(graphic)
      }, 3000)
    }

    //===================坐标定位处理========================
    isLonLat(text) {
      let reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]*)?)|180(([.][0]*)?)),-?((0|[1-8]?[0-9]?)(([.][0-9]*)?)|90(([.][0]*)?))$/ /*定义验证表达式*/
      return reg.test(text) /*进行验证*/
    }
    centerAtLonLat(text) {
      let arr = text.split(",")
      if (arr.length != 2) {
        return
      }

      let jd = Number(arr[0])
      let wd = Number(arr[1])
      if (isNaN(jd) || isNaN(wd)) {
        return
      }

      //添加实体
      let graphic = new mars3d.graphic.PointEntity({
        position: Cesium.Cartesian3.fromDegrees(jd, wd),
        style: {
          color: "#3388ff",
          pixelSize: 10,
          outline: true,
          outlineColor: "#ffffff",
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1),
          clampToGround: true, //贴地
          visibleDepth: false //是否被遮挡
        }
      })
      this.graphicLayer.addGraphic(graphic)

      graphic.bindPopup(`<div class="mars-popup-titile">坐标定位</div>
              <div class="mars-popup-content" >
                <div><label>经度</label> ${jd}</div>
                <div><label>纬度</label>${wd}</div>
              </div>`)

      graphic.openHighlight()

      graphic.flyTo({
        radius: 1000, //点数据：radius控制视距距离
        scale: 1.5, //线面数据：scale控制边界的放大比例
        complete: () => {
          graphic.openPopup()
        }
      })
    }

    //===================历史记录相关========================
    showHistoryList() {
      $("#querybar_histroy_view").hide()

      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage == null) {
          return
        }
        this.arrHistory = eval(laststorage)
        if (this.arrHistory == null || this.arrHistory.length == 0) {
          return
        }

        let inhtml = ""
        for (let index = this.arrHistory.length - 1; index >= 0; index--) {
          let item = this.arrHistory[index]
          inhtml += "<li><a href=\"javascript:queryBaiduPOIWidget.autoSearch('" + item + "');\">" + item + "</a></li>"
        }
        // <i class='fa fa-history'/>
        $("#querybar_ul_history").html(inhtml)
        $("#querybar_histroy_view").show()
      })
    }

    clearHistory() {
      this.arrHistory = []
      localforage.removeItem(this.storageName)

      $("#querybar_ul_history").html("")
      $("#querybar_histroy_view").hide()
    }

    //记录历史值
    addHistory(data) {
      this.arrHistory = []
      localforage.getItem(this.storageName).then((laststorage) => {
        if (laststorage != null) {
          this.arrHistory = eval(laststorage)
        }
        //先删除之前相同记录
        haoutil.array.remove(this.arrHistory, data)
        this.arrHistory.push(data)

        if (this.arrHistory.length > 10) {
          this.arrHistory.splice(0, 1)
        }
        localforage.setItem(this.storageName, this.arrHistory)
      })
    }

    //======================查询非百度poi，联合查询处理=================
    //外部widget是否存在或启用
    hasExWidget() {
      if (window["queryBarWidget"] == null) {
        return false
      } else {
        this.exWidget = window.queryBarWidget
        return true
      }
    }
    autoExTipList(text) {
      this.exWidget.autoTipList(text, () => {
        this.autoTipList(text, false)
      })
    }
    //调用外部widget进行查询
    queryExPOI(text) {
      let layer = this.graphicLayer

      this.exWidget.strartQueryPOI(text, layer, () => {
        this.strartQueryPOI(text, false)
      })
    }
  }

  //注册到widget管理器中。
  window.queryBaiduPOIWidget = es5widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
