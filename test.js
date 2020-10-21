/**
 * @name Test.JS
 * @description Test file for bench.js
 *
 * @author 0J3
 */

const benchjs = new (require("."))();

// Create Tasks
const task1 = benchjs.createTask("Sample Task 1"); // create task
task1.begin();
const task2 = benchjs.beginTask("Sample Task 2"); // create task and auto begin
const task3 = benchjs.createTask("Sample Task 3"); // create task and dont begin
task3.begin();

const task4 = benchjs.createTask("Sample Task 4");
task4.begin();
const task5 = benchjs.beginTask("Sample Task 5");

// Finish Tasks
task1.finish();
task2.finish();
task3.finish();
task4.finishWithError(new Error("bean"));
task5.finishWithError(new Error("bean"));

benchjs.finish(); // Finish
