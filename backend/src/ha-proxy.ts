import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import type { Request, Response, NextFunction } from 'express';

// Taken with GREAT GRATITUDE from
// https://github.com/jens-maus/RaspberryMatic/blob/e7c5bf51ae973861a5ecf4fe26619b6d33ac86d5/buildroot-external/overlay/base-raspmatic_oci/bin/ha-proxy.js

const apiProxy = createProxyMiddleware('/', {
  target: 'http://127.0.0.1:3000',
  changeOrigin: true, // for vhosted sites,
  //logLevel: 'debug',
  selfHandleResponse: true,
  onProxyRes(proxyRes, req: Request, res: Response) {
    //console.log(proxyRes.statusCode);
    //console.log("response-headers:");
    //console.log(proxyRes.headers);
    //console.log("request-headers:");
    //console.log(req.headers);

    // modify Location: response header
    if (typeof proxyRes.headers.location !== 'undefined') {
      let redirect = proxyRes.headers.location;
      redirect = req.headers['x-ingress-path'] + redirect;
      proxyRes.headers.location = redirect;
    }

    const bodyChunks = [];
    proxyRes.on('data', (chunk) => {
      bodyChunks.push(chunk);
    });
    proxyRes.on('end', () => {
      const body = Buffer.concat(bodyChunks);

      // forwarding source status
      res.status(proxyRes.statusCode);

      // forwarding source headers
      Object.keys(proxyRes.headers).forEach((key) => {
        res.append(key, proxyRes.headers[key]);
      });

      // modifying textual response bodies
      if (
        proxyRes.headers['content-type'] &&
        (proxyRes.headers['content-type'].includes('text/') ||
          proxyRes.headers['content-type'].includes('application/javascript') ||
          proxyRes.headers['content-type'].includes('application/json'))
      ) {
        // if this a textual response body we make sure to prepend the ingress path
        let bodyString = body.toString('utf-8');
        bodyString = bodyString.replace(
          /(?<=["'= \\])\/(api|static)(\\?\/)/g,
          req.headers['x-ingress-path'] + '/$1$2',
        );
        bodyString = bodyString.replace(
          // fix react load
          `return"static/js/"`,
          `return"${req.headers['x-ingress-path']}/static/js/"`,
        );

        if (proxyRes.headers['transfer-encoding'] == 'chunked') {
          res.end(Buffer.from(bodyString));
        } else {
          res.send(Buffer.from(bodyString));
          res.end();
        }
      } else {
        res.end(body);
      }
    });
  },
});

export default () => {
  const app = express();
  app.use((req: Request, res: Response, next: NextFunction) => {
    next();
  }, apiProxy);
  app.listen(6000);
};
