import type { Request, Response } from 'express';
import contactsService from './contacts.service';
import { createContactSchema, updateContactSchema } from './contacts.schemas';
import {
  BadRequestError,
  NotFoundError,
} from '../../shared/errors/custom-errors';

type ContactServiceType = typeof contactsService;

// Until auth is implemented
const TEMP_USER_ID = 1;

class ContactController {
  constructor(private contactService: ContactServiceType) {}

  async list(req: Request, res: Response) {
    const contacts = await this.contactService.list(TEMP_USER_ID);

    return res.status(200).json({ success: true, data: contacts });
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;

    const contactId = Number(id);

    if (isNaN(contactId)) {
      throw new BadRequestError('Invalid contact ID');
    }

    const contact = await this.contactService.get(contactId, TEMP_USER_ID);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    return res.status(200).json({ success: true, data: contact });
  }

  async create(req: Request, res: Response) {
    const data = await createContactSchema.parse(req.body);

    const contact = await this.contactService.create(data, TEMP_USER_ID);

    return res.status(201).json({ success: true, data: contact });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const contactId = Number(id);

    if (isNaN(contactId)) {
      throw new BadRequestError('Invalid contact ID');
    }

    const data = await updateContactSchema.parse(req.body);

    const contact = await this.contactService.update(
      contactId,
      data,
      TEMP_USER_ID,
    );

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    return res.status(200).json({ success: true, data: contact });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const contactId = Number(id);

    if (isNaN(contactId)) {
      throw new BadRequestError('Invalid contact ID');
    }

    const result = await this.contactService.delete(contactId, TEMP_USER_ID);

    if (!result) {
      throw new NotFoundError('Contact not found');
    }

    return res.status(204).json({ success: true });
  }
}

export default new ContactController(contactsService);
