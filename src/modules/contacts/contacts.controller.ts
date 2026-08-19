import type { Request, Response } from 'express';
import contactsService from './contacts.service';
import { createContactSchema, updateContactSchema } from './contacts.schemas';

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
      return res
        .status(400)
        .json({ success: false, message: 'Invalid contact ID' });
    }

    const contact = await this.contactService.get(contactId, TEMP_USER_ID);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }

    return res.status(200).json({ success: true, data: contact });
  }

  async create(req: Request, res: Response) {
    const validation = await createContactSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.issues,
      });
    }

    const contact = await this.contactService.create(
      validation.data,
      TEMP_USER_ID,
    );

    return res.status(201).json({ success: true, data: contact });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const contactId = Number(id);

    if (isNaN(contactId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid contact ID' });
    }

    const validation = await updateContactSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.issues,
      });
    }

    const contact = await this.contactService.update(
      contactId,
      validation.data,
      TEMP_USER_ID,
    );

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }

    return res.status(200).json({ success: true, data: contact });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const contactId = Number(id);

    if (isNaN(contactId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid contact ID' });
    }

    const result = await this.contactService.delete(contactId, TEMP_USER_ID);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found' });
    }

    return res.status(204).json({ success: true });
  }
}

export default new ContactController(contactsService);
