import { prisma } from '../../lib/prisma';
import type {
  CreateContactInput,
  UpdateContactInput,
} from './contacts.schemas';

class ContactService {
  async list(userId: number) {
    return prisma.contact.findMany({
      where: { userId },
    });
  }

  async get(id: number, userId: number) {
    return prisma.contact.findFirst({
      where: { id, userId },
    });
  }

  async create(data: CreateContactInput, userId: number) {
    return prisma.contact.create({
      data: {
        ...data,
        phone: data.phone ?? null,
        address: data.address ?? null,
        userId,
      },
    });
  }

  async update(id: number, data: UpdateContactInput, userId: number) {
    // Remove undefined fields
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    const existingContact = await this.get(id, userId);

    if (!existingContact) {
      return null;
    }

    return prisma.contact.update({
      where: { id, userId },
      data: updateData,
    });
  }

  async delete(id: number, userId: number) {
    const existingContact = await this.get(id, userId);

    if (!existingContact) {
      return null;
    }

    return await prisma.contact.delete({
      where: { id, userId },
    });
  }
}

export default new ContactService();
