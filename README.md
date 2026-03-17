 
<p align="center">
<img src="//mars3d.cn/logo.png" width="300px" />
</p>

<p align="center">基于传统JS技术栈的 Mars3D🌎功能示例</p>

<p align="center">
  <a target="_black" href="https://www.npmjs.com/package/mars3d">
    <img alt="Npm version" src="https://img.shields.io/npm/v/mars3d.svg?style=flat&logo=npm&label=版本号" />
  </a>
  <a target="_black" href="https://www.npmjs.com/package/mars3d">
    <img alt="Npm downloads" src="https://img.shields.io/npm/dt/mars3d?style=flat&logo=npm&label=下载量" />
  </a>
  <a target="_black" href="https://github.com/marsgis/mars3d">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/marsgis/mars3d?style=flat&logo=github" />
  </a>
  <a target="_black" href="https://gitee.com/marsgis/mars3d">
    <img src="https://gitee.com/marsgis/mars3d/badge/star.svg?theme=dark" alt="star" />
  </a>
</p>


功能示例项目，是基于[Mars3D 平台](http://mars3d.cn)做的一个按每个单独功能进行单页面展示、并且支持修改编辑代码实时运行的一个演示功能的系统。
主要用于开发人员学习了解 Mars3D 每个功能的使用、用于业务人员了解体验 Mars3D 具备的功能点。

首先建议您学习浏览一遍我们功能示例的源码（源码中会有大量注释），阅读源码时可以结合查阅API文档来理解类及方法的作用和参数说明等。


## 项目介绍
 
 这是一个基于`原生JS`开发的 Mars3D 功能示例 演示项目。

 > 如果您不熟悉原生JS，也可以阅读：[功能示例Vue版](http://mars3d.cn/docs/guide/example-vue/)、[功能示例React版](http://mars3d.cn/docs/guide/example-react/)


## 项目特性 
- **独立页面**：每一个页面是一个单独的示例，依赖少，独立运行。
- **适合不同技术栈**: 原生JS开发, 适合不同技术栈用户理解


## 视频讲解
建议先看一遍视频讲解，再实际操作，您可以[新页面查看高清视频](https://www.bilibili.com/video/BV1Hg411o7Js/)



## 下载运行项目
 
### 下载代码
- [Github](https://github.com/marsgis/mars3d-es5-example)

```
git clone git@github.com:marsgis/mars3d-es5-example.git
```

- [Gitee](https://gitee.com/marsgis/mars3d-es5-example)：国内码云，下载速度快些。

```
git clone git@gitee.com:marsgis/mars3d-es5-example.git
``` 

- 如果本地没有git软件，可以浏览器输入[https://github.com/marsgis/mars3d-es5-example](https://github.com/marsgis/mars3d-es5-example)地址后，按下图下载zip包。

 ![image](http://mars3d.cn/dev/img/guide/start-example-down.jpg)

  
### 运行环境
运行前建议从[http://mars3d.cn/download.html](http://mars3d.cn/download.html)下载最新mars3d类库后覆盖至`lib/`目录下，更新mars3d为最新版本。

### 运行方式1：使用vscode及其插件
 
在任意开发编辑器（如vscode等）或http服务器(如node、nginx、tomcat、IIS等)下直接运行浏览`index.html`或example目录下各对应示例页面即可。

建议使用VScode工具打开代码目录（请参考[开发环境搭建教程](/guide/start/env.html)安装好VScode 及 Live Server插件），运行index.html页面即可。
 
如果只想浏览单个示例，也可以参考下图通过Live Server访问对应示例的页面 
 ![image](http://mars3d.cn/dev/img/guide/start-example-run.jpg) 

  
### 运行方式2：运行npm命令

#### 首次运行前安装依赖
```
npm install

//或使用代理
npm i --registry=http://registry.taobao.org
```

#### 启动开发环境
```
npm run serve
```

#### 编译构建
```
npm run build //编译后生成在dist目录，拷贝出去发布即可
npm run serve:dist  //测试dist运行状态

// 或者将dist文件夹发布在自己的服务数据上
```

 
### 运行效果  
 [在线体验](http://mars3d.cn/example.html?type=es5)

 ![image](http://mars3d.cn/dev/img/guide/start-example-es5.jpg) 
 


## 如何反馈问题？
- 发现您发现项目中存在的问题或者需要优化的地方；
- 如果您有一些自己全新编写的示例，希望也开源与大家分享。

提交方式：
- 欢迎在github或gitee上[提交PR](https://www.baidu.com/s?wd=在GitHub上提交PR) 
- 如果对git不熟悉，也可以整理示例代码发送邮件到 wh@marsgis.cn 由我们来整理集成。


## 项目架构


### 主要目录说明
```
mars3d-es5-example
│───config              列表配置信息及截图
│───example             示例代码，每个示例页面可以单独运行【重要】
│───css                 公共CSS样式文件
│───img                 公共图片文件
│───js                  公共JS文件
│───lib                 示例依赖的类库
│   └─include-lib.js    lib类库统一配置文件
│───widgets             基础项目模块资源，便于演示部分示例
└───index.html          列表页（访问入口）
```

与示例相关的2个主要目录是：`example`、`lib`。


#### include-lib.js文件说明 

我们当前原生JS版本`功能示例`页面，第三方类库及我们的sdk类库都存放在lib目录下，每个目录均有`README.md`文件说明该类库的github地址、官网和用途等信息。

 ![image](http://mars3d.cn/dev/img/guide/start-includeLib-ml.jpg) 

为了方便切换和引入第3方lib，我们编写了一个独立的js文件[include-lib.js](https://gitee.com/marsgis/mars3d-es5-example/blob/master/lib/include-lib.js)来统一调用使用第3方lib,在需要的页面按下面方式引入lib：
```html
<!--第三方lib-->
<script type="text/javascript" src="/lib/include-lib.js" libpath="/lib/"
    include="font-awesome,mars3d"></script>
```
该方式等价于（如不习惯include-lib.js，也可以改为下面演示的直接引入方式）： 

```html
<!--对应font-awesome-->
<link rel="stylesheet" href="/lib/fonts/font-awesome/css/font-awesome.min.css">

<!--对应turf-->
<script type="text/javascript" src="/lib/turf/turf.min.js"></script>

<!--对应mars3d-->
<link rel="stylesheet" href="/lib/Cesium/Widgets/widgets.css">
<script type="text/javascript" src="/lib/Cesium/Cesium.js"></script>
<link rel="stylesheet" href="/lib/mars3d/mars3d.css">
<script type="text/javascript" src="/lib/mars3d/mars3d.js"></script>
```
 
 
## 添加新的示例
复制`example\00_model.html`文件后改名，并修改代码即可。



## 阅读示例源码和调试学习
 示例的目的是演示平台的每个功能点，可以按需求或兴趣去学习每一个示例，
- （1）学习中可以查询相关类的API文档
- （2）尝试修改源码中参数、方法等，来体验不同的呈现效果。


## 开发中常见问题


### 1. 局域网离线使用时注意事项
 平台所有代码层面来说支持离线运行和使用的，但需要注意的是离线时的地图服务的相关处理。
 
 如果局域网内有相关地形、卫星底图服务可以按内网服务类型和URL地址替换下`config.json`或`构造Map的代码中`的默认地形和底图。

 如果局域网内没有相关服务，可以按下面处理：
- 修改config.json中`terrain`配置中，将已有的`"show": true`配置，改为`"show": false` 
- 修改config.json中`basemaps`数组配置中，将已有的`"show": true`的图层，将该值改为`"show": false` ，并将单张图片或离线地图加上`"show": true`，并修改相关URL地址。
- 您也可以参考教程[发布三维数据服务](/guide/data/server.html)进行部署离线地图服务，里面也有一些示例离线数据。



## Mars3D 是什么 
>  `Mars3D平台` 是一款基于 WebGL 技术实现的三维客户端开发平台，基于[Cesium](https://cesium.com/cesiumjs/)优化提升与B/S架构设计，支持多行业扩展的轻量级高效能GIS开发平台，能够免安装、无插件地在浏览器中高效运行，并可快速接入与使用多种GIS数据和三维模型，呈现三维空间的可视化，完成平台在不同行业的灵活应用。

 > Mars3D平台可用于构建无插件、跨操作系统、 跨浏览器的三维 GIS 应用程序。平台使用 WebGL 来进行硬件加速图形化，跨平台、跨浏览器来实现真正的动态大数据三维可视化。通过 Mars3D产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。

### 相关网站 
- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- Mars3D开源项目列表：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)


## 版权说明
1. Mars3D平台由[mars3d团队](http://mars3d.cn/)自主研发，拥有所有权利。
2. 任何个人或组织可以在遵守相关要求下可以免费无限制使用。
