/* eslint-disable no-undef */
//脚本对象方法
function initEditorJS(map) {
  let first = {
    activate: function () {
      JB.showPanel("第一步 发送信号")
      firstStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  let second = {
    activate: function () {
      JB.showPanel("第二步 传送信号")
      secondStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let third = {
    activate: function () {
      JB.showPanel("第三步 下达指令")
      thirdStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let forth = {
    activate: function () {
      JB.showPanel("第四步 准备出发")
      forthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let fifth = {
    activate: function () {
      JB.showPanel("第五步 出发")
      fifthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let sixth = {
    activate: function () {
      JB.showPanel("第六步 处理泄露")
      sixthStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }
  let seventh = {
    activate: function () {
      JB.showPanel("第七步 完成营救")
      seventhStep()
    },
    disable: function () {
      JB.closePanel()
    }
  }

  //脚本配置信息（包括顺序、时间、业务对象）
  let data = [
    {
      text: "救援步骤",
      state: {
        opened: true,
        selected: false
      },
      children: [
        {
          text: "发送信号",
          times: 4,
          widget: first
        },
        {
          text: "传送信号",
          times: 4,
          widget: second
        },
        {
          text: "下达指令",
          times: 4,
          widget: third
        },
        {
          text: "准备出发",
          times: 4,
          widget: forth
        },
        {
          text: "出发",
          times: 6,
          widget: fifth
        },
        {
          text: "处理泄露",
          times: 4,
          widget: sixth
        },
        {
          text: "完成营救",
          times: 4,
          widget: seventh
        }
      ]
    }
  ]
  // eslint-disable-next-line no-undef
  dataWork.initData(data)
}
