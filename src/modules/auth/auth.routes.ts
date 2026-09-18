import { Router, type Request, type Response } from 'express';
import authController from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

router.get('/me', authenticate, (req: Request, res: Response) => {
  return authController.me(req, res);
});

router.post('/register', (req: Request, res: Response) => {
  return authController.register(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  return authController.login(req, res);
});

router.post('/logout', authenticate, (req: Request, res: Response) => {
  return authController.logout(req, res);
});

router.delete('/destroy', authenticate, (req: Request, res: Response) => {
  return authController.destroy(req, res);
});

export default router;
