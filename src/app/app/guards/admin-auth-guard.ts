import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = sessionStorage.getItem('adminToken');
  const role = sessionStorage.getItem('role');

  if (token && role === 'ADMIN') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
