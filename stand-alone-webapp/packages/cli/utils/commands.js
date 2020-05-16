const chalk = require("chalk");
const Command = require("commander").Command;

// = 创建模块指令
const create = exports.create = new Command("create");
create.description("创建模块");
create.option("-t, --template <template>", "模板", "default");
create.option("-o, --output <output>", "模块创建位置");
create.arguments("<module>");

// = 构建应用指令
const build = exports.build = new Command("build");
build.description("构建生产应用");
build.option("-u, --uglify", "压缩代码");
build.option("-w, --watcher", "开启热编译");

// = 运行服务指令
const serve = exports.serve = new Command("serve");
serve.description("运行服务");
serve.option("-h, --host <host>", "服务运行主机地址");
serve.option("-p, --port <port>", "服务运行端口");
serve.option("-u, --uglify", "压缩代码");
serve.option("-o, --open", "自动打开浏览器", false);
serve.option("-w, --watcher", "开启热编译");
serve.option("--hot", "开启热重载");
serve.option("--proxy-url <proxyUrl>", "指定代理地址");

const commands = [create, build, serve];
commands.forEach(c => {
  c.helpOption("-H, --help", "显示帮助信息");
  c.action(() => {}); /* noop */
});

