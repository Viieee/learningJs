let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints time in HH:MM format
console.log(hours + ":" + minutes);
VM24:23 2021-12-25
VM24:26 2021-12-25 18:9:29
VM24:29 18:9
undefined
typeof(seconds)
'number'
hours
18
hours + 7
25
date
'25'
let newDate = new Date(1998, 9, 30, 13, 40, 05);
undefined
newDate
Fri Oct 30 1998 13:40:05 GMT+0700 (Western Indonesia Time)
let currentHour = newDate.getHours()
undefined
newDate.(currentHour + 15)
VM469:1 Uncaught SyntaxError: Unexpected token '('
newDate.setHours(currentHour+13)
909776405000
newDate
Sat Oct 31 1998 02:40:05 GMT+0700 (Western Indonesia Time)