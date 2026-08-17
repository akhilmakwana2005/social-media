import { cookies } from 'next/headers';
import { verifyJWT } from './auth';
import { prisma } from './db';

export async function getSession(req?: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload || !payload.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      workspaces: true,
      memberships: {
        include: {
          workspace: true
        }
      }
    }
  });

  return user;
}

export async function getActiveWorkspace(userId?: any) {
  const user = await getSession();
  if (!user || user.memberships.length === 0) return null;

  // For now, return the first workspace they are a member of
  return user.memberships[0].workspace;
}
