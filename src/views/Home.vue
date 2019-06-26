<template>
  <div id="form-frame" ref="formFrame">
    <table class="form-table">
      <tr class="form-row">
        <th width="40px"></th>
        <th
          class="form-header col-header"
          v-for="col in 26"
          :key="col"
          width="100px"
        >{{String.fromCharCode(col+64)}}</th>
        <!-- <th class="form-header col-header"></th> -->
        <!--自适应列-->
      </tr>
      <tr class="form-row" v-for="row in 40" :key="row">
        <td class="form-header row-header" width="40px">{{row}}</td>
        <td
          class="form-cell"
          v-for="col in 26"
          :row="row"
          :col="col"
          :key="col"
          @mousedown="cell_mousedown"
          @mouseover="cell_mouseover"
          @mouseup="cell_mouseup"
        ></td>
        <!-- <td></td> -->
        <!--自适应列-->
      </tr>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import $ from "jquery";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      focus_td: "",
      ispress: false,
      cellWidth: null,
      cellHeight: null,
      startX: null,
      topCount: null,
      leftCount: null,
      selectWidht: null,
      selectHeight: null,
      startY: null,
      endX: null,
      endY: null
    };
  },
  mounted() {},
  methods: {
    cell_mousedown(e) {
      var target = e.target;
      target.style.cssText =
        "box-sizing:border-box;background:rgba(180,239,255,0.4);";
      // 获取每个单元格的宽度和高度
      var box = document.getElementById("form-frame");
      this.cellWidth = target.offsetWidth;
      this.cellHeight = target.offsetHeight;
      // this.startX = target.offsetLeft - cellWidth ;
      // this.startY = target.offsetTop - cellHeight;
      // 计算初始坐标
      this.startX = target.offsetLeft;
      this.startY = target.offsetTop;
      this.ispress = true;
      this.focus_td = target;
    },
    cell_mouseover(e) {
      var target = e.target;
      var $this = this;
      if (this.ispress) {
        $this.region_select(this.focus_td, target);
        this.focus_td.style.cssText = "";
      }else{
        this.topCount = null;
        this.leftCount = null;
      }
    },
    cell_mouseup(e) {
      this.ispress = false;
      var target = e.target;
      this.endX = target.offsetLeft;
      this.endY = target.offsetTop;
      var left = this.endX > this.startX ? this.startX : this.endX;
      var top = this.endY > this.startY ? this.startY : this.endY;
      var box = document.getElementById("form-frame");
      // 创建元素
      var tableDiv = document.createElement("div");
      var selectDiv = document.createElement("table");
      var topUl = document.createElement("ul");
      var leftUl = document.createElement("ul");
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      var td = document.createElement("td");
      var titleDiv = document.createElement("div");
      // 拼接li
      var topLi = "";
      var leftLi = "";
      for (var i = 0; i < this.topCount; i++) {
        topLi += `<li style="width:${this.cellWidth}px;height:${
          this.cellHeight
        }px; line-height:${this.cellHeight}px">${i+1}</li>`;
      }
      for (var j = 0; j < this.leftCount; j++) {
        leftLi += `<li class="leftLi" style=" width:${
          this.cellWidth
        }px;height:${this.cellHeight}px; line-height:${
          this.cellHeight
        }px">${j+1}</li>`;
      }

      tableDiv.setAttribute("class", "selectDiv");
      // table外层div
      tableDiv.style.cssText = `width:${this.selectWidth}px;height:${
        this.selectHeight
      }px;position:absolute;z-index:-1;top:${top}px;left:${left}px;
      box-sizing:border-box;
      background:rgba(180,239,255,0.4);
      border-width: 2px 1px 1px 2px;
      border-style: solid;
      border-color: rgb(164, 192, 248)`;
      // 选中table
      selectDiv.style.cssText = `width:${this.selectWidth}px;height:${
        this.selectHeight
      }px;position:relative;`;
      // table上方字段
      topUl.style.cssText = `width:${this.selectWidth}px;height:${
        this.cellHeight
      }px;position:absolute;top:${-this.cellHeight -
        2}px;left:-2px;display:flex;`;
      // table左方字段
      leftUl.style.cssText = `width:${this.cellWidth}px;height:${
        this.selectHeight
      }px;position:absolute;top:-2px;left:${-this.cellWidth - 2}px;`;
      topUl.setAttribute("id", "topUl");
      leftUl.setAttribute("id", "leftUl");
      // tableTitle
      titleDiv.style.cssText = `width:${this.cellWidth}px;
      height:${this.cellHeight}px;
      position:absolute;top:-2px;
      left:${-this.cellWidth -2}px;
      top:${-this.cellHeight -2}px;
      line-height:${this.cellHeight}px;
      font-weight:bold;
      box-sizing:border-box;
      text-align:right;
      padding-right:5px;
      font-size:18px;` ;
      titleDiv.innerHTML = "A01"
      // topLi.style.cssText = `border:1px solid blue;width:100px`;
      // leftLi.style.cssText = `border:1px solid blue;height:28px`;

      //   selectDiv.innerHTML=`<table>
      //   <tr>
      //     <th>1</th>
      //     <th>2</th>
      //     <th>3</th>
      //   </tr>
      //   <tr>
      //     <td>4</td>
      //     <td>5</td>
      //     <td>6</td>
      //   </tr>
      // </table>`
      tableDiv.appendChild(selectDiv);
      // topUl.appendChild(topLi);
      topUl.innerHTML = topLi;
      leftUl.innerHTML = leftLi;
      selectDiv.appendChild(topUl);
      selectDiv.appendChild(leftUl);
      selectDiv.appendChild(titleDiv);
      selectDiv.appendChild(tr);
      box.appendChild(tableDiv);
      this.selectWidth = "";
      this.selectHeight = "";
    },
    //选中指定两个单元格之间的所有单元格
    region_select: function(fromTd, toTd) {
      //清除之前的选区
      this.remove_select();

      //获取两个单元格的坐标数据
      var f_row = Number(fromTd.getAttribute("row"));
      var f_col = Number(fromTd.getAttribute("col"));
      var t_row = Number(toTd.getAttribute("row"));
      var t_col = Number(toTd.getAttribute("col"));

      //提取左上角坐标和右下角坐标
      var ltRow = f_row <= t_row ? f_row : t_row; //左上角对应行
      var ltCol = f_col <= t_col ? f_col : t_col; //左上角对应列
      var rbRow = f_row >= t_row ? f_row : t_row; //右下角对应行
      var rbCol = f_col >= t_col ? f_col : t_col; //右上角对应列

      // 计算选中区域宽度高度
      // console.log('列的个数：'+ (rbRow -ltRow +1));
      this.leftCount = rbRow - ltRow + 1;
      // console.log('行的个数：'+ (rbCol - ltCol + 1));
      this.topCount = rbCol - ltCol + 1;
      console.log('宽度：' + this.cellWidth);
      console.log('高度：' + this.cellHeight);
      this.selectWidth = Number((rbCol - ltCol + 1) * this.cellWidth);
      this.selectHeight = Number((rbRow - ltRow + 1) * this.cellHeight);

      //根据坐标范围遍历单元格，设置相应的样式
      var table = fromTd.offsetParent;
      for (var r = ltRow; r <= rbRow; r++) {
        for (var c = ltCol; c <= rbCol; c++) {
          table.rows[r].cells[c].classList.add("cell-select");
          if (r == ltRow) {
            table.rows[r].cells[c].classList.add("cell-select-top");
          } else {
            table.rows[r].cells[c].classList.remove("cell-select-top");
          }
          if (r == rbRow) {
            table.rows[r].cells[c].classList.add("cell-select-bottom");
          } else {
            table.rows[r].cells[c].classList.remove("cell-select-bottom");
          }
          if (c == ltCol) {
            table.rows[r].cells[c].classList.add("cell-select-left");
          } else {
            table.rows[r].cells[c].classList.remove("cell-select-left");
          }
          if (c == rbCol) {
            table.rows[r].cells[c].classList.add("cell-select-right");
          } else {
            table.rows[r].cells[c].classList.remove("cell-select-right");
          }
        }
        table.rows[r].cells[c].classList.remove("cell-select");
        table.rows[r].cells[c].classList.remove("cell-select-top");
        table.rows[r].cells[c].classList.remove("cell-select-bottom");
        table.rows[r].cells[c].classList.remove("cell-select-left");
        table.rows[r].cells[c].classList.remove("cell-select-right");
      }
    },
    //清除所有选中效果
    remove_select: function() {
      $(".cell-select").removeClass("cell-select");
      $(".cell-select-top").removeClass("cell-select-top");
      $(".cell-select-right").removeClass("cell-select-right");
      $(".cell-select-bottom").removeClass("cell-select-bottom");
      $(".cell-select-left").removeClass("cell-select-left");
    }
  }
};
</script>
<style>
.leftLi {
  text-align: right;
  box-sizing: border-box;
  padding-right: 10px;
}
</style>

<style scoped>
#form-frame {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  /* overflow: scroll; */
  /* border-left: 1px solid #000;
  border-top: 1px solid #000; */
}
.form-header {
  font-weight: normal;
  text-align: center;
  position: relative; /*设置相对定位*/
  background-color: #f7f7f7; /*表头背景色*/
  border-color: #666;
}
.form-table {
  border-spacing: 0;
  width: 100%; 
  border-left: 1px solid #666;
  border-top: 1px solid #666;
  table-layout: fixed; /*fixed表示td的宽度是定长的，不随td内容变化而变化*/
  cursor: crosshair;
  webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -ms-user-select: none;
}
.form-row {
  height: 28px;
}
th,
td {
  border-right: 1px solid;
  border-bottom: 1px solid;
  width:80px;
}
.form-cell {
  border-color: #ccc;
}
.cell-select {
  background: #b4efff;
  opacity:0.5;
}
.cell-focus {
  background: #fff;
}
.cell-select-top {
  border-top: 1px solid #a4c0f8;
}
.cell-select-right {
  border-right: 2px solid #a4c0f8;
}
.cell-select-bottom {
  border-bottom: 2px solid #a4c0f8;
}
.cell-select-left {
  border-left: 1px solid #a4c0f8;
}
</style>

