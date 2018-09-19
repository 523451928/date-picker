# Datepicker
原生js写的一个pc端日期选择器

## 查看demo
```
git clone https://github.com/523451928/date-picker.git
cd date-picker
npm install
npm run dev
```

## Datepicker的使用方法
```
引用./styles/date-picker.css
引用./script/datepicker.js
或者
import './main.css'
import './styles/date-picker.css'
import Datepicker from './script/datepicker'
let now = new Date()

let pickDate = now.getFullYear() + "-" + padLeftZero(now.getMonth()) + "-"
  + padLeftZero(now.getDate())

let date = new Datepicker({
  pickDate: pickDate,
  el: document.querySelector('.date-picker'),
  minDate: pickDate
})

date.$on('change', (val) => {
  console.log(val)
  setTimeout(() => {
    date.resetDate({
      pickDate: now.getFullYear() + 1 + "-" + this.padLeftZero(now.getMonth()) + "-" + this.padLeftZero(now.getDate())
    })
  }, 1000)
})

function padLeftZero(val) {
  return parseInt(val) < 10 ? "0" + parseInt(val) : parseInt(val)
}
```
## arguments
| Option | Description | Type | Default |
| ----- | ----- | ----- | ----- |
| pickDate | 初始化时间 | String | '' |
| minDate | 最小时间 | String | '1991-12-26' |
| maxDate | 最大时间 | String | '2050-12-12' |
| el | 包裹日期选择的容器 | String or Dom | 'body' |


## 可以监听Datepicker实例的事件
| Function | Description |
| ----- | -----|
| change | 返回当前选中的时间 |
