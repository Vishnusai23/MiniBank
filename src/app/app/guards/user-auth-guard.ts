import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const userAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('role');

  // ✅ ONLY CHECK USER DATA
  if (token && role === 'USER') {
    return true;
  }

  // ❌ BLOCK
  router.navigate(['/login']);
  return false;
};
