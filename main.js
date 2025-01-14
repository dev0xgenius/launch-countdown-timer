const dayInMillisec = 86400000;
const hourInMillisec = 3600000;
const minInMillisec = 60000;
const secInMillisec = 1000;

let Time = {
  day: 14,
  hour: 0,
  min: 0,
  sec: 0
};

class Timer {
  constructor(time, name="Timer") {
    this.time = Object.assign({}, time);
    this.name = name;
    
    this.startDate = null;
    this.targetDate = null;
    this.active = false;
  }

  getTime(unit = "full") {
    if (unit in this.time) return this.time[unit];

    let timeString = "";
    for (let unit in this.time) {
      let unitText = unit.toUpperCase() + "(s)";
      timeString += (this.time[unit] + unitText);
    } return timeString;
  }

  countdown() {
    this.active = true;
    let T = setInterval(() => {
      this.time.set(this.time.toMilliseconds() - 1000);
      updateTimerUI(this);
      
      if (Time.toMilliseconds() == 0) clearInterval(T);
    }, 1000);
  }
}

function updateTimerUI(timer) {
  if (timer instanceof Timer) {
    for (let unit in timer.time) {
      if (typeof timer.getTime(unit) == 'function') break;

      let unitValue = timer.getTime(unit).toString();
      unitValue = (unitValue.length < 2) ?
        ("0" + unitValue) : unitValue;
      
      let target = document.querySelector(".time-value." + unit);
      target.innerHTML = "<span class='flip'></span>" + unitValue;
      
      target = target.querySelector(".flip");
      if (parseInt(unitValue) != Time[unit]) // If time unit changes
        target.style.animationName ="flip";
      else target.style.animationName = "";
    }
    
    Object.assign(Time, timer.time);
  }
}

const convertFromMilliseconds = (ms, unit) => {
  const units = {
    day: dayInMillisec,
    hour: hourInMillisec,
    min: minInMillisec,
    sec: secInMillisec
  };
  
  let unitValue = ms / units[unit]; // Extract unit equivalent in milliseconds
  if ((ms % units[unit]) != 0)
    unitValue = Math.floor(unitValue); // Make unit value a whole number
  
  ms = ms - (units[unit] * unitValue); // Gets remaining milliseconds if any.
  return [unitValue, ms];
};

function timerSet() {
  return (localStorage.getItem("time")) ? true : false;
}

Time.toMilliseconds = function () {
  let timeObj = this;
  let milliseconds = 0;

  for (let unit in timeObj) {
    let unitValue = timeObj[unit];

    if (unit == "day") milliseconds += unitValue * dayInMillisec;
    else if (unit == "hour") milliseconds += unitValue * hourInMillisec;
    else if (unit == "min") milliseconds += unitValue * minInMillisec;
    else if (unit == "sec") milliseconds += unitValue * secInMillisec;
  }
  return milliseconds;
};

Time.set = function(milliseconds) {
  let result = null;
  let time = this;
  
  for (let unit in time) {
    if (typeof time[unit] == "function") break;
    result = convertFromMilliseconds(milliseconds, unit);
    time[unit] = result[0];
    milliseconds = result[1];
  }
};

function main() {
  let timer = null;
  let targetDate = null;
  
  if (timerSet()) {
    targetDate = new Date(localStorage.getItem("time"));
    Time.set(targetDate.getTime() - Date.now());
    timer = new Timer(Time);
  } else {
    timer = new Timer(Time, "Random");
    targetDate = new Date(Date.now() + Time.toMilliseconds());
    localStorage.setItem("time", targetDate.toString());
  }
  
  updateTimerUI(timer);
  timer.countdown();
}

main();