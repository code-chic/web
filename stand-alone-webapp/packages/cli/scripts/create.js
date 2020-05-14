"use strict";

const path = require("path");
const chalk = require("chalk");
const argv = require("minimist")(process.argv.slice(2));
const config = require("../config");
const utils = require("../utils");
const MODULE_NAME = argv._[0];
const TEMPLATE_DIRECTORY = utils.resolveCli("template");
const MODULE_OUTPUT_DIRECTORY = utils.resolveApp(argv.output = argv.output || "src/pages");

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

  utils.deepCreateDirectory(moduleFullPath, () => {
    console.log("模块创建完成！位置：" + moduleFullPath)
  });
})(
  MODULE_OUTPUT_DIRECTORY,
  conversionNamed(MODULE_NAME),
  "default"
);
