/**
 * @name lib.js (Bench.JS)
 * @description Benchmarking tool, designed for Hen.JS
 *
 * @author 0J3
 */

const { performance } = require("perf_hooks"),
  fs = require("fs"),
  startDate = new Date(),
  errMsgGen = new (require("errmsgs"))(),
  chalk = require("chalk");

class Task {
  /**
   * @name id
   * @description A unique identifier
   *
   * @type Integer
   *
   * @public
   */
  start = 0;

  /**
   * @name start
   * @description Start Time, -1 when not started
   *
   * @type Integer
   *
   * @public
   */
  start = -1;

  /**
   * @name end
   * @description End Time, -1 when not finished
   *
   * @type Integer
   *
   * @public
   */
  end = -1;

  /**
   * @name timeTaken
   * @description Time taken to run task, -1 when not finished
   *
   * @type Integer | String
   *
   * @public
   */
  timeTaken = -1;

  /**
   * @name finished
   * @description Is the task finished?
   *
   * @type Boolean
   *
   * @public
   */
  finished = false;

  /**
   * @name name
   * @description Name of the task
   *
   * @default "No Specified Name"
   *
   * @type String
   *
   * @public
   */
  name = "No Specified Name";

  /**
   * @name constructor
   * @description Name of the task
   *
   * @type String
   *
   * @argument {String} taskName the name of the task
   * @argument {Integer} taskName the ID of the task
   *
   * @public @constructor @constant
   */
  constructor(taskName, id) {
    this.name = taskName;
    this.id = id;
  }

  begin() {
    this.start = performance.now();
    this.finished = false;
  }
  finish() {
    this.finished = true;
    this.end = performance.now();

    this.timeTaken = this.end - this.start;

    this.timeTaken = this.timeTaken / 1000; // ms to s

    // ensure full amount of decimals are present
    this.timeTaken = this.timeTaken + 0.000000000001;
    // remove some decimals
    this.timeTaken = this.timeTaken * 100000;
    this.timeTaken = Math.floor(this.timeTaken);
    this.timeTaken = this.timeTaken / 100000;
  }

  /**
   * @name finishWithError
   * @description Finish, with an error
   *
   * @usage Task.finishWithError(<Error | Name,[Code]>)
   *
   * @public
   */
  finishWithError(throwOrName, exitCode) {
    if (throwOrName instanceof Error) {
      let e = throwOrName;
      this.finished = true;

      const d = startDate;

      let errfile = `${d.toDateString()} at ${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`;

      errfile = errfile.split(" ").join("-");

      if (!fs.existsSync(`${__dirname}/errors/${errfile}`)) {
        fs.mkdirSync(`${__dirname}/errors/${errfile}`);
      }

      errfile = `${errfile}/${this.name}`;

      errfile = `${errfile}.err.log`;

      errfile = `${__dirname}/errors/${errfile}`;

      (async () => {
        let finalerrmsg = `An error has occured while running task ${this.name} (#${this.id}):\n${e}`;
        finalerrmsg = await errmsgs.error(finalerrmsg);

        fs.writeFileSync(errfile, finalerrmsg);
      })();

      this.timeTaken = `DNF | Error (See ${errfile})`;
    }
  }

  /**
   * @name error
   * @see finishWithError
   * @description Alias to finishWithError
   */
  error(...a) {
    this.finishWithError(a);
  }
}

class BenchJS {
  benchmarkMode = true;
  tasks = [];

  constructor(benchmarkEnabled = true) {
    this.benchmarkMode = benchmarkEnabled; // Unused - Might be implemented in the future

    this.createTask();

    const firstTask = this.createTask();
    firstTask.begin();
  }

  /**
   * @name createTask
   * @description Returns a task
   *
   * @param {String} name
   * @returns Task
   */
  createTask(name = "Unknown Task") {
    if (this.tasks.length == 0) {
      name = "Node";
    }
    if (this.tasks.length == 1) {
      name = "App";
    }

    const task = new Task(name, this.tasks.length);
    if (task.name == "Node") {
      task.begin = 0;
    }

    this.tasks[this.tasks.length] = task;

    return task;
  }

  /**
   * @name beginTask
   * @description Alias to createTask>Task.begin>return task
   *
   * @note Reccomendation: Use createTask instead
   * @note IMPORTANT: USE (RETURNED TASK).finish() WHEN DONE WITH TASK
   *
   * @param {String} name
   * @returns Task
   */
  beginTask(name = "Unknown Task") {
    const task = new Task(name);

    task.begin();

    return task;
  }

  /**
   * @name finish
   * @description Call this right before the application closes (after everything is finished | this will close the process)
   *
   * @argument {number} ecode The error code
   */
  finish(ecode) {
    this.tasks[0].finishWithError(new Error("bean"));
    this.tasks[1].finish();

    console.log("===== BENCHMARK FINISHED =====");
    this.tasks.forEach((task) => {
      console.log(
        `Task ${chalk.redBright.bold(task.name)} (${chalk.green(
          `#${task.id}`
        )}) ${chalk.blue.bold(
          `${
            task.timeTaken == -1
              ? "DNF"
              : `${
                  typeof task.timeTaken == typeof "string"
                    ? task.timeTaken
                    : `took ${task.timeTaken}s`
                }`
          }`
        )}`
      );
    });
    console.log("==============================");

    process.exit(ecode || 0);
  }
}

module.exports = BenchJS;
