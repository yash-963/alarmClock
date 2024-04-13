// fetching elemenmts
let clock = document.querySelector(".clock")
let minutesLine = document.querySelector(".minutesLines")
let hourSelect = document.querySelector("#hour")
let minuteSelect = document.querySelector("#minute")
let secondSelect = document.querySelector("#second")
let dayOrNight = document.querySelector("#dayOrNight")
let setAlarmButton = document.querySelector(".setAlarmButton")
let alarmList = document.querySelector("#alarmList")

// declaring variables
let curruentAlarmId = 0;
let alarmtimesAdded = [];

// get current Time
function getCurrentTime() {
    const currentTiming = new Date();
    return currentTiming;
}

// designing clocks
for (let i = 1; i < 60; i++) {
    const minutesLines = document.createElement("div");
    minutesLines.className = "minutesLines";
    minutesLines.style.transform = "rotate(" + 6 * i + "deg)"
    clock.append(minutesLines)
}


// set clock
function setClock() {
    // get date details
    let currentTime = getCurrentTime();
    let currentHours = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();
    let currentSecond = currentTime.getSeconds();
    let currentDate = currentTime.getDate();
    let currentMonth = currentTime.getMonth() + 1;
    let currentYear = currentTime.getFullYear();

    // get elements from clock
    let hourElement = document.querySelector('.hourHand');
    let minuteElement = document.querySelector('.minuteHand');
    let secondElement = document.querySelector('.secondHand');
    let dateElement = document.querySelector('.date');

    // set date to clock
    if (currentMonth < 9) {
        currentMonth = "0" + currentMonth;
    }
    dateElement.textContent = `${currentDate}/${currentMonth}/${currentYear}`


    // set clock hands
    let hourDeg = currentHours * 30 + currentMinutes * (360 / 720);
    let minuteDeg = currentMinutes * 6 + currentSecond * (360 / 3600);
    let secondDeg = currentSecond * 6;

    secondElement.style.transform = `translate(-50%, -102%) rotate(${secondDeg}deg)`
    hourElement.style.transform = `translate(-50%, -108%) rotate(${hourDeg}deg)`
    minuteElement.style.transform = `translate(-50%, -108%) rotate(${minuteDeg}deg)`
}


// run clock
setInterval(() => {
    setClock();
    runAlarms();
}, 1000)


// set values to selection box

for (let i = 1; i <= 12; i++) {
    const hourValue = document.createElement("option");
    hourValue.value = i;
    hourValue.textContent = i;
    hourSelect.append(hourValue)
}
for (let i = 0; i < 60; i++) {
    const minuteValue = document.createElement("option");
    minuteValue.value = i;
    minuteValue.textContent = i;
    minuteSelect.append(minuteValue)
}
for (let i = 0; i < 60; i++) {
    const secondValue = document.createElement("option");
    secondValue.value = i;
    secondValue.textContent = i;
    secondSelect.append(secondValue)
}
// set initals value
function setInitalValues() {
    const currentDate = getCurrentTime()
    if (currentDate.getHours() == 0) {
        const element = document.querySelector(`#hour option[value="${12}"]`)
        element.selected = true
    }
    else if (currentDate.getHours() > 12) {
        const element = document.querySelector(`#hour option[value="${currentDate.getHours() - 12}"]`)
        const element1 = document.querySelector(`#dayOrNight option[value="PM"]`)
        element.selected = true
        element1.selected = true
    }
    else {
        const element = document.querySelector(`#hour option[value="${currentDate.getHours()}"]`)
        element.selected = true
    }
    const minElement = document.querySelector(`#minute option[value="${currentDate.getMinutes()}"]`);
    const secElement = document.querySelector(`#second option[value="${currentDate.getSeconds()}"]`)
    minElement.selected = true
    secElement.selected = true
}
setInitalValues()


// add event listner
setAlarmButton.addEventListener("click", setAlarm)


// set alarm function
function setAlarm() {
    curruentAlarmId++;
    const alarmbox = document.createElement('div');
    alarmbox.className = `box d-flex justify-content-between px-3 p-2 mt-2 alarmID alarmId${curruentAlarmId}`;
    alarmbox.innerHTML = `<div class="time timeID"><span class="timeInHour">${hourSelect.value}</span>:<span class="timeInMinute">${minuteSelect.value}</span>:<span>${secondSelect.value}</span> <span class="timeInZone">${dayOrNight.value}</span></div><div class="delete"><button  onclick="deleteCurrentAlarm(${curruentAlarmId})">delete</button></div>`
    alarmList.append(alarmbox);
    alarmtimesAdded.push({ "id": curruentAlarmId, "alarmTimeMinute": Number(minuteSelect.value), "alarmTimeHour": Number(hourSelect.value), "alarmSecond": Number(secondSelect.value), "zone": dayOrNight.value, "played": false })
    // runAlarms();
}


// function delete current alarm
function deleteCurrentAlarm(id) {
    const deleteEmement = document.querySelector(`.alarmId${id}`);
    deleteEmement.remove();
    // this will delete alarm from the alarms Array
    alarmtimesAdded = alarmtimesAdded.filter((el) => {
        if (el.id != id) {
            return el
        }
    })
    // runAlarms();
}


// ring alarm
function runAlarms() {
    for (let i of alarmtimesAdded) {
        let currentTimeInHours = i.alarmTimeHour;
        if ((i.zone == "PM") && (i.alarmTimeHour == 12)) {
            currentTimeInHours = 12;
        }
        else if (i.zone == "PM") {
            currentTimeInHours = i.alarmTimeHour + 12;
        }
        else if ((i.zone == "AM") && (i.alarmTimeHour == 12)) {
            currentTimeInHours = 0;
        }
        playAlarm(currentTimeInHours, i.alarmTimeMinute, i.alarmSecond, i.id);
    }
}



// play Alarm
function playAlarm(alarmTimeHour, TimeInMinute, timeInSec, alarmID) {
    const currentTimeForAlarm = getCurrentTime();
    if ((alarmTimeHour == currentTimeForAlarm.getHours()) && (TimeInMinute == currentTimeForAlarm.getMinutes()) && (timeInSec == currentTimeForAlarm.getSeconds())) {
        for (let i of alarmtimesAdded) {
            if (i.id == alarmID) {
                if (i.played == false) {
                    let audio = new Audio('Media/alarmSound.mp3')
                    audio.play();
                    alert("Alarm Played")
                    i.played = true
                }
            }
        }
    }
}
