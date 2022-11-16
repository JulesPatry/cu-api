import { Application, Request, Response } from 'express';
import pkg from '../../package.json';

export default (d: any, app: Application) => {
  app.get('/', async (req: Request, res: Response) => {
    res.send({ name: pkg.name, version: pkg.version });
  });
};
