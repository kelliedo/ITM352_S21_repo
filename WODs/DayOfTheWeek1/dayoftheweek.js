day = 27;
month = "Oct";
year = 1999;

if (month == "Jan" || month == "Feb") {
    step1 = year - 2;
} else {
    step1 = year - 1;
}

step2 = parseInt(step1 / 4);
step3 = parseInt(step1 / 100);
step4 = parseInt(step1 / 400);
step5 = step4 + day;

switch (month) {
    case "Jan":
        monthKey = 0;
        break;
    case "Feb":
        monthKey = 3;
        break;
    case "Mar":
        monthKey = 2;
        break;
    case "Apr":
        monthKey = 5;
        break;
    case "May":
        monthKey = 0;
        break;
    case "Jun":
        monthKey = 3;
        break;
    case "Jul":
        monthKey = 5;
        break;
    case "Aug":
        monthKey = 1;
        break;
    case "Sep":
        monthKey = 4;
        break;
    case "Oct":
        monthKey = 6;
        break;
    case "Nov":
        monthKey = 2;
        break;
    case "Dec":
        monthKey = 4;
        break;
}

step6 = monthKey + step5;
step7 = step6 % 7;

if (step7 == 0) {
    dayOfTheWeek = 'Monday'
} else if (step7 == 1) {
    dayOfTheWeek = 'Tuesday'
} else if (step7 == 2) {
    dayOfTheWeek = 'Wednesday'
} else if (step7 == 3) {
    dayOfTheWeek = 'Thursday'
} else if (step7 == 4) {
    dayOfTheWeek = 'Friday'
} else if (step7 == 5) {
    dayOfTheWeek = 'Saturday'
} else if (step7 == 6) {
    dayOfTheWeek = 'Sunday'
}

console.log(`${month} ${day} ${year} is a ${dayOfTheWeek}`);