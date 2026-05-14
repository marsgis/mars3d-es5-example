/* eslint-disable no-undef */
//脚本对象方法
function initEditorJS(map) {
  let initSceneFun = {
    activate: function () {
      JB.showPanel("第一步 发送信号")
      initScene()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let acceptanceFun = {
    activate: function () {
      JB.showPanel("第二步 传送信号")
      acceptance()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let taskFun = {
    activate: function () {
      JB.showPanel("第三步 下达指令")
      task()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let startTaskFun = {
    activate: function () {
      JB.showPanel("第四步 准备出发")
      startTask()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let satelliteLookFun = {
    activate: function () {
      JB.showPanel("第五步 出发")
      satelliteLook()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let sendDataActionFun = {
    activate: function () {
      JB.showPanel("第六步 处理泄露")
      sendDataAction()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let transferringDataFun = {
    activate: function () {
      JB.showPanel("第七步 完成营救")
      transferringData()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let productionFun = {
    activate: function () {
      JB.showPanel("第六步 处理泄露")
      production()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let distributionFun = {
    activate: function () {
      JB.showPanel("第七步 完成营救")
      distribution()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  //脚本配置信息（包括顺序、时间、业务对象）
  let data = [
    {
      text: "卫星推演",
      state: {
        opened: true,
        selected: false
      },
      children: [
        {
          text: "初始化场景",
          times: 2,
          widget: initSceneFun
        },
        {
          text: "需求受理",
          times: 8,
          widget: acceptanceFun
        },
        {
          text: "任务编排",
          times: 7,
          widget: taskFun
        },
        {
          text: "任务上注",
          times: 10,
          widget: startTaskFun
        },
        {
          text: "卫星观测",
          times: 15,
          widget: satelliteLookFun
        },
        {
          text: "数据接收",
          times: 10,
          widget: sendDataActionFun
        },
        {
          text: "数据传输",
          times: 10,
          widget: transferringDataFun
        },
        {
          text: "产品生产",
          times: 5,
          widget: productionFun
        },
        {
          text: "产品分发",
          times: 5,
          widget: distributionFun
        }
      ]
    }
  ]
  // eslint-disable-next-line no-undef
  dataWork.initData(data)
}
