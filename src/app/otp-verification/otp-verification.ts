import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-verification.html',
  styleUrls: ['./otp-verification.css']
})
export class OtpVerification {

  email: string = '';
  otp: string = '';
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {
    // get email passed from register
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] || '';
  }

  verifyOtp() {
    this.http.post(
      'http://localhost:8080/api/users/verify-email',
      { email: this.email, otp: this.otp },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.message = 'Email verified successfully. Please login.';
        setTimeout(() => this.router.navigate(['/login']), 100);
      },
      error: err => {
        this.error = err?.error || 'OTP verification failed';
      }
    });
  }

  resendOtp() {
    this.http.post(
      `http://localhost:8080/api/users/resend-otp?email=${this.email}`,
      {},
      { responseType: 'text' }
    ).subscribe({
      next: res => this.message = res,
      error: err => this.error = err?.error || 'Failed to resend OTP'
    });
  }
  goToRegister() {
  this.router.navigate(['/register']);
}

}
