"use strict";

const sync = require("cross-spawn").sync;
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const argv = require("minimist")(process.argv.slice(2));
const utils = require("../utils");
const MODULE_NAME = argv._[0];
const TEMPLATE_DIRECTORY = utils.resolveCli("template");
const MODULE_OUTPUT_DIRECTORY = utils.resolveApp(argv.output = argv.output || "src/pages");
const TEMPLATE_STYLE = argv.template = argv.template || "default";

// 检查模块名称
function checkNamed(name) {
  if (/\p{Unified_Ideograph}/gu.test(name)) {
    throw Error("模块名不能包含中文字符！");
  } else if (/^([0-9])/.test(name)) {
    throw Error("模块名不能以数字开头！");
  }
}

// 转换模块名称 示例：hello-world or hello_world => HelloWorld
function conversionNamed(name) {
  if (name === null || name === undefined) {
    return name;
  } else {
    const names = (name + "").split(/[-_\s+]/g);
    return names.reduce((s, n) => {
      return (s += n.slice(0, 1).toUpperCase() + n.slice(1));
    }, "");
  }
}

checkNamed(MODULE_NAME);

((location, module, tpl) => {
  const template = path.join(TEMPLATE_DIRECTORY, tpl);
  const moduleFullPath = path.join(location, module);
  if (!utils.hasDir(template)) {
    throw Error("模板不存在！\n\r位置：" + template);
  } else if (utils.hasDir(moduleFullPath)) {
    throw Error("模块已存在！\n\r位置：" + moduleFullPath);
  }

  const name = module.slice(0, 1).toLowerCase() + module.slice(1);
  utils.deepCreateDirectory(moduleFullPath, () => {
    const files = fs.readdirSync(template); // 读取模板文件
    let result = null;
    files.forEach(file => {
      const fullFilePath = path.join(template, file);
      const extname = path.extname(file);
      const filename = path.join(moduleFullPath, name + extname);
      if (utils.hasFile(fullFilePath)) {
        let content = fs.readFileSync(fullFilePath).toString();
        content = content.replace(/__MODULE_NAME__/gi, name);
        fs.writeFileSync(filename, content);
        console.log(chalk.blue("创建文件！位置：" + filename));
        result = sync("git", ["add", filename], { stdio: "inherit" });
        if (result.signal) {
          console.error("异常退出！");
          process.exit(1);
        }
        console.log(chalk.green("添加到版本控制！位置：" + filename));
      }
    });
    process.exit(result.status);
  });
})(
  MODULE_OUTPUT_DIRECTORY,
  conversionNamed(MODULE_NAME),
  TEMPLATE_STYLE
);
