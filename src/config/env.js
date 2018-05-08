const env = {
  current: "prod",
  dev: {
    //nginx代理地址
    url: "http://47.100.5.52:3010",
    staticUrl: "http://47.100.5.52:3008"
  },
  test: {
    //nginx代理地址
    url: "http://47.100.113.221:3010",
    staticUrl: "http://47.100.113.221:3008"
  },
  prod: {
    //nginx代理地址
    url: "https://app.yingbeijf.com",
    staticUrl: "https://hybrid.yingbeijf.com"
  }
};

export default env;
