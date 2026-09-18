import type { Request, Response } from 'express';
import authService from './auth.service';
import { loginSchema, registerSchema } from './auth.schemas';
import type { AuthRequest } from './auth.types';

type AuthServiceType = typeof authService;

class AuthController {
  constructor(private authService: AuthServiceType) {}

  async me(req: AuthRequest, res: Response) {
    return res.status(200).json({ success: true, data: req.user });
  }

  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const { user, token } = await this.authService.register(data);

    return res.status(201).json({ success: true, data: { user, token } });
  }

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);

    const { user, token } = await this.authService.login(data);

    return res.status(200).json({ success: true, data: { user, token } });
  }

  async logout(req: AuthRequest, res: Response) {
    await this.authService.logout(req.user!.id);

    return res.status(200).json({ success: true });
  }

  async destroy(req: AuthRequest, res: Response) {
    await this.authService.deleteUser(req.user!.id);

    return res.status(204).send();
  }
}

export default new AuthController(authService);
