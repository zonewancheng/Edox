# picker 多功能选择器(简要文档-详请自己看代码备注)


## 接收参数 (可扩展)

pickerId：String 容器ID 默认 koi-picker(只有一个实例时可用) （必填）

pickerData：JSON 需要渲染的数据 （必填）（格式见示例 注意：cid的值需要和key保持一致）

pickerCallback：Function  初始化picker完成以后调用的方法（可选 ），如果用于获取PICKER对象（必填），

pickerCharacter：String 每个__picker之间的间隔符号 （可选）

pickerLineHeight：Number 每行的高度 默认48  单位像素 （可选）

pickerLines：Number 显示的行数，最小值1 ，默认为 3，必须为奇数，偶数时上下不对称，不影响使用 （可选）


moveDistance：Number 单次动画移动的距离，用于控制滚动速度，默认 1 （可选）

moveRate：Number 移动频率，默认 500  （可选）

moveDouble：Number 惯性系数，影响拖动松开后移动的距离 默认 2（可选）


fza：Number 阻力系数，默认 0.02 单位时间内速度减小的值 （可选）

resistance：Number 默认 0.10  当滚动超出边界时受到阻力，1为最大值，此时不能超出边界拖动 （可选）

## 数值获取

选中项获取：picker.getSelectOptions(); 以数组格式返回当前选中项的值，

选中项Index(下标)获取：picker.getSelectIndexList()

选中项Id获取：picker.getSelectIdList()

### 回调事件
当滚动停止的时候触发：
__picker.onScrollEndCallBack = function (id) {
   if(id==day_id){
     console.log(day_id+"scroll-end")
   }
 }

 当选中项发生改变的时候触发：
 __picker.onSelectChangedCallBack = function (id) {
    if(id==day_id){
      console.log(day_id+"scroll-end")
    }
  }

滚动某个picker到第N个值：__picker.scrollToIndex(picker_id, N-1);

更新单个picker的数据：__picker.updatePicker(N-1, picker_data);//从左向右第N个picker，起始值为0

滚动某个picker到下一个值：__picker.scrollNext(picker_id);

滚动某个picker到上一个值：__picker.scrollPrev(picker_id);

滚动某个picker到第一个值：__picker.scrollFirst(picker_id);

滚动某个picker到最后一个值：__picker.scrollLast(picker_id);


## 使用方法（示例Vue）
```html
<div class="__pickers">

    <picker :picker-id="myId"
            :picker-data="myData"
            :picker-character="character"
            :picker-lines="showLines"
            :picker-line-Height="linesHeight"
            :picker-callback="initPicker"
    ></picker>

    <picker :picker-id="myId0"
            :picker-data="myData"
            :picker-character="character"
            :picker-lines="showLines0"
            :picker-line-Height="linesHeight"
            :picker-callback="initPicker0"
    ></picker>


  </div>
```
```javascript
import picker from '../../components/picker/pickers.vue';


  var pickerData = {
    data: {
      year: {
        cid: "year",// 当前列ID
        suffix: "年",//当前列后缀
        list: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031",
          "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040"]
      },
      month: {
        cid: "month",
        suffix: "月",
        list: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
      },
      day: {
        cid: "day",
        suffix: "日",
        list: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
          "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
      }
    }
  }
  export default {
    name: "pickers",
    data () {
      return {
        myId: "date-picker",
        myData: pickerData,
        character: "-",
        linesHeight: 48,
        showLines: 3, //只能为奇数

        myId0: "date-picker0",
        showLines0: 1, //只能为奇数
      }
    },
    methods: {
      initPicker: function (pk) {
        this.pickerTimer = pk;
      },
      initPicker0: function (pk) {
        this.picker0 = pk;
      },
    },
    mounted(){
      var days = {
        cid: "day",
        suffix: "日",
        list: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
          "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"]
      }

      var __picker = this.pickerTimer;

      var year_id = __picker._pickerIdList[0];

      var month_id = __picker._pickerIdList[1];

      var day_id = __picker._pickerIdList[2];

      var month = new Date().getMonth();

      var day = new Date().getDate() - 1;

      __picker.scrollToIndex(month_id, month);

      __picker.updatePicker(2, days);//从左向右第n个picker，起始值为0

      __picker.scrollNext(year_id);

      //__picker.scrollLast(day_id);

      __picker.scrollToIndex(day_id, day);


      __picker.onScrollEndCallBack = function (id) {
              if(id==day_id){
                console.log(day_id+"scroll-end")
              }
              if(id==year_id){
                console.log(year_id+"scroll-end")
              }
              if(id==month_id){
                console.log(month_id+"scroll-end")
              }
            }

    },
    components: {
      picker
    }
  }
```
```css
/*非必须*/
* {
    user-select: none;
  }

  .__pickers #date-picker {
    margin: 90px 0;
    /*background: #f5f5f5;*/
    border-top: 1px solid #ececec !important;
    border-bottom: 1px solid #ececec !important;
  }


  .__pickers .picker-select-index {
    border-top: 1px solid #56bdff !important;
    border-bottom: 1px solid #56bdff !important;
  }
  .__pickers li{
    color:#999;
  }
  .__pickers .__index{
    color:#333;
  }
  __pickers .__prev:before {
    content: "顶部";
  }

  __pickers .__next:before {
    content: "底部";
  }

  __pickers .__prev {
    background-color: #ececec;
  }

  __pickers .__next {
    background-color: #ececec;
  }

```
##注意事项

由于vue的特点，在页面路由跳转之前，如果页面的定时器没有停止，会报错，

所以，如果picker在离开页面时有可能处在滚动状态的话，就需要加上下面的代码，

```JS

/**和methods保持平级**/

beforeRouteLeave (to, from, next) {

      this.pickerTimer.stopAll();
      next(true);
    },

```

# 其它属性与方法（参考）


## 初始常量 （picker代表全局返回的对象，_picker代表单个可滚动列表，id代表单个_picker的id）

picker._parentId  //容器Id
picker.__modelData //初次加载的数据
picker._lineHeight //px *此处lineHeight需要在样式中设置！
picker._moveDistance //每次滚动的单位 px ，加快滚动速度，与回弹速度
picker._moveDouble // 惯性系数 数字越大 拖动后滚动的距离越远

picker._moveRate // 1~1000 移动频率 数字越大，频率越高
picker._character //间隔符号
picker._showLines//默认显示行数
picker._fza //阻力系数 单位时间内速度减小的值
picker._resistance // 当滚动超出边界时受到阻力

## 属性

picker._pickerNum //生成的_picker的个数

picker._pickerIdList //所有_picker的id数组

picker[id].moving //单个_picker的运动状态 true|false

picker[id].maxIndex //单个_picker的最大可scrollToIndex 到的值

picker[id].maxMoveDistance //单个_picker从头到尾的最大可滚动距离

picker[id]._forceStop //是否为强制停止状态 （拖动状态下为true）

picker[id]._interval  //匀速滚动的定时器

picker[id]._intervals //匀减速滚动的定时器

picker[id]._moveRatio //单个_picker拖动后松开时的移动系数

picker[id].firstStartY //上次拖动时（鼠标或手指）的开始位置

picker[id].lastEndY //上次拖动时（鼠标或手指）的结束位置

picker[id].startTime // 上次拖动时（鼠标或手指）的开始时间

picker[id].endTime //上次拖动时（鼠标或手指）的结束时间

## 方法

暂无








