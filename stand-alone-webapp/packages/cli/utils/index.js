const path = require("path");
const fs = require("fs");

// 执行脚本所在的路径
const appRoot = process.cwd();

// cli 项目路径
const cliRoot = path.resolve(__dirname, "..");

// 应用项目根路径
exports.resolveApp = relativePath => {
  return path.join(appRoot, relativePath);
};

// CLI项目根路径
exports.resolveCli = relativePath => {
  return path.join(cliRoot, relativePath);
};

// 检查文件是否存在
exports.hasFile = file => {
  return fs.existsSync(file) && fs.statSync(file).isFile();
};

// 检查目录是否存在
exports.hasDir = dir => {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
};

// 匹配命令行参数
exports.matchCmdArgs = (args, opts) => {
  return args.reduce((t, name) => {
    if (opts[name] !== null && opts[name] !== undefined) {
      t.push(`--${name}=${opts[name]}`);
    }
    return t;
  }, []);
};

// [深度创建目录]
const pathExpr = /[\\|\/]/g;
exports.deepCreateDirectory = (dir, cb) => {
  const dirs = dir.replace(appRoot, "").split(pathExpr);
  dirs.reduce((s, dir) => {
    if (!!dir) {
      const fullPath = this.resolveApp(s += "/" + dir);
      if (!this.hasDir(fullPath)) {
        fs.mkdirSync(fullPath)
      }
    }
    return s;
  }, "");
  cb(null);
};
