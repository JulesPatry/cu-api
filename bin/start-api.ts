if (process.env.NODE_ENV === 'local') {
  require('dotenv').config();
}

require('module-alias/register');
require('express-async-errors');
require('dns');
require('dnscache')({
  enable: true,
  ttl: 60,
  cachesize: 1000,
});
import http from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import packageJson from '../package.json';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createTerminus } from '@godaddy/terminus';
import compression from 'compression';
import helmet from 'helmet';
import _get from 'lodash/get';
import { HTTP_HOST, HTTP_PORT, FP_ENVIRONMENT } from 'src/config';
import { Server } from 'socket.io';

// Initialize routes
import initAPI from 'src/api/initialize';
import initReads from 'src/reads/initialize';

const defaultOrigin = ['http://localhost:3000', 'https://dev.finishprobation.com', 'https://finishprobation.com'];
const productionOrigin = ['https://finishprobation.com'];

async function main() {
  const app = express() as Application;
  const server = http.createServer(app);

  server.listen(HTTP_PORT, () => {
    const msg = `v${packageJson.version} Server running in "${FP_ENVIRONMENT}" at: http://${HTTP_HOST}:${HTTP_PORT}`;
    console.log(msg);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: any) => {
    socket.on('event', (data: any) => {
      console.log('data', data);
    });
    socket.on('disconnect', (data: any) => {
      console.log('disconnect', data);
    });
  });

  /**
   * Before handlers
   */
  app.use(helmet());
  app.use(compression());
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());

  const origin = FP_ENVIRONMENT === 'ue2-prod' ? productionOrigin : defaultOrigin;

  const corsOptions = {
    origin,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  /**
   * Handler Dependencies
   */
  const handlerDependencies = {
    io,
    app,
  } as any;

  /**
   * Create handlers and initialize routes
   */
  initAPI(handlerDependencies);
  // initReads(handlerDependencies);

  /**
   * Post Handlers
   */

  app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if (err.name === 'UnauthorizedError') {
      // logger.info(`UnauthorizedError: ${_get(err, 'error', err).toString()}`);
      res.clearCookie('_fp-token');
      return res.status(err.status).send({ message: 'Unauthorized, please sign in to gain access.' });
    } else if (err && err.error && err.error.isJoi) {
      const errorMessage = `JoiError(${err.type}): ${_get(err, 'error', '').toString()}`;
      // slackMessage({ channel: CHANNELS.errors, message: errorMessage, logger, alert: true });

      return res.status(400).json({
        type: err.type, // Can be "headers", "body", or "params"
        message: err.error.toString(),
      });
    }

    // slackMessage({ channel: CHANNELS.errors, message: err.stack, logger, alert: true });
    res.status(500).send(err.stack);
  });

  /**
   * 👂🏻👂🏻👂🏻 Listen 👂🏻👂🏻👂🏻
   */

  async function onSignal() {
    // logger.info(`server is starting cleanup`);
    // start cleanup of resource, like databases or file descriptors
  }

  async function onHealthCheck() {
    // checks if the system is healthy, like the db connection is live
    // resolves, if health, rejects if not
  }

  createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/health': onHealthCheck },
    onSignal,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
