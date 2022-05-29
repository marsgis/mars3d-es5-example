/* eslint-disable no-undef */
"use script" //开发环境建议开启严格模式

$(document).ready(function () {
  let inhtml = `
      <div class="infoview rightbottom" style="min-width: 200px">
      <table class="mp_table">
        <tr>
          <td class="nametd">总长度</td>
          <td id="td_alllength"></td>
        </tr>
        <tr>
          <td class="nametd">已漫游长度</td>
          <td id="td_length"></td>
        </tr>
        <tr>
          <td class="nametd">总时长</td>
          <td id="td_alltimes"></td>
        </tr>
        <tr>
          <td class="nametd">已漫游时间</td>
          <td id="td_times"></td>
        </tr>

        <tr>
          <td class="nametd">经度</td>
          <td id="td_jd"></td>
        </tr>
        <tr>
          <td class="nametd">经度</td>
          <td id="td_wd"></td>
        </tr>
        <tr>
          <td class="nametd">漫游高程</td>
          <td id="td_gd"></td>
        </tr>
        <tr>
          <td class="nametd">地面高程</td>
          <td id="td_dmhb"></td>
        </tr>
        <tr id="tr_ldgd">
          <td class="nametd">离地距离</td>
          <td id="td_ldgd"></td>
        </tr>

        <tr>
          <td colspan="2" style="width: 100%; text-align: center">
            <div class="progress">
              <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
            </div>
          </td>
        </tr>
      </table>
    </div> `
  $("body").append(inhtml)
})

//面板显示相关信息
eventTarget.on("roamLineChange", (roamLineData) => {
  //显示基本信息，名称、总长、总时间
  $("#td_alltimes").html(roamLineData.td_alltimes)
  $("#td_alllength").html(roamLineData.td_alllength)

  $(".progress-bar")
    .css("width", roamLineData.percent + "%")
    .attr("aria-valuenow", roamLineData.percent)
    .html(roamLineData.percent + "%")

  $("#td_jd").html(roamLineData.td_jd)
  $("#td_wd").html(roamLineData.td_wd)
  $("#td_gd").html(roamLineData.td_gd)

  $("#td_times").html(roamLineData.td_times)
  $("#td_length").html(roamLineData.td_length)

  $("#td_dmhb").html(roamLineData.td_dmhb)

  $("#td_ldgd").html(roamLineData.td_ldgd)
})
