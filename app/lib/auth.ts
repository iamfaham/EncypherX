import { compare } from 'bcrypt';
import prisma from './prisma';

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) return null;

  return { id: user.id, name: user.name, email: user.email };
}