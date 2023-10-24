/**
 * 原生js项目widget模块化框架
 */

;(function () {
  const Loader = window.Loader //loader.js中定义
  const jQuery = window.jQuery
  if (!jQuery) {
    throw new Error("请引入 jQuery 库")
  }

  const layer = window.layer // 请引入layer弹窗插件
  if (!window.layer) {
    throw new Error("请引入 layer.js弹窗 库")
  }

  // 内部参数
  let thismap
  let basePath = ""
  let widgetsdata = []
  let defoptions
  let cacheVersion
  let isdebuger
  const removeKeys = ["_class"]

  /**
   * widget事件类型枚举
   *  @enum {string}
   */
  const WidgetEventType = {
    /**
     * 在实例初始化之后、创建之前执行
     */
    beforeCreate: "beforeCreate",
    /**
     * 实例创建后执行
     */
    created: "created",
    /**
     * 在activat挂载开始之前调用
     */
    beforeActivate: "beforeActivate",
    /**
     * activate方法调用后
     */
    activated: "activated",
    /**
     *view弹窗构造完成后后调用
     */
    openView: "openView",
    /**
     * 实例销毁之前调用
     */
    beforeDisable: "beforeDisable",
    /**
     *实例销毁完成调用
     */
    disabled: "disabled",

    /**
     *加载完成 未做任何其他处理前
     */
    loadBefore: "loadBefore",
    /**
     *加载完成，执行所有内部处理后
     */
    load: "load"
  }

 /**
 * 初始化widget管理器，在构造完成map后调用一次即可。
 *
 * @param {Map} map 地图对象
 * @param {object} [widgetcfg={}] 全局配置(一般存放在widget.json)，包括：
 * @param {BaseWidget.widgetOptions} [widgetcfg.defaultOptions] 所有widget的默认参数值，可以系统内所有widget相同配置统一在此处传入，额外的个性化的再配置到各widget中。
 * @param {BaseWidget.widgetOptions[]} [widgetcfg.openAtStart] 默认自启动并不可释放的插件，其中autoDisable和openAtStart固定，设置无效。
 * @param {BaseWidget.widgetOptions[]} [widgetcfg.widgets] 所有插件配置，传入后后续激活时，只用传入uri即可。
 * @param {string} [widgetcfg.version] 加载资源时，附加的参数，主要为了清理浏览器缓存，可选值："time"（实时时间戳）或固定的字符串值，每次发布新版本换下固定值。
 * @param {boolean} [widgetcfg.debugger] 是否显示插件测试栏，true时会在地图下侧显示所有插件测试按钮，方便测试。
 *
 * @param {string} [_basePath=''] widgets目录所在的主路径(统一前缀), 如果widgets目录不在主页面一起或存在路由时，可以传入自定义主目录，值为 widgets目录相对于当前html页面的相对路径。
 * @return {void}  无
 * @example
let widgetCfg ={
  "version": "2017",
  "defaultOptions": {
    "style": "dark",
    "windowOptions": {
      "skin": "layer-mars-dialog animation-scale-up",
      "position": {
        "top": 50,
        "right": 10
      },
      "maxmin": false,
      "resize": true
    },
    "autoReset": false,
    "autoDisable": true,
    "disableOther": true
  },
  "openAtStart": [
    {
      "name": "放大缩小按钮",
      "uri": "widgets/toolButton/zoom.js"
    }
  ],
  "widgets": [
    {
      "name": "模板-div弹窗",
      "uri": "widgets/_example_divwin/widget.js"
    },
    {
      "name": "模板-append模板",
      "uri": "widgets/_example_append/widget.js"
    }
  ]
}
es5widget.init(map, widgetCfg, './')
 */
  function init(map, widgetcfg = {}, _basePath = "") {
    thismap = map
    basePath = _basePath

    widgetsdata = []
    defoptions = mars3d.Util.merge(
      {
        windowOptions: { position: "rt", maxmin: false, resize: true },
        autoDisable: true,
        disableOther: true
      },
      widgetcfg.defaultOptions
    )

    cacheVersion = widgetcfg.version
    if (cacheVersion === "time") {
      cacheVersion = new Date().getTime()
    }

    // 将自启动的加入
    let arrtemp = widgetcfg.openAtStart
    if (arrtemp && arrtemp.length > 0) {
      for (let i = 0; i < arrtemp.length; i++) {
        const item = arrtemp[i]
        if (!item.hasOwnProperty("uri") || item.uri === "") {
          // eslint-disable-next-line no-console
          console.error("widget未配置uri", item)
          continue
        }
        if (item.hasOwnProperty("visible") && !item.visible) {
          continue
        }

        item.autoDisable = false
        item.openAtStart = true
        item._nodebug = true

        bindDefOptions(item)

        item._firstConfigBak = { ...item }
        widgetsdata.push(item)
      }
    }

    // 显示测试栏
    // 为了方便测试，所有widget会在页面下侧生成一排按钮，每个按钮对应一个widget，单击后激活对应widget
    isdebuger = widgetcfg.debugger
    if (isdebuger) {
      const inhtml =
        '<div id="widget-testbar" class="mars3d-widgetbar animation-slide-bottom no-print-view" > ' +
        '     <div style="height: 30px; line-height:30px;"><b style="color: #4db3ff;">widget测试栏</b>&nbsp;&nbsp;<button  id="widget-testbar-remove"  type="button" class="btn btn-link btn-xs">关闭</button> </div>' +
        '     <button id="widget-testbar-disableAll" type="button" class="btn btn-info" ><i class="fa fa-globe"></i>漫游</button>' +
        "</div>"
      jQuery("body").append(inhtml)

      jQuery("#widget-testbar-remove").click(function (e) {
        removeDebugeBar()
      })
      jQuery("#widget-testbar-disableAll").click(function (e) {
        disableAll()
      })
    }

    // 将配置的加入
    arrtemp = widgetcfg.widgets
    if (arrtemp && arrtemp.length > 0) {
      for (let i = 0; i < arrtemp.length; i++) {
        const item = arrtemp[i]
        if (item.type === "group") {
          let inhtml =
            ' <div class="btn-group dropup">  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-align-justify"></i>' +
            item.name +
            ' <span class="caret"></span></button> <ul class="dropdown-menu">'
          for (let j = 0; j < item.children.length; j++) {
            const childItem = item.children[j]
            if (!childItem.hasOwnProperty("uri") || childItem.uri === "") {
              // eslint-disable-next-line no-console
              console.error("widget未配置uri", childItem)
              continue
            }

            inhtml +=
              ' <li data-widget="' + childItem.uri + '" class="widget-btn" ><a href="#"><i class="fa fa-star"></i>' + childItem.name + "</a></li>"

            bindDefOptions(childItem)
            childItem._firstConfigBak = { ...childItem }
            widgetsdata.push(childItem) // 将配置的加入
          }
          inhtml += "</ul></div>"

          if (isdebuger && !item._nodebug) {
            jQuery("#widget-testbar").append(inhtml)
          }
        } else {
          if (!item.hasOwnProperty("uri") || item.uri === "") {
            // eslint-disable-next-line no-console
            console.error("widget未配置uri", item)
            continue
          }

          // 显示测试栏
          if (isdebuger && !item._nodebug) {
            const inhtml =
              '<button type="button" class="btn btn-primary widget-btn" data-widget="' +
              item.uri +
              '"  > <i class="fa fa-globe"></i>' +
              item.name +
              " </button>"
            jQuery("#widget-testbar").append(inhtml)
          }

          bindDefOptions(item)
          item._firstConfigBak = { ...item }
          widgetsdata.push(item) // 将配置的加入
        }
      }

      if (isdebuger) {
        jQuery("#widget-testbar .widget-btn").each(function () {
          jQuery(this).click(function (e) {
            const uri = jQuery(this).attr("data-widget")
            if (!uri || uri === "") {
              return
            }

            if (isActivate(uri)) {
              disable(uri)
            } else {
              activate(uri)
            }
          })
        })
      }
    }

    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]

      if (item.openAtStart || item.createAtStart) {
        _arrLoadWidget.push(item)
      }
    }

    jQuery(window).resize(function () {
      for (let i = 0; i < widgetsdata.length; i++) {
        const item = widgetsdata[i]
        if (item._class) {
          item._class.indexResize() // BaseWidget: indexResize
        }
      }
    })

    if (isdebuger) {
      const hash = getLocationParam()
      if (hash) {
        activate(hash)
      }
    }

    loadWidgetJs()
  }

  /**
   * 获取默认init时中传入配置的 windowOptions 参数
   * @return {object} windowOptions参数默认值
   * @see BaseWidget.widgetOptions
   */
  function getDefWindowOptions() {
    return mars3d.Util.clone(defoptions.windowOptions, removeKeys)
  }

  function getLocationParam() {
    let param = window.location.toString()
    if (param.indexOf("#") === -1) {
      return ""
    }
    param = param.split("#")
    if (param && param.length > 0) {
      return param[1]
    }
  }

  function bindDefOptions(item) {
    // 赋默认值至options（跳过已存在设置值）
    if (defoptions) {
      for (const aa in defoptions) {
        if (aa === "windowOptions") {
          // for (var jj in defoptions['windowOptions']) {
          //    if (!item['windowOptions'].hasOwnProperty(jj)) {
          //        item['windowOptions'][jj] = defoptions['windowOptions'][jj];
          //    }
          // }
        } else if (!item.hasOwnProperty(aa)) {
          item[aa] = defoptions[aa]
        }
      }
    }

    // 赋值内部使用属性
    item.path = getFilePath(basePath + item.uri)
    item.name = item.name || item.label // 兼容name和label命名
  }

  /**
 * 激活指定 widget模块
 *
 * @param {string|BaseWidget.widgetOptions} item 指widget模块的uri 或 指模块的配置参数,当有配置参数时，参数优先级是：
 * 【activate方法传入的配置 > init方法传入的配置(widget.json) > widget.js内部配置的】
 * @param {Map} [item.map] 当单页面简单场景没有init时，也可以传入map来使用单个widget
 * @param {boolean} [noDisableOther=false]  不释放其他已激活的widget
 * @return {BaseWidget.widgetOptions}  指widget模块对象
 * @example
//常用方式，直接使用uri
es5widget.activate("widgets/bookmark/widget.js");

//使用对象，可以传入更多参数，具体参数参看配置项手册，。
es5widget.activate({
  name:"视角书签"
  uri: "widgets/bookmark/widget.js",
  autoDisable: true,
  testdata:'测试数据1987', //传数据进widget内部，widget内部使用this.config.testdata获取到传的数据
  success:function(thisWidget){
    //创建完成的回调方法
  }
});
 */
  function activate(item, noDisableOther) {
    if (!thismap && item.map) {
      init(item.map, {}, item.basePath)
    }

    // 参数是字符串id或uri时
    if (typeof item === "string") {
      item = { uri: item }

      if (noDisableOther != null) {
        // 是否释放其他已激活的widget
        item.disableOther = !noDisableOther
      }
    } else {
      if (!item.uri) {
        // eslint-disable-next-line no-console
        console.error("activate激活widget时需要uri参数！", item)
      }
    }

    let thisItem
    for (let i = 0; i < widgetsdata.length; i++) {
      const othitem = widgetsdata[i]
      if (item.uri === othitem.uri || (othitem.id && item.uri === othitem.id)) {
        thisItem = othitem
        if (thisItem.isloading) {
          return thisItem
        } // 激活了正在loading的widget 防止快速双击了菜单

        // 赋值
        for (const aa in item) {
          if (aa === "uri") {
            continue
          }
          thisItem[aa] = item[aa]
        }
        break
      }
    }

    if (!thisItem) {
      bindDefOptions(item)
      thisItem = item
      // 非config中配置的，外部传入，首次激活
      if (!item._firstConfigBak) {
        item._firstConfigBak = { ...item }
      }
      widgetsdata.push(item)
    }

    if (isdebuger) {
      // eslint-disable-next-line no-console
      console.log("开始激活widget：" + thisItem.uri)
      window.location.hash = "#" + thisItem.uri
    }

    // 释放其他已激活的widget
    if (thisItem.disableOther) {
      if (Array.isArray(thisItem.disableOther)) {
        disable(thisItem.disableOther)
      } else {
        disableAll(thisItem.uri, thisItem.group)
      }
    }

    if (thisItem.group) {
      disableGroup(thisItem.group, thisItem.uri)
    }

    // 激活本widget
    if (thisItem._class) {
      if (thisItem._class.isActivate) {
        // 已激活时
        if (thisItem._class.update) {
          // 刷新
          thisItem._class.update()
        } else {
          // 重启
          _reStart(thisItem)
        }
      } else {
        thisItem._class.activateBase() // BaseWidget: activateBase
      }
    } else {
      for (let i = 0; i < _arrLoadWidget.length; i++) {
        if (_arrLoadWidget[i].uri === thisItem.uri) {
          // 如果已在加载列表中的直接跳出
          return _arrLoadWidget[i]
        }
      }
      _arrLoadWidget.push(thisItem)

      if (_arrLoadWidget.length === 1) {
        loadWidgetJs()
      }
    }
    return thisItem
  }

  let timetemp
  // 重启
  function _reStart(thisItem) {
    clearInterval(timetemp)

    thisItem._class.disableBase()
    timetemp = setInterval(function () {
      if (thisItem._class.isActivate) {
        return
      }
      thisItem._class.activateBase()
      clearInterval(timetemp)
    }, 200)
  }

  /**
   * 获取指定的widget配置信息
   *
   * @param {string} uri widget的uri 或 id
   * @return {BaseWidget.widgetOptions} widget配置信息
   */
  function getWidget(uri) {
    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]

      if (uri === item.uri || uri === item.id) {
        return item
      }
    }
  }

  /**
   * 获取指定的widget 对应的实例化对象
   *
   * @param {string} uri widget的uri 或 id
   * @return {BaseWidget} widget对应的实例化对象
   */
  function getClass(uri) {
    const item = getWidget(uri)
    if (item) {
      return item._class
    } else {
      return null
    }
  }

  /**
   * 获取widget的当前激活状态
   *
   * @param {string} uri widget的uri 或 id
   * @return {boolean} 是否激活
   */
  function isActivate(uri) {
    const _class = getClass(uri)
    if (!_class) {
      return false
    }
    return _class.isActivate
  }

  /**
   * 设置view弹窗的显示和隐藏，基于修改css实现
   *
   * @param {string} uri widget的uri 或 id
   * @param {boolean} show 是否显示
   * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
   * @return {boolean} 是否成功设置
   */
  function setViewShow(uri, show, index) {
    const _class = getClass(uri)
    if (_class) {
      _class.setViewShow(show, index)
    }
    return _class?.isActivate
  }

  /**
   * 释放指定的widget
   *
   * @param {string|string[]} uri widget的uri 或 id
   * @return {boolean} 是否成功调用了释放
   */
  function disable(uri) {
    if (!uri) {
      return false
    }

    if (Array.isArray(uri)) {
      const arrUri = uri
      for (let i = 0; i < widgetsdata.length; i++) {
        const item = widgetsdata[i]

        for (let j = 0; j < arrUri.length; j++) {
          const uri = arrUri[j]
          if (item._class && (uri === item.uri || uri === item.id)) {
            item._class.disableBase()
            arrUri.splice(j, 1)
            break
          }
        }
      }
    } else {
      if (typeof uri === "object") {
        uri = uri.uri
      }
      for (let i = 0; i < widgetsdata.length; i++) {
        const item = widgetsdata[i]

        if (item._class && (uri === item.uri || uri === item.id)) {
          item._class.disableBase()
          return true
        }
      }
    }
    return false
  }

  /**
   * 关闭释放所有widget
   *
   * @export
   * @param {string|boolean} [nodisable] 传string时 指定不释放的widget的uri或id ，传true值强制释放所有widget(默认autoDisable为false的widet不会释放)
   * @param {string} [group] 指定强制释放的group名(默认autoDisable为false的widet不会释放)，传入group值后会强制释放所有同group组的widget
   * @return {void}  无
   */
  function disableAll(nodisable, group) {
    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]

      if (group && item.group === group) {
        // 同组别的全部释放
      } else {
        if (nodisable !== true && !item.autoDisable) {
          continue
        }
      }

      // 指定不释放的跳过
      if (nodisable && (nodisable === item.uri || nodisable === item.id)) {
        continue
      }

      if (item._class) {
        item._class.disableBase() // BaseWidget: disableBase
      }
    }
  }

  /**
   * 关闭释放同组widget
   *
   * @param {string} group 指定强制释放的group名
   * @param {string} [nodisable]  指定不释放的widget的uri或id
   * @return {void}  无
   */
  function disableGroup(group, nodisable) {
    if (!group) {
      return
    }

    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]
      if (item.group === group) {
        // 指定不释放的跳过
        if (nodisable && (nodisable === item.uri || nodisable === item.id)) {
          continue
        }
        if (item._class) {
          item._class.disableBase() /// /BaseWidget: disableBase
        }
      }
    }
  }

  /**
   * 遍历所有widget
   * @param {Function} method 回调方法
   * @return {void}  无
   */
  function eachWidget(method) {
    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]
      method(item)
    }
  }

  const _arrLoadWidget = []
  let loadItem
  let isloading
  function loadWidgetJs() {
    if (_arrLoadWidget.length === 0) {
      return
    }

    if (isloading) {
      setTimeout(loadWidgetJs, 500)
      return
    }
    isloading = true

    loadItem = _arrLoadWidget[0]
    loadItem.isloading = true
    let _uri = loadItem.uri
    if (cacheVersion) {
      if (_uri.indexOf("?") === -1) {
        _uri += "?cache=" + cacheVersion
      } else {
        _uri += "&cache=" + cacheVersion
      }
    }

    if (window.NProgress) {
      window.NProgress.start()
    }

    fire(WidgetEventType.loadBefore, {
      sourceTarget: loadItem
    })

    Loader.async([basePath + _uri], function () {
      isloading = false
      loadItem.isloading = false

      if (window.NProgress) {
        window.NProgress.done(true)
      }

      _arrLoadWidget.shift()
      loadWidgetJs()
    })
  }

  /**
   * 绑定类到当前对应js的widget中。
   *
   * @param {BaseWidget} _class 定义的BaseWidget子类
   * @return {object} 实例化后的对象
   */
  function bindClass(_class) {
    fire(WidgetEventType.load, {
      sourceTarget: _class
    })

    if (!loadItem) {
      const _jspath = getThisJSPath()
      for (let i = 0; i < widgetsdata.length; i++) {
        const item = widgetsdata[i]
        if (_jspath.endsWith(item.uri)) {
          item.isloading = false
          item._class = new _class(thismap, item)
          item._class.activateBase() // BaseWidget: activateBase
          return item._class
        }
      }
    } else {
      loadItem.isloading = false
      loadItem._class = new _class(thismap, loadItem)
      loadItem._class.activateBase() // BaseWidget: activateBase
      return loadItem._class
    }
  }

  function getThisJSPath() {
    let jsPath
    const js = document.scripts
    for (let i = js.length - 1; i >= 0; i--) {
      jsPath = js[i].src
      if (!jsPath) {
        continue
      }
      if (jsPath.indexOf("widgets") === -1) {
        continue
      }
      // jsPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
      return jsPath
    }
    return ""
  }

  // 获取路径
  function getFilePath(file) {
    const pos = file.lastIndexOf("/")
    return file.substring(0, pos + 1)
  }

  /**
   * 移除Widget测试栏（当有开启debugger时）
   * @return {void}  无
   */
  function removeDebugeBar() {
    jQuery("#widget-testbar").remove()
  }

  /**
   * 获取配置的version配置参数，用于附加清除浏览器缓存
   * @return {string} 配置的version参数
   */
  function getCacheVersion() {
    return cacheVersion
  }

  /**
   * 获取init方法传入的主目录配置参数
   * @return {string} 主目录配置参数
   */
  function getBasePath() {
    return basePath
  }

  /**
   * 销毁对象
   * @return {void}  无
   */
  function destroy() {
    for (let i = 0; i < widgetsdata.length; i++) {
      const item = widgetsdata[i]

      if (item._class) {
        item._class.disableBase() // BaseWidget: disableBase

        if (item._class.destroy) {
          item._class.destroy()
        }
        delete item._class
      }
    }

    thismap = null
  }

  // 事件相关
  const eventTarget = new mars3d.BaseClass()

  /**
   * 绑定指定类型事件监听器
   *
   * @param {WidgetEventType|WidgetEventType[]} types 事件类型
   * @param {Function} [fn] 绑定的监听器回调方法
   * @param {object} [context]  侦听器的上下文(this关键字将指向的对象)。
   * @return {void}  无
   */
  function on(types, fn, context) {
    return eventTarget.on(types, fn, context)
  }

  /**
   * 解除绑定指定类型事件监听器
   *
   * @param {WidgetEventType|WidgetEventType[]} types 事件类型
   * @param {Function} [fn] 绑定的监听器回调方法
   * @param {object} [context]  侦听器的上下文(this关键字将指向的对象)。
   * @return {void}  无
   */
  function off(types, fn, context) {
    return eventTarget.off(types, fn, context)
  }

  /**
   * 触发指定类型的事件。
   *
   * @param {WidgetEventType} type 事件类型
   * @param {object} data 传输的数据或对象，可在事件回调方法中event对象中获取进行使用
   * @param {BaseClass|object} [propagate] 将事件传播给父类 (用addEventParent设置)
   * @return {void}  无
   */
  function fire(type, data, propagate) {
    return eventTarget.fire(type, data, propagate)
  }

  /**
   * 绑定一次性执行的指定类型事件监听器
   * 与on类似，监听器只会被触发一次，然后被删除。
   *
   * @param {WidgetEventType|WidgetEventType[]} types 事件类型
   * @param {Function} [fn] 绑定的监听器回调方法
   * @param {object} [context]  侦听器的上下文(this关键字将指向的对象)。
   * @return {void}  无
   */
  function once(types, fn, context) {
    return eventTarget.once(types, fn, context)
  }

  /**
   * 是否有绑定指定的事件
   *
   * @param {WidgetEventType} type 事件类型
   * @param {BaseClass} [propagate] 是否判断指定的父类 (用addEventParent设置的)
   * @return {boolean} 是否存在
   */
  function listens(type, propagate) {
    return eventTarget.listens(type, propagate)
  }

  let _resources_cache = []

  /**
   * widget 配置参数
   *
   * @typedef {object} BaseWidget.widgetOptions
   *
   * @property {string} name 必须，中文名称，用于标识和弹窗标题。
   * @property {string} uri 必须，JS文件路径，路径是相对于widgets目录的路径。如："widgets/bookmark/widget.js"
   * @property {string} [id] 定义该插件的唯一标识,方便后续判断。
   * @property {boolean} [autoDisable=true] 激活其他新插件时，是否自动释放本插件
   * @property {boolean} [disableOther=true] 激活本插件时，是否释放其它已激活的插件
   * @property {string} [group] 配置group后，同group下的widget互斥，打开任意一个会自动释放其他的
   * @property {object} [windowOptions] 存在弹窗的插件的弹窗相关参数配置，更多参数请参考 [layer弹窗API]{@link https://layui.gitee.io/v2/docs/modules/layer.html} 包括：
   * @property {number|string} [windowOptions.width] 窗口宽度，可以是 像素数字(像素值) 或者 字符串(屏幕宽度百分比)，示例：200 或 "20%"
   * @property {number|string} [windowOptions.height] 窗口高度，可以是 像素数字(像素值) 或者 字符串(屏幕高度百分比)，示例：600 或 "50%"
   * @property {string|object} [windowOptions.position='auto'] 窗口所在位置坐标，配置字符串可选值：auto垂直水平居中，t顶部,b底部,r右边缘,l左边缘,lt左上角,lb左下角,rt右上角,rb右下角；也可以配置对象：
   * @property {number|string} [windowOptions.position.top] 位置css的top值，可以是 像素数字(像素值) 或者 字符串(屏幕高度百分比)，示例：10 或 "5%"
   * @property {number|string} [windowOptions.position.bottom] 位置css的top值，可以是 像素数字(像素值) 或者 字符串(屏幕高度百分比)，示例：10 或 "5%"
   * @property {number|string} [windowOptions.position.left] 位置css的top值，可以是 像素数字(像素值) 或者 字符串(屏幕宽度百分比)，示例：10 或 "5%"
   * @property {number|string} [windowOptions.position.right] 位置css的top值，可以是 像素数字(像素值) 或者 字符串(屏幕宽度百分比)，示例：10 或 "5%"
   * @property {number} [windowOptions.minHeight] 限定的窗口最小高度(像素值)，默认不限制
   * @property {number} [windowOptions.maxHeight] 限定的窗口最大高度(像素值)，默认不限制
   * @property {number} [windowOptions.minWidth] 限定的窗口最小宽度(像素值)，默认不限制
   * @property {number} [windowOptions.maxWidth] 限定的窗口最大宽度(像素值)，默认不限制
   *
   * @property {boolean} [windowOptions.maxmin=true] 是否可以在弹层右下角拖动来拉伸尺寸
   * @property {number|Array} [windowOptions.shade=0] 遮罩，默认为0不显示，可配置数字0.3透明度的黑色背景（'#000'），其他颜色，可以shade: [0.8, '#393D49']
   * @property {boolean} [windowOptions.shadeClose=false] 当shade是存在的，点击弹层外区域后是否关闭弹窗。
   * @property {number} [windowOptions.closeBtn=1] 当为0时，不显示关闭按钮，配置1和2来展示两种风格的关闭按钮
   * @property {number} [windowOptions.noTitle=false] 是否不显示标题，为true是不显示标题
   * @property {boolean} [windowOptions.show=true] 激活后是否显示弹窗，false时激活后自动隐藏弹窗。
   *
   * @property {boolean} [openAtStart=false] 打开系统后是否自动启动本插件
   * @property {string} [style] 添加到widget的view中的class样式名
   * @property {object} [css] 添加到widget的css值
   * @property {*} [多个参数] 传入数据等，定义的任意参数在widget内部方法中都可以通过this.config获取到
   */

  /**
 * 原生JS技术栈下，widget基础类,
 * 需要继承后使用，不用手动实例化，框架内部自动实例化及相关处理。
 *
 * @param {Map} map 地图对象
 * @param {BaseWidget.widgetOptions} options 配置参数
 * @class BaseWidget
 * @extends {BaseClass}
 * @see [支持的事件类型]{@link WidgetEventType}

 * @example
//使用示例
class MyWidget extends es5widget.BaseWidget {
  //外部资源配置
  get resources() {
    return [
      'js/test.js', //当前同目录下
      './lib/dom2img/dom-to-image.js', //主页面相同目录下
    ]
  }
  //弹窗配置
  get view() {
    return {
      type: 'window',
      url: 'view.html',
      windowOptions: {  width: 250 },
    }
  }
  //初始化[仅执行1次]
  create() {}
  //每个窗口创建完成后调用
  winCreateOK(opt, result) {
    this.viewWindow = result
  }
  //打开激活
  activate() {}
  //关闭释放
  disable() {
    this.viewWindow = null
  }
}

//注册到widget管理器中。
es5widget.bindClass(MyWidget)
 */
  class BaseWidget extends mars3d.BaseClass {
    constructor(map, options) {
      super(options)

      /**
       *  获取当前地图
       * @type {Map}
       * @readonly
       */
      this.map = map

      /**
       *  获取当前配置参数
       * @type {BaseWidget.widgetOptions}
       * @readonly
       */
      this.options = options // 配置的config信息

      /**
       *  获取当前配置参数，别名，同options
       * @type {BaseWidget.widgetOptions}
       * @readonly
       */
      this.config = options

      /**
       *  获取当前widget的目录路径
       * @type {string}
       * @readonly
       */
      this.path = options.path || "" // 当前widget目录相对路径

      /**
       *  是否激活状态
       * @type {boolean}
       * @readonly
       */
      this.isActivate = false

      /**
       *  是否已创建
       * @type {boolean}
       * @readonly
       */
      this.isCreate = false

      this._viewcreate_allcount = 0
      this._viewcreate_okcount = 0
      this._viewConfig = this.view

      this.init()
    }

    /**
     * 该模块依赖的外部js、css资源文件，会在实例化之前加入的页面中。
     * 默认引用是当前widget所在同path目录的资源，
     * 相当于html主页面的资源 或 外部资源 请 以 “/” 或 “.” 或 “http” 开始的url
     * @type {string[]}
     * @readonly
     * @abstract
     */
    get resources() {
      return null
    }

    /**
     * 定义关联的view弹窗或页面配置信息，目前支持3种类型，
     * （1）type:'window'，iframe模式弹窗 ,参考_example示例， 独立的html子页面，比较自由，简单粗暴、无任何限制；可以每个页面用不同的UI和第三方插件不用考虑冲突问题；任何水平的开发人员均容易快速开发。
     * （2）type:'divwindow'，div元素模式弹窗 参考_example_divwin示例，可直接互相访问，这种模式弊端是易引起模块间id命名冲突，在css和html中命名时需注意。
     * （3）type:'append'，任意html元素 参考_example_append示例，任意div节点，比较自由。
     * 为空时表示当前模块无关联的view页面，
     * 其中url地址规则，参考resources说明
     * @type {object|object[]}
     * @readonly
     * @abstract
     */
    get view() {
      return null
    }

    //= =============激活插件=================
    /**
     * 激活widget，同 es5widget.activate方法
     * @return {void}  无
     */
    activateBase() {
      const that = this

      if (this.isActivate) {
        // 已激活状态时跳出
        this.eachView(function (viewopt) {
          if (viewopt._dom) {
            // 将层置顶
            jQuery(".layui-layer").each(function () {
              jQuery(this).css("z-index", 19891000)
            })
            jQuery(viewopt._dom).css("z-index", 19891014)
          }
        })
        return
      }

      eventTarget.fire(WidgetEventType.beforeActivate, {
        sourceTarget: this
      })
      this.beforeActivate()
      this.isActivate = true

      if (!this.isCreate) {
        eventTarget.fire(WidgetEventType.beforeCreate, {
          sourceTarget: this
        })

        // 首次进行创建
        if (this.resources && this.resources.length > 0) {
          const resources = []

          for (let i = 0; i < this.resources.length; i++) {
            let _resource = this.resources[i]
            _resource = this._getUrl(_resource)

            if (_resources_cache.indexOf(_resource) !== -1) {
              continue
            } // 不加重复资源

            resources.push(_resource)
          }
          _resources_cache = _resources_cache.concat(resources) // 不加重复资源

          Loader.async(resources, function () {
            const result = that.create(function () {
              that._createWidgetView()
              that.isCreate = true
            })
            eventTarget.fire(WidgetEventType.created, {
              sourceTarget: that
            })

            if (result) {
              return
            }
            if (that.options.createAtStart) {
              that.options.createAtStart = false
              that.isActivate = false
              that.isCreate = true
              return
            }
            that._createWidgetView()
            that.isCreate = true
          })
          return
        } else {
          const result = this.create(function () {
            that._createWidgetView()
            this.isCreate = true
          })
          eventTarget.fire(WidgetEventType.created, {
            sourceTarget: this
          })

          if (result) {
            return
          }
          if (that.options.createAtStart) {
            that.options.createAtStart = false
            that.isActivate = false
            that.isCreate = true
            return
          }
        }
        this.isCreate = true
      }
      this._createWidgetView()
    }

    /**
     * 构造方法完成后的钩子方法，子类继承后按需使用
     * @return {void}  无
     * @abstract
     */
    init() {}

    /**
     * 模块初始化，仅首次初始化执行1次
     * @param {Function} [endfun] 当create内存在异步时，可以异步后调用下endfun
     * @return {void}  无
     * @abstract
     */
    create() {}

    // 创建插件的view
    _createWidgetView() {
      const viewopt = this._viewConfig
      if (viewopt === undefined || viewopt == null) {
        this._startActivate()
      } else if (Array.isArray(viewopt)) {
        this._viewcreate_allcount = viewopt.length
        this._viewcreate_okcount = 0

        for (let i = 0; i < viewopt.length; i++) {
          this.createItemView(viewopt[i])
        }
      } else {
        this._viewcreate_allcount = 1
        this._viewcreate_okcount = 0
        this.createItemView(viewopt)
      }
    }

    /**
     * 遍历所有view配置
     *
     * @param {Function} callback 回调方法
     * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
     * @return {*} callback执行的返回结果
     */
    eachView(callback, index) {
      const viewopt = this._viewConfig
      if (viewopt === undefined || viewopt == null) {
        return false
      } else if (Array.isArray(viewopt)) {
        let hascal = false
        if (index != null) {
          return callback(viewopt[index])
        }
        for (let i = 0; i < viewopt.length; i++) {
          hascal = callback(viewopt[i])
        }
        return hascal
      } else {
        return callback(viewopt)
      }
    }

    createItemView(viewopt) {
      const that = this
      switch (viewopt.type) {
        case "divwindow":
          this._openDivWindow(viewopt)
          break
        case "append":
          that.getHtml(this._getUrl(viewopt.url), function (html) {
            that._appendView(viewopt, html)
          })
          break
        case "custom": // 自定义
          viewopt.open(
            this._getUrl(viewopt.url),
            function (html) {
              that.winCreateOK(viewopt, html)
              eventTarget.fire(WidgetEventType.openView, {
                sourceTarget: that,
                view: viewopt,
                dom: html
              })
              that._viewcreate_okcount++
              if (that._viewcreate_okcount >= that._viewcreate_allcount) {
                that._startActivate(html)
              }
            },
            this
          )
          break
        case "window":
        default:
          this._openWindow(viewopt)
          break
      }
    }

    //= =============layer弹窗=================
    _openWindow(viewopt) {
      const view_url = this._getUrl(viewopt.url)

      const opts = {
        type: 2,
        content: [view_url, "no"],
        success: (layero, index) => {
          if (!this.isActivate) {
            layer.close(index)
            return
          }
          if (viewopt._layerIdx !== index) {
            layer.close(viewopt._layerIdx)
            viewopt._layerIdx = index
          }

          viewopt._layerOpening = false
          viewopt._dom = layero

          // 得到iframe页的窗口对象，执行iframe页的方法：viewWindow.method();
          const viewWindow = window[layero.find("iframe")[0].name]

          // 绑定常用对象到子页面，方便直接使用
          viewWindow.map = this.map
          viewWindow.mars3d = mars3d
          viewWindow.Cesium = mars3d.Cesium

          // 设置css
          if (this.options.css) {
            jQuery("#layui-layer" + viewopt._layerIdx).css(this.options.css)
          }

          // 隐藏弹窗
          if (viewopt.windowOptions.hasOwnProperty("show") && !viewopt.windowOptions.show) {
            jQuery(layero).hide()
          }

          layer.setTop(layero)

          this.winCreateOK(viewopt, viewWindow)
          eventTarget.fire(WidgetEventType.openView, {
            sourceTarget: this,
            view: viewopt,
            dom: layero
          })

          this._viewcreate_okcount++
          if (this._viewcreate_okcount >= this._viewcreate_allcount) {
            this._startActivate(layero)
          }

          // 通知页面,页面需要定义initWidgetView方法
          if (viewWindow && viewWindow.initWidgetView) {
            if (this.config?.style) {
              jQuery(viewWindow.document.body).addClass(this.config.style)
            }

            viewWindow.initWidgetView(this)
          } else {
            mars3d.Log.logError(view_url + "页面没有定义function initWidgetView(widget)方法，无法初始化widget页面!")
          }
        }
      }
      if (viewopt._layerIdx && viewopt._layerIdx > 0) {
        layer.close(viewopt._layerIdx)
        viewopt._layerIdx = -1
      }

      viewopt._layerOpening = true
      viewopt._layerIdx = layer.open(this._getWinOpt(viewopt, opts))
    }

    _openDivWindow(viewopt) {
      const view_url = this._getUrl(viewopt.url)
      // div弹窗
      this.getHtml(view_url, (data) => {
        const opts = {
          type: 1,
          content: data,
          success: (layero, index) => {
            if (!this.isActivate) {
              layer.close(index)
              return
            }
            if (viewopt._layerIdx !== index) {
              layer.close(viewopt._layerIdx)
              viewopt._layerIdx = index
            }

            viewopt._layerOpening = false
            viewopt._dom = layero

            // 隐藏弹窗
            if (viewopt.windowOptions.hasOwnProperty("show") && !viewopt.windowOptions.show) {
              jQuery(layero).hide()
            }

            layer.setTop(layero)
            this.winCreateOK(viewopt, layero)
            eventTarget.fire(WidgetEventType.openView, {
              sourceTarget: this,
              view: viewopt,
              dom: layero
            })

            this._viewcreate_okcount++
            if (this._viewcreate_okcount >= this._viewcreate_allcount) {
              this._startActivate(layero)
            }
          }
        }
        viewopt._layerOpening = true
        viewopt._layerIdx = layer.open(this._getWinOpt(viewopt, opts))
      })
    }

    _getUrl(url) {
      url = this.addCacheVersion(url)

      if (url.startsWith("/") || url.startsWith(".") || url.startsWith("http")) {
        return url
      } else {
        return this.path + url
      }
    }

    _getWinOpt(viewopt, opts) {
      // 优先使用cofig中配置，覆盖js中的定义
      const def = getDefWindowOptions()

      const windowOptions = { ...def, ...viewopt.windowOptions, ...this.options.windowOptions }
      viewopt.windowOptions = windowOptions // 赋值

      const that = this
      const _size = this._getWinSize(windowOptions)

      let title = false
      if (!windowOptions.noTitle) {
        title = this.options.name || " "
        if (this.options.icon) {
          title = '<i class="' + this.options.icon + '" ></i>&nbsp;' + title
        }
      }

      // 默认值
      const defOpts = {
        title: title,
        area: _size.area,
        offset: _size.offset,
        shade: 0,
        maxmin: false,
        beforeEnd: function () {
          that.beforeDisable()
        },
        end: function () {
          // 销毁后触发的回调
          viewopt._layerIdx = -1
          viewopt._dom = null
          that.disableBase()
        },
        full: function (dom) {
          // 最大化后触发的回调
          that.winFull(dom)
        },
        min: function (dom) {
          // 最小化后触发的回调
          that.winMin(dom)
        },
        restore: function (dom) {
          // 还原 后触发的回调
          that.winRestore(dom)
        }
      }
      return { ...defOpts, ...windowOptions, ...opts }
    }

    // 计算弹窗大小和位置
    _getWinSize(windowOptions) {
      // 获取高宽
      let _width = this.bfb2Number(windowOptions.width, document.documentElement.clientWidth, windowOptions)
      let _height = this.bfb2Number(windowOptions.height, document.documentElement.clientHeight, windowOptions)

      // 计算位置offset
      let offset = ""
      const position = windowOptions.position
      if (position) {
        if (typeof position === "string") {
          // t顶部,b底部,r右边缘,l左边缘,lt左上角,lb左下角,rt右上角,rb右下角
          offset = position
        } else if (typeof position === "object") {
          let _top
          let _left

          if (position.hasOwnProperty("top") && position.top != null) {
            _top = this.bfb2Number(position.top, document.documentElement.clientHeight, windowOptions)
          }
          if (position.hasOwnProperty("bottom") && position.bottom != null) {
            windowOptions._hasresize = true

            const _bottom = this.bfb2Number(position.bottom, document.documentElement.clientHeight, windowOptions)

            if (_top != null) {
              _height = document.documentElement.clientHeight - _top - _bottom
            } else {
              _top = document.documentElement.clientHeight - _height - _bottom
            }
          }

          if (position.hasOwnProperty("left") && position.left != null) {
            _left = this.bfb2Number(position.left, document.documentElement.clientWidth, windowOptions)
          }
          if (position.hasOwnProperty("right") && position.right != null) {
            windowOptions._hasresize = true
            const _right = this.bfb2Number(position.right, document.documentElement.clientWidth, windowOptions)

            if (_left != null) {
              _width = document.documentElement.clientWidth - _left - _right
            } else {
              _left = document.documentElement.clientWidth - _width - _right
            }
          }

          if (_top == null || _top === undefined) {
            _top = (document.documentElement.clientHeight - _height) / 2
          }
          if (_left == null || _left === undefined) {
            _left = (document.documentElement.clientWidth - _width) / 2
          }

          offset = [_top + "px", _left + "px"]
        }
      }

      // 最大最小高度判断
      if (windowOptions.hasOwnProperty("minHeight") && _height < windowOptions.minHeight) {
        windowOptions._hasresize = true
        _height = windowOptions.minHeight
      }
      if (windowOptions.hasOwnProperty("maxHeight") && _height > windowOptions.maxHeight) {
        windowOptions._hasresize = true
        _height = windowOptions.maxHeight
      }

      // 最大最小宽度判断
      if (windowOptions.hasOwnProperty("minWidth") && _width < windowOptions.minWidth) {
        windowOptions._hasresize = true
        _width = windowOptions.minWidth
      }
      if (windowOptions.hasOwnProperty("maxWidth") && _width > windowOptions.maxWidth) {
        windowOptions._hasresize = true
        _width = windowOptions.maxWidth
      }

      let area
      if (_width && _height) {
        area = [_width + "px", _height + "px"]
      } else {
        area = _width + "px"
      }

      return { area: area, offset: offset }
    }

    /**
     * 更新窗口大小或位置，改变了主页面尺寸后需要调用(内部已自动调用)。
     * @return {void}  无
     */
    indexResize() {
      if (!this.isActivate) {
        return
      }

      const that = this
      this.eachView(function (viewopt) {
        if (!viewopt._layerIdx || viewopt._layerIdx === -1 || !viewopt.windowOptions || !viewopt.windowOptions._hasresize) {
          return
        }
        const tag = viewopt._dom.attr("maxmin")
        if (tag === "min") {
          return
        }
        if (tag === "full") {
          layer.full(viewopt._layerIdx, viewopt)
          return
        }

        const _size = that._getWinSize(viewopt.windowOptions)

        const _style = {}
        if (Array.isArray(_size.area)) {
          if (_size.area[0]) {
            _style.width = _size.area[0]
          }
          if (_size.area[1]) {
            _style.height = _size.area[1]
          }
        }

        if (Array.isArray(_size.offset)) {
          if (_size.offset[1]) {
            _style.top = _size.offset[0]
          }
          if (_size.offset[1]) {
            _style.left = _size.offset[1]
          }
        }
        jQuery(viewopt._dom).attr("myTopLeft", true)
        layer.style(viewopt._layerIdx, _style)

        if (viewopt.type === "divwindow") {
          layer.iframeAuto(viewopt._layerIdx)
        }
      })
    }

    //= =============直接添加dom节点=================
    _appendView(viewopt, html) {
      viewopt._dom = jQuery(html).appendTo(viewopt.parent || "body")

      // 设置css
      if (this.options.css) {
        jQuery(viewopt._dom).css(this.options.css)
      }

      this.winCreateOK(viewopt, html)

      this._viewcreate_okcount++
      if (this._viewcreate_okcount >= this._viewcreate_allcount) {
        this._startActivate(html)
      }
    }

    /**
     * 每个view窗口或页面创建完成后调用的钩子方法
     *
     * @param {object} opt 对应的view配置
     * @param {object|string} result 得到iframe页的窗口对象 或 view的html内容
     * @return {void}  无
     * @abstract
     */
    winCreateOK(opt, result) {}

    /**
     * 窗口最大化后触发后 的钩子方法
     * @return {void}  无
     * @abstract
     */
    winFull() {}

    /**
     * 窗口最小化后触发 的钩子方法
     * @return {void}  无
     * @abstract
     */
    winMin() {}

    /**
     * 最小化窗口
     * @return {void}  无
     */
    minView() {
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx) {
          layer.min(viewopt._layerIdx, viewopt)
        }
      })
    }

    /**
     * 还原窗口
     * @return {void}  无
     */
    restoreView() {
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx) {
          layer.restore(viewopt._layerIdx)
        }
      })
    }

    /**
     * 最大化窗口
     * @return {void}  无
     */
    fullView() {
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx) {
          layer.full(viewopt._layerIdx, viewopt)
        }
      })
    }

    /**
     * 窗口还原后触发 的钩子方法
     * @return {void}  无
     * @abstract
     */
    winRestore() {}

    _startActivate(layero) {
      this.activate(layero)
      eventTarget.fire(WidgetEventType.activated, {
        sourceTarget: this
      })

      if (this.options.success) {
        this.options.success(this)
        delete this.options.success // 一次性的
      }
      if (!this.isActivate) {
        // 窗口打开中没加载完成时，被释放
        this.disableBase()
      }
    }

    /**
     * 激活模块之前 的钩子方法
     * @return {void}  无
     * @abstract
     */
    beforeActivate() {}

    /**
     * 激活模块【类内部实现方法】
     * @return {void}  无
     * @abstract
     */
    activate() {}

    //= =============释放插件=================

    /**
     * 释放插件，同 es5widget.disable方法
     * @return {void}  无
     */
    disableBase() {
      if (!this.isActivate) {
        return
      }
      this.isActivate = false

      this.beforeDisable()
      eventTarget.fire(WidgetEventType.beforeDisable, {
        sourceTarget: this
      })

      // 关闭所有窗口
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx && viewopt._layerIdx > 0) {
          layer.close(viewopt._layerIdx)

          if (viewopt._layerOpening) {
            // 窗口还在加载中,success方法中去关闭
          } else {
            viewopt._layerIdx = -1
          }
          return true
        } else {
          if (viewopt.type === "append" && viewopt._dom) {
            viewopt._dom.remove()
            viewopt._dom = null
          }
          if (viewopt.type === "custom" && viewopt.close) {
            viewopt.close()
          }
          return false
        }
      })

      this.disable()

      // 还原配置为初始状态
      if (this.options.autoReset) {
        this.resetConfig()
      }
      eventTarget.fire(WidgetEventType.disabled, {
        sourceTarget: this
      })
    }

    /**
     * 释放模块前
     * @return {void}  无
     * @abstract
     */
    beforeDisable() {}

    /**
     * 释放模块【类内部实现方法】
     * @return {void}  无
     * @abstract
     */
    disable() {}

    //= =============其他方法=================
    bfb2Number(str, allnum, windowOptions) {
      if (typeof str === "string" && str.indexOf("%") !== -1) {
        windowOptions._hasresize = true

        return (allnum * Number(str.replace("%", ""))) / 100
      }
      return str
    }

    addCacheVersion(_resource) {
      if (!_resource) {
        return _resource
      }

      const cacheVersion = getCacheVersion()
      if (cacheVersion) {
        if (_resource.indexOf("?") === -1) {
          _resource += "?cache=" + cacheVersion
        } else if (_resource.indexOf("cache=" + cacheVersion) === -1) {
          _resource += "&cache=" + cacheVersion
        }
      }
      return _resource
    }

    /**
     * 还原配置为初始状态
     * @return {void}  无
     */
    resetConfig() {
      if (this.options._firstConfigBak) {
        const _backData = this.options._firstConfigBak
        for (const aa in _backData) {
          if (aa === "uri") {
            continue
          }
          this.options[aa] = _backData[aa]
        }
      }
    }

    /**
     * 设置view弹窗的显示和隐藏，基于修改css实现
     *
     * @param {boolean} show 是否显示
     * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
     * @return {void}  无
     */
    setViewShow(show, index) {
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx && viewopt._layerIdx > 0) {
          if (show) {
            jQuery("#layui-layer" + viewopt._layerIdx).show()
          } else {
            jQuery("#layui-layer" + viewopt._layerIdx).hide()
          }
        } else if (viewopt.type === "append" && viewopt._dom) {
          if (show) {
            jQuery(viewopt._dom).show()
          } else {
            jQuery(viewopt._dom).hide()
          }
        }
      }, index)
    }

    /**
     * 设置view弹窗的css
     *
     * @param {object} style css值
     * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
     * @return {void}  无
     */
    setViewCss(style, index) {
      this.eachView(function (viewopt) {
        if (viewopt._layerIdx != null && viewopt._layerIdx > 0) {
          layer.style(viewopt._layerIdx, style)
        } else if (viewopt.type === "append" && viewopt._dom) {
          jQuery(viewopt._dom).css(style)
        }
      }, index)
    }

    /**
     * 设置view弹窗的标题
     *
     * @param {string} title css值
     * @param {number} [index] 当有多个view时，可以指定单个操作的view的index
     * @return {void}  无
     */
    setTitle(title, index) {
      this.eachView(function (viewopt) {
        if (viewopt._dom) {
          viewopt._dom.find(".layui-layer-title").html(title)
        }
      }, index)
    }

    /**
     * 读取html页面的内容
     *
     * @param {string} url html页面的url
     * @param {Function} callback 读取完成后的回调方法
     * @return {void}  无
     */
    getHtml(url, callback) {
      jQuery.ajax({
        url: url,
        type: "GET",
        dataType: "html",
        timeout: 0, // 永不超时
        success: function (data) {
          callback(data)
        }
      })
    }
  }

  //对外接口
  window.es5widget = {
    BaseWidget: BaseWidget,
    EventType: WidgetEventType,
    WidgetEventType: WidgetEventType,
    eventTarget,
    activate,
    bindClass,
    destroy,
    disable,
    disableAll,
    disableGroup,
    eachWidget,
    fire,
    getBasePath,
    getCacheVersion,
    getClass,
    getDefWindowOptions,
    getWidget,
    init,
    isActivate,
    listens,
    off,
    on,
    once,
    removeDebugeBar,
    setViewShow
  }
})()
