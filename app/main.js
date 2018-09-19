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
console.log(date)

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