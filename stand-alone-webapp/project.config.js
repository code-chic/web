/*** ====== 外部应用项目配置文件 ====== ***/
module.exports = function(c) {
  c.use("appConf", config => {
    // console.log(config);
  });

  c.use("devConf", config => {
    // console.log(config);
  });
};
