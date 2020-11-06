const proxy = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api/recog',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    '/api',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
      // ws: true,
    })
  );
  app.use(
    '/api-test',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
      // ws: true,
    })
  );
  app.use(
    '/confirm',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    '/version',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    '/healthCheck',
    proxy({
      target: process.env.REACT_APP_EVENTOS_PROXY,
      changeOrigin: true,
      secure: false,
    })
  );
};
