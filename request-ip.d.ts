declare module 'request-ip' {
    import { RequestHandler } from 'express';
    const requestIp: {
      mw: () => RequestHandler;
    };
    export = requestIp;
  }
  