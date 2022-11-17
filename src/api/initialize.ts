import { Request, Response } from 'express';
import pkg from '../../package.json';

export default (d: any) => {
  d.app.get('/api', async (req: Request, res: Response) => {
    res.send({ name: pkg.name, version: pkg.version });
  });
};
