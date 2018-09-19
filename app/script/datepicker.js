function addClass(el, cls) {
  if (!el) return
  let curClass = el.className
  let classes = (cls || '').split(' ')

  for (let i = 0; i < classes.length; i++) {
    let clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

function padLeftZero(val) {
  return parseInt(val) < 10 ? "0" + parseInt(val) : parseInt(val)
}

function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}


function removeClass(el, cls) {
  if (!el || !cls) return
  let classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0; i < classes.length; i++) {
    let clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

function toggleClass(el, cls) {
  if (hasClass(el, cls)) {
    removeClass(el, cls)
  } else {
    addClass(el, cls)
  }
}

let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

const Datepicker = function (opt) {
  let options = {
    el: '',
    pickDate: '',
    minDate: '1991-12-26',
    maxDate: '2050-12-12',
    isChangeYear: false,
    isEdit: false
  }
  let data = this.options = Object.assign(options, opt)
  Object.keys(data).forEach((key) => {
    this._proxyData(key)
  })

  this.monthString = 1
  this.days = []
  this.year = ''
  this.pickYear = ''
  this.pickMonth = ''
  this.day = ''
  this.sltDay = ''
  this.today = ''
  this.hour = ''
  this.minute = ''
  this.months = months
  this.isFirst = true
  this.weeks = ["日", "一", "二", "三", "四", "五", "六"]
  this.hub = Object.create(null)
  this.init()
}

Datepicker.prototype._proxyData = function (key) {
  Object.defineProperty(this, key, {
    configurable: false,
    enumerable: true,
    get: function proxyGetter() {
      return this.options[key]
    },
    set: function proxySetter(newVal) {
      this.options[key] = newVal
    }
  })
}

Datepicker.prototype.init = function () {
  this.calculateDate()
  this.generateData(this.year, this.month)
}

Datepicker.prototype.calculateDate = function () {
  let now = new Date()
  let splitDate = []
  if (this.pickDate.split(" ")[0] != undefined) {
    if (this.pickDate.split(" ")[0].indexOf("-") != -1) {
      splitDate = this.pickDate.split(" ")[0].split("-")
    } else if (this.pickDate.split(" ")[0].indexOf("/") != -1) {
      splitDate = this.pickDate.split(" ")[0].split("/")
    }
  }

  if (splitDate.length >= 2) {
    this.year = parseInt(splitDate[0])
    this.month = parseInt(splitDate[1]) - 1
    this.day = parseInt(splitDate[2])
    this.pickYear = parseInt(splitDate[0])
    this.pickMonth = parseInt(splitDate[1]) - 1
    this.pickDay = parseInt(splitDate[2])
  } else {
    this.year = now.getFullYear()
    this.month = now.getMonth()
    this.day = now.getDate()
    this.sltDay = padLeftZero(now.getDate())
  }

  if (this.pickDate.split(" ")[1] != undefined) {
    this.hour = this.pickDate.split(" ")[1].split(":")[0]
    this.minute = this.pickDate.split(" ")[1].split(":")[1]
    this.second = this.pickDate.split(" ")[1].split(":")[2]
  } else {
    this.hour = padLeftZero(now.getHours())
    this.minute = padLeftZero(now.getMinutes())
    this.second = padLeftZero(now.getSeconds())
  }

  this.monthString = this.months[this.month]
}

Datepicker.prototype.generateData = function (y, m) {
  this.excuteDateRange()
  let firstDayOfMonth = new Date(y, m, 1).getDay() //当月第一天
  let lastDateOfMonth = new Date(y, m + 1, 0).getDate() //当月最后一天
  let lastDayOfLastMonth = new Date(y, m, 0).getDate() //上个月的最后一天
  this.year = y
  let line = 0
  let temp = []
  for (let i = 1; i <= lastDateOfMonth; i++) {
    let dow = new Date(y, m, i).getDay()
    // 第一行
    if (dow == 0) {
      temp[line] = []
    } else if (i == 1) {
      temp[line] = []
      let k = lastDayOfLastMonth - firstDayOfMonth + 1
      for (let j = 0; j < firstDayOfMonth; j++) {
        temp[line].push({
          day: k,
          prevMonth: true,
          disabled: true,
          selected: false
        })
        k++
      }
    }

    if (
      (i < this.minDay && parseInt(this.minMonth) - 1 == this.month && this.minYear == this.year) ||
      (i > this.maxDay && parseInt(this.maxMonth) - 1 == this.month && this.maxYear == this.year)
    ) {
      temp[line].push({
        day: i,
        disabled: true,
        selected: false
      })
    } else {
      temp[line].push({
        day: i,
        disabled: false,
        selected: false
      })
    }

    let chk = new Date()
    let chkY = chk.getFullYear()
    let chkM = chk.getMonth()
    let chkD = chk.getDate()
    if (chkY == this.year && chkM == this.month && i == chkD) {
      temp[line].pop()
      temp[line].push({
        day: i,
        today: true,
        selected: false
      })
      this.today = [line, temp[line].length - 1]
    }
    if (i == this.pickDay && this.pickMonth == this.month && this.pickYear == this.year) {
      temp[line].pop();
      temp[line].push({
        day: i,
        selected: true
      })
    }

    // 最后一行
    if (dow == 6) {
      line++
    } else if (i == lastDateOfMonth) {
      let k = 1
      for (dow; dow < 6; dow++) {
        temp[line].push({
          day: k,
          nextMonth: true,
          disabled: true,
          selected: false
        })
        k++
      }
    }
  }
  //end for
  console.log(temp)
  this.days = temp
  this.renderDate()
}

Datepicker.prototype.excuteDateRange = function () {
  if (this.minDate.split("-") != -1) {
    this.minYear = this.minDate.split("-")[0]
  } else {
    this.minYear = this.minDate.split("/")[0]
  }
  if (this.minDate.split("-") != -1) {
    this.minMonth = this.minDate.split("-")[1]
  } else {
    this.minMonth = this.minDate.split("/")[1]
  }
  if (this.minDate.split("-") != -1) {
    this.minDay = this.minDate.split("-")[2] == undefined
      ? ""
      : this.minDate.split("-")[2]
  } else {
    this.minDay = this.minDate.split("/")[2] == undefined
      ? ""
      : this.minDate.split("/")[2]
  }

  if (this.maxDate.split("-") != -1) {
    this.maxYear = this.maxDate.split("-")[0]
  } else {
    this.maxYear = this.maxDate.split("/")[0]
  }
  if (this.maxDate.split("-") != -1) {
    this.maxMonth = this.maxDate.split("-")[1]
  } else {
    this.maxMonth = this.maxDate.split("/")[1]
  }
  if (this.maxDate.split("-") != -1) {
    this.maxDay = this.maxDate.split("-")[2] == undefined
      ? ""
      : this.maxDate.split("-")[2]
  } else {
    this.maxDay = this.maxDate.split("/")[2] == undefined
      ? ""
      : this.maxDate.split("/")[2]
  }

  this.disPrev = this.minYear >= this.year && parseInt(this.minMonth) - 1 >= this.month
  this.disNext = this.maxYear <= this.year && parseInt(this.maxMonth) - 1 <= this.month
}

Datepicker.prototype.bindEvent = function (isFirst) {
  if (isFirst) {
    if (this.bodyEvent) {
      document.body.removeEventListener('click', this.bodyEvent)
    }
    this.bodyEvent = () => {
      let pickContent = document.querySelector('#pick-date')
      addClass(pickContent, 'hide')
    }
    document.body.addEventListener('click', this.bodyEvent)
  }

  document.querySelector('#pick-date-wrap').addEventListener('click', (e) => {
    e.stopPropagation()
    let target = e.target
    let pickContent = document.querySelector('#pick-date')
    if (hasClass(target, 'disabled')) {
      return
    }
    if (hasClass(target, 'date-value')) {
      toggleClass(pickContent, 'hide')
    }
    if (hasClass(target, 'pick-prev')) {
      if (!this.disPrev) {
        if (--this.month <= -1) {
          this.year--
          this.month = 11
        }
        this.refresh(this.year, this.month)
      }
    }
    if (hasClass(target, 'pick-next')) {
      if (!this.disNext) {
        if (++this.month >= 12) {
          this.month = 0
          this.year++
        }
        this.refresh(this.year, this.month)
      }
    }
    if (hasClass(target, 'day')) {
      let data = JSON.parse(target.getAttribute('data-item'))
      let k1 = data.k1
      let k2 = data.k2
      let next = data.nextMonth
      let prev = data.prevMonth

      Array.prototype.forEach.call(document.querySelectorAll('.day'), (day) => {
        removeClass(day, 'selected')
      })
      addClass(target, 'selected')

      let formatDate = ""
      this.sltDay = padLeftZero(this.days[k1][k2].day)
      if (!next && !prev) {
        if (this.pickDate.indexOf("/") != -1) {
          formatDate = this.year + "/" + padLeftZero(this.month + 1) + "/" + this.sltDay
        } else {
          formatDate = this.year + "-" + padLeftZero(this.month + 1) + "-" + this.sltDay
        }
      } else if (next) {
        if (this.pickDate.indexOf("/") != -1) {
          formatDate = this.year + "/" + padLeftZero(this.month + 2) + "/" + this.sltDay
        } else {
          formatDate = this.year + "-" + padLeftZero(this.month + 2) + "-" + this.sltDay
        }
      } else if (prev) {
        if (this.pickDate.indexOf("/") != -1) {
          formatDate = this.year + "/" + padLeftZero(this.month) + "/" + this.sltDay
        } else {
          formatDate = this.year + "-" + padLeftZero(this.month) + "-" + this.sltDay
        }
      }

      let dateInput = document.querySelector('#date-value')
      dateInput.value = formatDate
      this.pickDate = formatDate
      this.calculateDate()
      this.$emit('change', formatDate)
      addClass(pickContent, 'hide')
    }
  })
}

Datepicker.prototype.renderDate = function () {
  let tbodyTemplate = this.days.map((day, k1) => {
    return `<tr>
              ${day.map((item, k2) => {
        return `<td class="${item.selected ? 'selected' : ''} ${item.disabled ? 'disabled' : ''} ${item.today ? 'today' : ''} day"
                    data-item='${JSON.stringify({ k1: k1, k2: k2, nextMonth: item.nextMonth, prevMonth: item.prevMonth, disabled: item.disabled })}'>
                  ${item.day}
                </td>`
      }).join('')}
            </tr >`
  }).join('')
  let theadTemplate = this.theadTemplate ? this.theadTemplate : this.weeks.map(week => `<td>${week}</td>`).join('')
  let template = `<div id="pick-date-wrap">
                    <input id="date-value" class="date-value" value="${this.pickDate}" placeholder = "选择日期" />
                    <div id="pick-date" class="${this.isFirst ? 'hide' : ''}" >
                      <div class="pick-tools">
                        <div class="pick-top">
                          <span @click.stop="prevYear" class="prev-year ${this.isChangeYear ? '' : 'hide'}"></span>
                          <span @click.stop="prev" class="${this.disPrev ? 'pick-prev disabled' : 'pick-prev'}" >«</span >
                          <input type="text"  value="${this.year}" @change="changeYear" min = "1970" max = "2100" maxlength = "4" >/
                          ${this.monthString}
                          <span @click.stop="next" class="${this.disNext ? 'pick-next disabled' : 'pick-next'}" >»</span >
                          <span class="next-year ${this.isChangeYear ? '' : 'hide'}" @click.stop="nextYear" ></span >
                        </div>
                      </div >
                      <table cellpadding="0" cellspacing="0">
                        <thead class="table-head"><tr>${theadTemplate}</tr></thead>
                        <tbody class="table-content">${tbodyTemplate}</tbody>
                      </table>
                    </div>
                </div>`

  this.el.innerHTML = template
  this.bindEvent(this.isFirst)
  this.isFirst = false
}

Datepicker.prototype.refresh = function (y, m) {
  this.monthString = this.months[m]
  this.generateData(y, m)
}

Datepicker.prototype.resetDate = function (opt) {
  this.options = Object.assign(this.options, opt)
  this.isFirst = true
  this.init()
}

Datepicker.prototype.$emit = function (event, data) {
  (this.hub[event] || []).forEach(handler => handler(data))
}

Datepicker.prototype.$on = function (event, handler) {
  if (!this.hub[event]) this.hub[event] = []
  this.hub[event].push(handler)
}

Datepicker.prototype.$off = function (event, handler) {
  const i = (this.hub[event] || []).findIndex(h => h === handler)
  if (i > -1) this.hub[event].splice(i, 1)
}

Datepicker.prototype.$once = function (event, handler) {
  let listener = (...args) => {
    if (handler) {
      handler.apply(this, args)
    }
    this.$off(event, listener)
  }
  this.$on(event, listener)
}

export default Datepicker