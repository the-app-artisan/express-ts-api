import { prisma } from '../../lib/prisma';
import type {
  ContactsPaginationInput,
  CreateContactInput,
  UpdateContactInput,
} from './contacts.schemas';

class ContactService {
  async list(userId: number, pagination: ContactsPaginationInput) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
      prisma.contact.findMany({
        where: { userId },
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({
        where: { userId },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
