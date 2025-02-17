import { Router, Request, Response } from 'express';
import AppDataSource from '../data-source';

const healthRouter = Router();

healthRouter.get('/health', async (req: Request, res: Response) => {
  try {
    await AppDataSource.query('SELECT 1'); // ✅ Ping the database

    res.status(200).json({
      status: 'healthy',
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: (error as Error).message, // ✅ Explicitly cast `error`
    });
  }
});

export default healthRouter;
