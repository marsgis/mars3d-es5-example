/* eslint-disable */

/**
 * 第3方公共类库配置文件
 *
 * @copyright 火星科技 mars3d.cn
 * @author 木遥 2021-11-26
 */
window.configLibs = {
  /// ///////////////////////Mars3D及其插件////////////////////////
  mars3d: [
    //三维地球“主库”
    "Cesium/Widgets/widgets.css", //cesium
    "Cesium/Cesium.js",
    "turf/turf.min.js",
    "mars3d/mars3d.css", //mars3d
    "mars3d/mars3d.js",
  ],
  "cesium-comp": [
    //cesium版本间兼容处理
    "mars3d/plugins/compatible/cesium-version.js",
    "mars3d/plugins/compatible/cesium-when.js",
  ],
  "mars3d-space": [
    //卫星插件
    "mars3d/plugins/space/mars3d-space.js",
  ],
  "mars3d-echarts": [
    //echarts支持插件
    "echarts/echarts.min.js",
    "echarts/echarts-gl/echarts-gl.min.js",
    "mars3d/plugins/echarts/mars3d-echarts.js",
  ],
  "mars3d-mapv": [
    //mapv支持插件
    "mapV/mapv.min.js",
    "mars3d/plugins/mapv/mars3d-mapv.js",
  ],
  "mars3d-heatmap": [
    //heatmap热力图支持插件
    "mars3d/plugins/heatmap/heatmap.js",
    "mars3d/plugins/heatmap/mars3d-heatmap.js",
  ],
  "mars3d-wind": [
    //风场图层插件
    "mars3d/plugins/wind/netcdfjs.js", //m10_windLayer解析nc
    "mars3d/plugins/wind/mars3d-wind.js",
  ],
  "mars3d-tdt": [
    //天地图三维
    "mars3d/plugins/tdt/mars3d-tdt.js",
  ],

  //////////////////////////cesium相关第3方插件////////////////////////
  "cesium-pbf-ol": [
    // pbf矢量瓦片支持（基于openlayer渲染）
    "mars3d/thirdParty/pbf-ol/ol.js",
    "mars3d/thirdParty/pbf-ol/olms.js",
    "mars3d/thirdParty/pbf-ol/style/MapboxStreetsV6.js",
    "mars3d/thirdParty/pbf-ol/PbfolLayer.js",
  ],
  "cesium-pbf-mapbox": [
    // pbf矢量瓦片支持（基于mapbox渲染）
    "mars3d/thirdParty/pbf-mapbox/mapbox-gl.js",
    "mars3d/thirdParty/pbf-mapbox/PbfLayer.js",
  ],
  "cesium-pbf-protomaps": [
    // pbf矢量瓦片支持（基于protomaps解析）
    "mars3d/thirdParty/pbf-protomaps/protomaps.min.js",
    "mars3d/thirdParty/pbf-protomaps/ArcGISPbfLayer.js"
  ],
  "cesium-weiVectorTile": [
    // 项目矢量瓦片方式加载GeoJson插件
    "mars3d/thirdParty/weiVectorTile/CesiumVectorTile.js",
    "mars3d/thirdParty/weiVectorTile/WeiVectorTileLayer.js",
  ],
  "cesium-meshVisualizer": [
    //ammo物理引擎支持
    "three/three.js",
    "ammo/ammo.js",
    "mars3d/thirdParty/meshVisualizer/CesiumMeshVisualizer.js"
  ],
  "cesium-sensorVolumes": [
    //支持agi_conicSensor，agi_customPatternSensor和agi_rectangularSensor展示的czml插件
    "mars3d/thirdParty/sensorVolumes/cesium-sensor-volumes.js"
  ],
  'olcesium': [
    "ol/ol.css",
    "ol/ol.js",
    "ol/ol-cesium/olcesium.js"
  ],
  "cesium-networkPlug": [
    "mars3d/thirdParty/networkPlug/CesiumNetworkPlug.js"
  ],
  "es5-widget": [
    //原生JS项目widget模块插件
    "mars3d/thirdParty/es5-widget/loader.js",
    "mars3d/thirdParty/es5-widget/es5-widget.css",
    "mars3d/thirdParty/es5-widget/es5-widget.js",
  ],

  //////////////////////////mars2d及其插件////////////////////////
  'mars2d': [//地图 主库
    "http://mars2d.cn/lib/leaflet/leaflet.css", //leaflet
    "http://mars2d.cn/lib/leaflet/leaflet.js",
    "http://mars2d.cn/lib/mars2d/mars2d.css", //mars2d
    "http://mars2d.cn/lib/mars2d/mars2d.js",
    "http://mars2d.cn/lib/mars2d/plugins/esri/mars2d-esri.js"
  ],

  //////////////////////////其他地图渲染相关库////////////////////////
  'echarts': [
    "echarts/echarts.min.js",
    "echarts/dark.js"
  ],
  'echarts-gl': [
    "echarts/echarts.min.js",
    "echarts/echarts-gl/echarts-gl.min.js"
  ],
  'echarts-liquidfill': [
    "echarts/echarts.min.js",
    "echarts/echarts-liquidfill/echarts-liquidfill.js"
  ],
  'terraformer': [
    "terraformer/terraformer-1.0.9.min.js",
    "terraformer/terraformer-wkt-parser-1.2.0.min.js",
  ],
  'kriging': [
    "kriging/kriging.min.js"
  ],
  'three': [
    "three/three.js"
  ],
  'kmlGeojson': [
    "geojson/kml-geojson.js"  // 项目KML/KMZ解析加载GeoJson插件
  ],
  'shpGeojson': [
    "geojson/shp-geojson.js"  // 项目KML/KMZ解析加载GeoJson插件
  ],
  kriging: ["kriging/kriging.min.js"],
  three: ["three/three.js"],
  'hls': ["video/hls/hls.js"],
  'flv': ["video/flv/flv.min.js"],
   tween: ["tween/Tween.js"],

  ////////////////////////// UI界面相关库////////////////////////
  'jquery': [
    "jquery/jquery-3.6.0.min.js",
  ],
  'layer': [
    "layer/theme/default/layer.css",
    "layer/theme/retina/retina.css",
    "layer/theme/mars/layer.css",
    "layer/layer.js"
  ],
  'jquery.scrollTo': [
    "jquery/scrollTo/jquery.scrollTo.min.js",
  ],
  'jquery.minicolors': [
    "jquery/minicolors/jquery.minicolors.css",
    "jquery/minicolors/jquery.minicolors.min.js",
  ],
  'jquery.range': [
    "jquery/range/range.css",
    "jquery/range/range.js",
  ],
  'ztree': [
    "jquery/ztree/css/zTreeStyle/zTreeStyle.css",
    "jquery/ztree/css/mars/ztree-mars.css",
    "jquery/ztree/js/jquery.ztree.all.min.js",
  ],
  'jstree': [
    "jstree/themes/default-dark/style.css",
    "jstree/jstree.min.js",
  ],
  'jquery.mCustomScrollbar': [
    "jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
    "jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
  ],
  'jedate': [
    "jquery/jedate/skin/jedate.css",
    "jquery/jedate/jedate.js",
  ],
  'lazyload': [
    "jquery/lazyload/jquery.lazyload.min.js",
  ],
  'bootstrap': [
    "bootstrap/css/bootstrap.css",
    "bootstrap/js/bootstrap.bundle.min.js",
  ],
  'bootstrap-table': [
    "bootstrap/bootstrap-table/bootstrap-table.css",
    "bootstrap/bootstrap-table/bootstrap-table.min.js",
    "bootstrap/bootstrap-table/locale/bootstrap-table-zh-CN.js"
  ],
  'bootstrap-select': [
    "bootstrap/bootstrap-select/bootstrap-select.css",
    "bootstrap/bootstrap-select/bootstrap-select.min.js",
    "bootstrap/bootstrap-select/i18n/defaults-zh_CN.js",

  ],
  'bootstrap-checkbox': [
    "bootstrap/bootstrap-checkbox/awesome-bootstrap-checkbox.css",
  ],
  'bootstrap-slider': [
    "bootstrap/bootstrap-slider/bootstrap-slider.min.css",
    "bootstrap/bootstrap-slider/bootstrap-slider.min.js",
  ],
  'nprogress': [
    "nprogress/nprogress.css",
    "nprogress/nprogress.min.js",
  ],
  'toastr': [
    "toastr/toastr.css",
    "toastr/toastr.js",
  ],
  'formvalidation': [
    "formvalidation/formValidation.css",
    "formvalidation/formValidation.min.js",
    "formvalidation/framework/bootstrap.min.js",
    "formvalidation/language/zh_CN.min.js",
  ],
  'admui': [
    "admui/css/index.css",
    "admui/js/global/core.js", //核心
    "admui/js/global/configs/site-configs.js",
    "admui/js/global/components.js",
  ],
  'admui-frame': [
    "admui/css/site.css",
    "admui/js/app.js",
  ],
  'admin-lte': [
    "fonts/font-awesome/css/font-awesome.min.css",
    "admin-lte/css/AdminLTE.min.css",
    "admin-lte/css/skins/skin-blue.min.css",
    "admin-lte/js/adminlte.min.js"
  ],
  'highlight': [
    "highlight/styles/foundation.css",
    "highlight/highlight.pack.js"
  ],

  'animate': [
    "animate/animate.css",
  ],
  'font-awesome': [
    "fonts/font-awesome/css/font-awesome.min.css",
  ],
  'font-marsgis': [
    "fonts/marsgis/iconfont.css",
  ],
  'web-icons': [
    "fonts/web-icons/web-icons.css",
  ],

  ////////////////////////// 其他库////////////////////////
  'haoutil': [
    "hao/haoutil.js"
  ],
  'localforage': [
    "localforage/localforage.min.js"
  ],
}

//本地测试  localStorage.setItem("muyao-debugger",1)
if (localStorage.getItem("muyao-debugger") === "1") {
  for (const key in window.configLibs) {
    if (key.startsWith("mars3d")) {
      const arrUrl = window.configLibs[key]
      for (let index = 0; index < arrUrl.length; index++) {
        const url = arrUrl[index]
        const fileName = url?.substring(url.lastIndexOf("/") + 1, url.length)
        if (fileName.startsWith("mars3d")) {
          arrUrl[index] = arrUrl[index].replace(".js", "-src.js").replace(".css", "-src.css")
        } else if (fileName.indexOf("Cesium") !== -1) {
          // arrUrl[index] = arrUrl[index].replace("Cesium", "CesiumUnminified")
        }

      }
    }
  }
  console.log("正在使用SDK调试版本")
}

//内部处理方法
; (function () {
  var r = new RegExp('(^|(.*?\\/))(include-lib.js)(\\?|$)'),
    s = document.getElementsByTagName('script'),
    targetScript
  for (var i = 0; i < s.length; i++) {
    var src = s[i].getAttribute('src')
    if (src) {
      var m = src.match(r)
      if (m) {
        targetScript = s[i]
        break
      }
    }
  }

  // cssExpr 用于判断资源是否是css
  var cssExpr = new RegExp('\\.css')

  function inputLibs (list, baseUrl) {
    if (list == null || list.length === 0) {
      return
    }

    for (var i = 0, len = list.length; i < len; i++) {
      var url = list[i]
      if (!url.startsWith("http") && !url.startsWith("//:")) {
        url = baseUrl + url
      }

      if (cssExpr.test(url)) {
        var css = '<link rel="stylesheet" href="' + url + '">'
        document.writeln(css)
      } else {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>'
        document.writeln(script)
      }
    }
  }

  //加载类库资源文件
  function load () {
    var arrInclude = (targetScript.getAttribute('include') || '').split(',')
    var libpath = targetScript.getAttribute('libpath') || ''
    if (libpath.lastIndexOf('/') !== libpath.length - 1) {
      libpath += '/'
    }

    var keys = {}
    for (var i = 0, len = arrInclude.length; i < len; i++) {
      var key = arrInclude[i]

      if (keys[key]) {
        //规避重复引入lib
        continue
      }
      keys[key] = true

      inputLibs(configLibs[key], libpath)
    }
  }

  load()
})()
