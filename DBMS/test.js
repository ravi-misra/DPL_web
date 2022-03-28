const mongoose = require('mongoose');
const {startOfDay, addMinutes, addDays} = require('date-fns');
const Shift_sch = require('./models/shift_sch');
const {DB_URL}= require('./config')
dbConnect().catch(err => console.log(err));
async function dbConnect() {
    await mongoose.connect(DB_URL);
    console.log('Database connected.');
}

let today = addMinutes(startOfDay(new Date()), 330);
today = addDays(today, 0);
console.log(today);

myFunction(today);
// let x = Shift_sch.distinct('employee',{date: today}).countDocuments(function(err, count) {
//     if (err) return console.log(err);
//     console.log('there are %d kittens', count);
//   });
async  function myFunction(today) {
    let x = await Shift_sch.distinct('employee',{date: today}).countDocuments();
    
    console.log(x);
}