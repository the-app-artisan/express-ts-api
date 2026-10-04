import 'dotenv/config';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { prisma } from '../src/lib/prisma';

const DEFAULT_USERS_COUNT = 2;
const DEFAULT_CONTACTS_PER_USER = 10;
const DEFAULT_PASSWORD = 'password123';

const USERS_COUNT = Number.parseInt(
  process.env.SEED_USERS_COUNT ?? `${DEFAULT_USERS_COUNT}`,
  10,
);
const CONTACTS_PER_USER = Number.parseInt(
  process.env.SEED_CONTACTS_PER_USER ?? `${DEFAULT_CONTACTS_PER_USER}`,
  10,
);

function createUsers(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet
        .email({ firstName, lastName, provider: `seed${index + 1}.local` })
        .toLowerCase(),
      password: DEFAULT_PASSWORD,
    };
  });
}

function createContacts(count: number) {
  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress({ useFullAddress: true }),
    };
  });
}

async function main() {
  if (!Number.isInteger(USERS_COUNT) || USERS_COUNT < 1) {
    throw new Error('SEED_USERS_COUNT must be a positive integer');
  }

  if (!Number.isInteger(CONTACTS_PER_USER) || CONTACTS_PER_USER < 1) {
    throw new Error('SEED_CONTACTS_PER_USER must be a positive integer');
  }

  const seedUsers = createUsers(USERS_COUNT);

  for (const seedUser of seedUsers) {
    const password = await bcrypt.hash(seedUser.password, 10);

    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: { name: seedUser.name, password },
      create: {
        name: seedUser.name,
        email: seedUser.email,
        password,
      },
    });

    await prisma.contact.deleteMany({ where: { userId: user.id } });

    await prisma.contact.createMany({
      data: createContacts(CONTACTS_PER_USER).map((contact) => ({
        ...contact,
        userId: user.id,
      })),
    });
  }

  console.log(
    `Seed completed with ${USERS_COUNT} generated users and ${CONTACTS_PER_USER} generated contacts per user.`,
  );
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
