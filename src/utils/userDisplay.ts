import type { User } from '../types/user';

type UserIdentity = Pick<User, 'nombre' | 'apellido' | 'email'> | null | undefined;

export function getUserDisplayName(user: UserIdentity): string {
  const fullName = [user?.nombre?.trim(), user?.apellido?.trim()]
    .filter(Boolean)
    .join(' ');

  if (fullName) return fullName;
  return user?.email?.split('@')[0] || 'Usuario';
}

export function getUserFirstName(user: UserIdentity): string {
  return user?.nombre?.trim().split(/\s+/)[0] || getUserDisplayName(user);
}
