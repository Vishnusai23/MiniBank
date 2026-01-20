// import { HttpInterceptorFn } from '@angular/common/http';

// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

//   let token: string | null = null;

//   // 👤 USER FIRST
//   if (localStorage.getItem('role') === 'USER') {
//     token = localStorage.getItem('userToken');
//   }

//   // 🛡 ADMIN (ONLY IF USER NOT PRESENT)
//   if (!token && sessionStorage.getItem('role') === 'ADMIN') {
//     token = sessionStorage.getItem('adminToken');
//   }

//   if (token) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next(req);
// };

import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  let token: string | null = null;

  const role =
    localStorage.getItem('role') ||
    sessionStorage.getItem('role');

  if (role === 'USER') {
    token = localStorage.getItem('userToken');
  }

  if (role === 'ADMIN') {
    token = sessionStorage.getItem('adminToken');
  }

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError(err => {
      // 🚨 DO NOT transform the error
      return throwError(() => err);
    })
  );
};
