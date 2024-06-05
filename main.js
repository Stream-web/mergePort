const http = require('http');
const httpProxy = require('http-proxy');

// 定义三个项目的端口
const PORT_1 = 8001;
const PORT_2 = 8002;
const PORT_3 = 8003;

// 定义代理服务器的端口
const PROXY_PORT = 8080;

// 创建一个代理服务器实例
const proxy = httpProxy.createProxyServer();

// 定义项目到端口的映射
const PROJECT_MAP = {
  '/project1': PORT_1,
  '/project2': PORT_2,
  '/project3': PORT_3,
};

// 创建一个 HTTP 服务器
const server = http.createServer((req, res) => {
  // 获取目标项目路径
  const path = req.url;

  // 查找目标项目端口
  const targetPort = PROJECT_MAP[path];

  // 如果找到目标端口
  if (targetPort) {
    // 将请求转发到目标项目
    proxy.web(req, res, { target: `http://localhost:${targetPort}` });
  } else {
    // 如果找不到目标端口，发送错误响应
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// 监听代理服务器端口
server.listen(PROXY_PORT, () => {
  console.log(`代理服务器正在监听端口 ${PROXY_PORT}`);
});

// 处理代理错误
proxy.on('error', (err) => {
  console.error('代理错误：', err);
});
