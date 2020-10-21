# bench.js [![Known Vulnerabilities](https://snyk.io/test/npm/@0j3/bench-js/1.0.0/badge.svg)](https://snyk.io/test/npm/@0j3/bench-js/1.0.0)

a benchmarking tool in nodejs

## Installing

```bash
yarn add @0j3/bench-js
```

## Usage

To use bench.js, start by initializing it:

```js
const benchjs = new (require("bench-js"))(true); // The first argument in the constructor of bench.js (the "true") specifies, if benchjs.finish (see below) should output anything
```

Then, start by creating a "Task" where your program does something you want to benchmark (you can have infinite tasks, and you should make anything that takes lots of time have a task), by using

```js
const task = benchjs.createTask("Sample Task Name");
```

at the beginning of you code.

To start the task (specify when it's execution starts), use

```js
task.begin();
```

IMPORTANT: DO NOT CALL `Task.start` AS THAT IS AN INTEGER SPECIFYING WHEN IT STARTED!

<br>

To tell Bench.JS when a task is finished, use

```js
task.finish();
```

<br>

To tell Bench.JS that a task has errored, use

```js
task.error(new Error("Error Message Here"));
```

<br>

At the end of your code, you must add

```js
benchjs.finish(0);
```

The `0` is optional, and specifies the exit code.

When running finish, bench.js will exit your program, once its done outputting the benchmark data, so it is important that you have nothing else running after this.

## Extending Bench.JS

If you want to extend bench.js, use

```js
const BenchOriginal = require("benchjs");
class Bench extends BenchOriginal {
  constructor(outputResults = true) {
    super.constructor(outputResults); // call original constructor
  }
}
```

and add whatever you want from there.

<br>

If you want to extend the task class aswell, use

```js
const BenchOriginal = require("benchjs");
class Task extends BenchOriginal.Task {
  constructor(taskName, id, parent) {
    super.constructor(taskName, id, parent); // call original constructor
  }
}

class Bench extends BenchOriginal {
  constructor(outputResults = true) {
    super.constructor(outputResults); // call original constructor
    super.TaskClass = Task;
  }
}
```

and add whatever you want from there.
