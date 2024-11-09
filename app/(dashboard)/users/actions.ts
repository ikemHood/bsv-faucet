'use server';
import { fetchUser, prisma } from '@/lib/prisma';
import { Role } from '@/prisma/generated/client';
import { revalidatePath } from 'next/cache';

export const togglePauseUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw Error('User not found');
  }
  await prisma.user.update({ where: { id }, data: { paused: !user.paused } });
  revalidatePath('/users');
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({ where: { id } });
  revalidatePath('/users');
};

export async function changeUserRole(userId: string, newRole: Role) {
  try {
    const currentUser = await fetchUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can change user roles');
    }

    // Validate the new role
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }

    const updatedUser = await prisma.user.update({
      where: { userId: userId },
      data: { role: newRole },
    });

    // Revalidate the users page to reflect the changes
    revalidatePath('/users');

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error changing user role:', error);
    return { success: false, error: error };
  }
}