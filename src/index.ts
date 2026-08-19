import express from 'express';
import type { Request, Response } from 'express';
import contactRoutes from './modules/contacts/contacts.routes';

const app = express();

app.use(express.json());

app.use('/api/contacts', contactRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello from Express with TypeScript!');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
