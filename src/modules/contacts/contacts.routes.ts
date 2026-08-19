import { Router, type Request, type Response } from 'express';
import contactsController from './contacts.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return contactsController.list(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  return contactsController.get(req, res);
});

router.post('/', (req: Request, res: Response) => {
  return contactsController.create(req, res);
});

router.patch('/:id', (req: Request, res: Response) => {
  return contactsController.update(req, res);
});

router.delete('/:id', (req: Request, res: Response) => {
  return contactsController.delete(req, res);
});

export default router;
