// 矢量瓦片的目前最佳方案：使用 TileServer GL 开源地图服务工具：https://github.com/maptiler/tileserver-gl
// 它利用 MapLibre GL Native 进行服务器端的矢量图层渲染，将pbf矢量瓦片转为普通瓦片数据后提供通过 WMTS 协议在Mars3D前端进行加载展示。

// import * as mars3d from "mars3d"
// import { PbfLayer } from "../../../../../public/lib/mars3d/thirdParty/pbf-mapbox/PbfLayer.js"

var map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 28.665233, lng: 108.757799, alt: 4255656, heading: 356, pitch: -87 }
  },
  // 方式1：在创建地球前的参数中配置
  layers: [
    {
      name: "矢量瓦片图层",
      icon: "https://data.mars3d.cn/img/thumbnail/basemap/osm.png",
      type: "pbf", // lib\mars3d\thirdParty\pbf-mapbox\PbfLayer.js 中定义的类型
      url: "https://api.maptiler.com/maps/basic/style.json?key=pSHUA9sSkNny3iqoWG4P",
      popup: "all",
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  globalNotify(
    "已知问题提示",
    `(1) 无数据区域mapbox-gl.js解析失败F12会有错误提示，但不影响使用。(2) 如果部分PBF数据未显示，需要扩展开发对应解析style代码。`
  )

  addPbfLayer2()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
function onUnmounted() {
  map = null
}

// function addPbfLayer() {
//   // 在 lib\mars3d\thirdParty\pbf-mapbox\PbfLayer.js 中定义的
//   const pbfLayer = new PbfLayer({
//     url: "https://api.maptiler.com/maps/basic/style.json?key=pSHUA9sSkNny3iqoWG4P",
//     popup: "all"
//   })
//   map.addLayer(pbfLayer)

//   // 单击事件
//   pbfLayer.on(mars3d.EventType.click, function (event) {
//     console.log("单击了矢量数据，共" + event.features.length + "条", event)
//   })
// }

function addPbfLayer2() {
  const exampleStyle = {
    id: "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
    name: "MapLibre",
    zoom: 0.8619833357855968,
    pitch: 0,
    center: [17.65431710431244, 32.954120326746775],
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#D8F2FF"
        },
        filter: ["all"],
        layout: {
          visibility: "visible"
        },
        maxzoom: 24
      },
      {
        id: "coastline",
        type: "line",
        paint: {
          "line-blur": 0.5,
          "line-color": "#198EC8",
          "line-width": {
            stops: [
              [0, 2],
              [6, 6],
              [14, 9],
              [22, 18]
            ]
          }
        },
        filter: ["all"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
          visibility: "visible"
        },
        source: "maplibre",
        maxzoom: 24,
        minzoom: 0,
        "source-layer": "countries"
      },
      {
        id: "countries-fill",
        type: "fill",
        paint: {
          "fill-color": [
            "match",
            ["get", "ADM0_A3"],
            [
              "ARM",
              "ATG",
              "AUS",
              "BTN",
              "CAN",
              "COG",
              "CZE",
              "GHA",
              "GIN",
              "HTI",
              "ISL",
              "JOR",
              "KHM",
              "KOR",
              "LVA",
              "MLT",
              "MNE",
              "MOZ",
              "PER",
              "SAH",
              "SGP",
              "SLV",
              "SOM",
              "TJK",
              "TUV",
              "UKR",
              "WSM"
            ],
            "#D6C7FF",
            [
              "AZE",
              "BGD",
              "CHL",
              "CMR",
              "CSI",
              "DEU",
              "DJI",
              "GUY",
              "HUN",
              "IOA",
              "JAM",
              "LBN",
              "LBY",
              "LSO",
              "MDG",
              "MKD",
              "MNG",
              "MRT",
              "NIU",
              "NZL",
              "PCN",
              "PYF",
              "SAU",
              "SHN",
              "STP",
              "TTO",
              "UGA",
              "UZB",
              "ZMB"
            ],
            "#EBCA8A",
            [
              "AGO",
              "ASM",
              "ATF",
              "BDI",
              "BFA",
              "BGR",
              "BLZ",
              "BRA",
              "CHN",
              "CRI",
              "ESP",
              "HKG",
              "HRV",
              "IDN",
              "IRN",
              "ISR",
              "KNA",
              "LBR",
              "LCA",
              "MAC",
              "MUS",
              "NOR",
              "PLW",
              "POL",
              "PRI",
              "SDN",
              "TUN",
              "UMI",
              "USA",
              "USG",
              "VIR",
              "VUT"
            ],
            "#C1E599",
            [
              "ARE",
              "ARG",
              "BHS",
              "CIV",
              "CLP",
              "DMA",
              "ETH",
              "GAB",
              "GRD",
              "HMD",
              "IND",
              "IOT",
              "IRL",
              "IRQ",
              "ITA",
              "KOS",
              "LUX",
              "MEX",
              "NAM",
              "NER",
              "PHL",
              "PRT",
              "RUS",
              "SEN",
              "SUR",
              "TZA",
              "VAT"
            ],
            "#E7E58F",
            [
              "AUT",
              "BEL",
              "BHR",
              "BMU",
              "BRB",
              "CYN",
              "DZA",
              "EST",
              "FLK",
              "GMB",
              "GUM",
              "HND",
              "JEY",
              "KGZ",
              "LIE",
              "MAF",
              "MDA",
              "NGA",
              "NRU",
              "SLB",
              "SOL",
              "SRB",
              "SWZ",
              "THA",
              "TUR",
              "VEN",
              "VGB"
            ],
            "#98DDA1",
            [
              "AIA",
              "BIH",
              "BLM",
              "BRN",
              "CAF",
              "CHE",
              "COM",
              "CPV",
              "CUB",
              "ECU",
              "ESB",
              "FSM",
              "GAZ",
              "GBR",
              "GEO",
              "KEN",
              "LTU",
              "MAR",
              "MCO",
              "MDV",
              "NFK",
              "NPL",
              "PNG",
              "PRY",
              "QAT",
              "SLE",
              "SPM",
              "SYC",
              "TCA",
              "TKM",
              "TLS",
              "VNM",
              "WEB",
              "WSB",
              "YEM",
              "ZWE"
            ],
            "#83D5F4",
            [
              "ABW",
              "ALB",
              "AND",
              "ATC",
              "BOL",
              "COD",
              "CUW",
              "CYM",
              "CYP",
              "EGY",
              "FJI",
              "GGY",
              "IMN",
              "KAB",
              "KAZ",
              "KWT",
              "LAO",
              "MLI",
              "MNP",
              "MSR",
              "MYS",
              "NIC",
              "NLD",
              "PAK",
              "PAN",
              "PRK",
              "ROU",
              "SGS",
              "SVN",
              "SWE",
              "TGO",
              "TWN",
              "VCT",
              "ZAF"
            ],
            "#B1BBF9",
            ["ATA", "GRL"],
            "#FFFFFF",
            "#EAB38F"
          ]
        },
        filter: ["all"],
        layout: {
          visibility: "visible"
        },
        source: "maplibre",
        maxzoom: 24,
        "source-layer": "countries"
      },
      {
        id: "countries-boundary",
        type: "line",
        paint: {
          "line-color": "rgba(255, 255, 255, 1)",
          "line-width": {
            stops: [
              [1, 1],
              [6, 2],
              [14, 6],
              [22, 12]
            ]
          },
          "line-opacity": {
            stops: [
              [3, 0.5],
              [6, 1]
            ]
          }
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
          visibility: "visible"
        },
        source: "maplibre",
        maxzoom: 24,
        "source-layer": "countries"
      },
      {
        id: "geolines",
        type: "line",
        paint: {
          "line-color": "#1077B0",
          "line-opacity": 1,
          "line-dasharray": [3, 3]
        },
        filter: ["all", ["!=", "name", "International Date Line"]],
        layout: {
          visibility: "visible"
        },
        source: "maplibre",
        maxzoom: 24,
        "source-layer": "geolines"
      },
      {
        id: "geolines-label",
        type: "symbol",
        paint: {
          "text-color": "#1077B0",
          "text-halo-blur": 1,
          "text-halo-color": "rgba(255, 255, 255, 1)",
          "text-halo-width": 1
        },
        filter: ["all", ["!=", "name", "International Date Line"]],
        layout: {
          "text-font": ["Open Sans Semibold"],
          "text-size": {
            stops: [
              [2, 12],
              [6, 16]
            ]
          },
          "text-field": "{name}",
          visibility: "visible",
          "symbol-placement": "line"
        },
        source: "maplibre",
        maxzoom: 24,
        minzoom: 1,
        "source-layer": "geolines"
      },
      {
        id: "countries-label",
        type: "symbol",
        paint: {
          "text-color": "rgba(8, 37, 77, 1)",
          "text-halo-blur": {
            stops: [
              [2, 0.2],
              [6, 0]
            ]
          },
          "text-halo-color": "rgba(255, 255, 255, 1)",
          "text-halo-width": {
            stops: [
              [2, 1],
              [6, 1.6]
            ]
          }
        },
        filter: ["all"],
        layout: {
          "text-font": ["Open Sans Semibold"],
          "text-size": {
            stops: [
              [2, 10],
              [4, 12],
              [6, 16]
            ]
          },
          "text-field": {
            stops: [
              [2, "{ABBREV}"],
              [4, "{NAME}"]
            ]
          },
          visibility: "visible",
          "text-max-width": 10,
          "text-transform": {
            stops: [
              [0, "uppercase"],
              [2, "none"]
            ]
          }
        },
        source: "maplibre",
        maxzoom: 24,
        minzoom: 2,
        "source-layer": "centroids"
      }
    ],
    bearing: 0,
    sources: {
      maplibre: {
        url: "https://demotiles.maplibre.org/tiles/tiles.json",
        type: "vector"
      }
    },
    version: 8,
    metadata: {
      "maptiler:copyright":
        "This style was generated on MapTiler Cloud. Usage is governed by the license terms in https://github.com/maplibre/demotiles/blob/gh-pages/LICENSE",
      "openmaptiles:version": "3.x"
    }
  }

  // 在 lib\mars3d\thirdParty\pbf-mapbox\PbfLayer.js 中定义的
  const pbfLayer = new PbfLayer({
    style: exampleStyle,
    popup: "all"
  })
  map.addLayer(pbfLayer)

  // 单击事件
  pbfLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了矢量数据，共" + event.features.length + "条", event)
  })
}
