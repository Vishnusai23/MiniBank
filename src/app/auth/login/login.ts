// import { Component, ChangeDetectorRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, RouterModule, CommonModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class Login {

//   email = '';
//   password = '';
//   errorMessage = '';

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {}

//   login(): void {

//     this.errorMessage = '';

//     if (!this.email.trim() || !this.password.trim()) {
//       this.errorMessage = 'Email and password are required';
//       this.cdr.detectChanges();
//       return;
//     }

//     const payload = {
//       email: this.email.trim(),
//       password: this.password.trim()
//     };

//     this.http.post<string>(
//       'http://localhost:8080/api/users/login',
//       payload
//     ).subscribe({

//       // ✅ SUCCESS
//       next: (token: string) => {

//         // 🛡 ADMIN LOGIN
//         if (this.email === 'admin') {
//           sessionStorage.setItem('adminToken', token);
//           sessionStorage.setItem('role', 'ADMIN');
//           this.router.navigate(['/admin-dashboard']);
//           return;
//         }

//         // 👤 USER LOGIN
//         localStorage.setItem('userToken', token);
//         localStorage.setItem('role', 'USER');
//         localStorage.setItem('loggedInUser', this.email);
//         this.router.navigate(['/dashboard']);
//       },

//       // ❌ ERROR
//       error: (err: HttpErrorResponse) => {

//         console.error('LOGIN ERROR:', err);

//         if (err.error?.message) {
//           this.errorMessage = err.error.message;
//         } else {
//           this.errorMessage = 'Login failed';
//         }

//         // 🔥 Force UI update (fixes delay issue)
//         this.cdr.detectChanges();
//       }
//     });
//   }
// }

import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {

    this.errorMessage = '';

    // ✅ Validation
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Email and password are required';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    // ✅ BACKEND RETURNS: { token: "JWT" }
    this.http.post<{ token: string }>(
      'http://localhost:8080/api/users/login',
      payload
    ).subscribe({

      // ✅ SUCCESS
      next: (response) => {

        const token = response.token; // 🔑 FIXED

        // 🛡 ADMIN LOGIN
        if (this.email === 'admin') {
          sessionStorage.setItem('adminToken', token);
          sessionStorage.setItem('role', 'ADMIN');
          this.router.navigate(['/admin-dashboard']);
          return;
        }

        // 👤 USER LOGIN
        localStorage.setItem('userToken', token);
        localStorage.setItem('role', 'USER');
        localStorage.setItem('loggedInUser', this.email);

        this.router.navigate(['/dashboard']);
      },

      // ❌ ERROR
      error: (err: HttpErrorResponse) => {

        console.error('LOGIN ERROR:', err);

        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed';
        }

        this.cdr.detectChanges();
      }
    });
  }
}

