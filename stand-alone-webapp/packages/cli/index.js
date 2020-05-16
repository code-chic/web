"use strict";
const chalk = require("chalk");
const sync = require("cross-spawn").sync;
const program = require("commander").program;
const utils = require("./utils");
const command = require("./utils/commands");
const cliConf = require("./config").cliConf;
const { name: appName, version: appVersion } = require("./package.json");

const root = process.cwd();
const GULP_CLI = cliConf.execCli;
const CREATE_CLI = cliConf.createScript;
const ARCHIVE_CLI = cliConf.archiveScript;
const CREATE_ARGS = [CREATE_CLI, "--cwd=" + root];
const ARCHIVE_ARGS = [ARCHIVE_CLI, "--cwd=" + root];
const GULP_SERVE_ARGS = [GULP_CLI, "--gulpfile=" + cliConf.serveScript, "--cwd=" + root];
const GULP_BUILD_ARGS = [GULP_CLI, "--gulpfile=" + cliConf.buildScript, "--cwd=" + root];

const runScript = (command, rawArgs = []) => {
  const result = sync(command, rawArgs, { stdio: "inherit" });
  if (result.signal) {
    console.error(chalk.red("程序异常退出，原因：" + result.signal));
    process.exit(1);
  }
  process.exit(result.status);
};

// 添加命令到指令集
Reflect.ownKeys(command).forEach(c => {
  program.addCommand(command[c]);
});

command.create.action((module, opts) => {
  const cmdArgs = utils.matchCmdArgs(["output", "template"], opts);
  const rawArgs = CREATE_ARGS.concat(module, cmdArgs);
  runScript("node", rawArgs);
});

command.serve.action(opts => {
  const cmdArgs = utils.matchCmdArgs(
    ["host", "port", "uglify", "open", "watcher", "hot", "proxyUrl"], opts);
  const rawArgs = GULP_SERVE_ARGS.concat(cmdArgs);
  runScript("node", rawArgs);
});

program.usage(appName);
program.version(`v${appVersion}`, "-V, --version", "显示版本号");
program.helpOption("-H, --h", "显示帮助信息");
program.parse(process.argv);


