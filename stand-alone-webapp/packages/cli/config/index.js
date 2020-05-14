const utils = require("../utils");

const config = (module.exports = {
  // 应用级别配置
  appConf: {
    // 应用模块所在目录
    pages: utils.resolveApp("src/page"),
    // 应用编译输出位置
    output: utils.resolveApp("dist"),
    // typescript配置文件位置
    tsConfig: utils.resolveApp("tsconfig.json")
  },
  // 开发级别配置
  devConf: {
    // 服务运行主机，默认：127.0.0.1
    host: "127.0.0.1",
    // 服务运行端口，默认：8080
    port: 8080,
    // 服务运行上下文环境（即：网站根路径）
    rootDir: utils.resolveApp("dist"),
    // 代理目标主机地址，默认为 null 即不开启代理模式
    proxyUrl: null,
    // 访问代理的主机的URL前缀
    proxyApiPrefix: "/api",
    // 代理配置文件
    setupProxy: utils.resolveCli("setupProxy.js"),
    // 压缩代码，生产环境默认开启压缩
    uglify: process.env.NODE_ENV === "production",
    // 开启热编译功能，开发环境默认开启
    watcher: process.env.NODE_ENV === "development",
    // 开启浏览器热重载，开发环境默认开启
    hot: process.env.NODE_ENV === "development",
    // 自动打开浏览器，并访问它
    open: false
  },
  // cli 配置项
  cliConf: Object.freeze({
    // gulp cli 文件位置
    execCli: utils.resolveCli("gulp-cli.js"),
    // 构建应用脚本位置
    buildScript: utils.resolveCli("scripts/build.js"),
    // 运行服务脚本位置
    serveScript: utils.resolveCli("scripts/serve.js"),
    // 创建模块脚本位置
    createScript: utils.resolveCli("scripts/create.js"),
    // 打包应用脚本位置
    archiveScript: utils.resolveCli("scripts/archive.js")
  })
});

class Configure {
  use(name, cb) {
    if (config[name]) {
      cb(config[name]);
    } else {
      cb(null);
    }
  }
}

const appConfig = utils.resolveApp("project.config.js");
if (utils.hasFile(appConfig)) {
  require(appConfig)(new Configure());
}
