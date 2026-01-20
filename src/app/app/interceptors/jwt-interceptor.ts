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

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  let token: string | null = null;

  // 🔐 ADMIN TOKEN (sessionStorage)
  const adminRole = sessionStorage.getItem('role');
  if (adminRole === 'ADMIN') {
    token = sessionStorage.getItem('adminToken');
  }

  // 👤 USER TOKEN (localStorage)
  const userRole = localStorage.getItem('role');
  if (userRole === 'USER') {
    token = localStorage.getItem('userToken');
  }

  // 🚀 Attach token if exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
