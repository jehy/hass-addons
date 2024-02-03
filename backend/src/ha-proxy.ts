import * as express from 'express';
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware';

import type { Request, Response, NextFunction } from 'express';

// Taken with GREAT GRATITUDE from
// https://github.com/jens-maus/RaspberryMatic/blob/e7c5bf51ae973861a5ecf4fe26619b6d33ac86d5/buildroot-external/overlay/base-raspmatic_oci/bin/ha-proxy.js

const apiProxy = createProxyMiddleware('/', {
  target: 'http://127.0.0.1:3000',
  changeOrigin: true, // for vhosted sites,
  //logLevel: 'debug',
  selfHandleResponse: true,
  timeout: 1200000, // max 20 min
  onProxyRes: responseInterceptor(async (responseBody, proxyRes, req, res) => {
    // modify Location: response header if present
    const ingress = req.headers['x-ingress-path'] || '';
    if (typeof proxyRes.headers.location !== 'undefined') {
      // replace any absolute http/https path with a relative one
      let redirect: string = proxyRes.headers.location.replace(
        /(http|https):\/\/(.*?)\//,
        '/',
      );
      redirect = ingress + redirect;
      res.setHeader('location', redirect);
    }

    // modifying textual response bodies
    if (
      proxyRes.headers['content-type'] &&
      proxyRes.headers['content-type'].includes('text/') // ||
      //proxyRes.headers['content-type'].includes('application/javascript') ||
      //proxyRes.headers['content-type'].includes('application/json')
    ) {
      let body = responseBody.toString('utf8');

      body = body.replace(
        /(?<=["'= \(\\]|\\u0027)\/(api|static)(\\?\/)(?!hassio_ingress)/g,
        ingress + '/$1$2',
      );
      body = body.replace(
        // fix react load
        `return"static/js/"`,
        `return"${ingress}/static/js/"`,
      );
      body = body.replace(
        'href="/manifest.json"/',
        `href="/${ingress}/manifest.json"/`,
      );

      return Buffer.from(body, 'utf8');
    } else {
      return responseBody;
    }
  }),
});

export default () => {
  const app = express();
  app.use((req: Request, res: Response, next: NextFunction) => {
    next();
  }, apiProxy);
  app.listen(6060);
};
