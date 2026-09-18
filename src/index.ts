import express from 'express';
import type { Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';
import contactRoutes from './modules/contacts/contacts.routes';
import { errorHandler } from './shared/middleware/error-handler';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/contacts', contactRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello from Express with TypeScript!');
});

app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
