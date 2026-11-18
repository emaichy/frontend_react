import type { User } from '../types/user';

const teacherRoles = new Set([
  'admin',
  'administrador',
  'maestro',
  'maestra',
  'docente',
  'profesor',
  'profesora',
  'teacher',
  'instructor',
]);

export function isTeacherRole(user: Pick<User, 'rol_nombre'> | null | undefined): boolean {
  const role = user?.rol_nombre
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('es-MX');

  return role ? teacherRoles.has(role) : false;
}
