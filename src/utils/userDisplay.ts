import type { User } from '../types/user';

type UserIdentity = Pick<
  User,
  'nombre' | 'apellido' | 'apellido_paterno' | 'apellido_materno' | 'email'
> | null | undefined;

export function getUserDisplayName(user: UserIdentity): string {
  const surname = user?.apellido_paterno !== undefined
    ? [user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' ')
    : user?.apellido;
  const fullName = [user?.nombre?.trim(), surname?.trim()]
    .filter(Boolean)
    .join(' ');

  if (fullName) return fullName;
  return user?.email?.split('@')[0] || 'Usuario';
}

export function getUserFirstName(user: UserIdentity): string {
  return user?.nombre?.trim().split(/\s+/)[0] || getUserDisplayName(user);
}
