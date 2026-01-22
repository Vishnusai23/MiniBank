import { Component,ChangeDetectorRef,NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './open-account.html',
  styleUrls: ['./open-account.css']
})
export class OpenAccountComponent {

  fullName = '';
  dob = '';
  phoneNumber = '';

  identityType: 'AADHAAR' | 'PASSPORT' = 'AADHAAR';
  identityNumber = '';

  accountType = '';

  successMessage = '';
  errorMessage = '';

  dobError = false;
  isSubmitting = false;

  maxDob = '';
  minDob = '';

  constructor(
    private http: HttpClient,
    private router: Router, private cdr: ChangeDetectorRef,  private zone: NgZone
  ) {
    const today = new Date();

    const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const min = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

    this.maxDob = max.toISOString().split('T')[0];
    this.minDob = min.toISOString().split('T')[0];
  }

  // ✅ DOB validation (backend aligned)
  validateDob(): void {
    this.dobError = false;

    if (!this.dob) {
      this.dobError = true;
      return;
    }

    const dobDate = new Date(this.dob);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18 || age > 100) {
      this.dobError = true;
    }
  }

  submit(): void {

  if (this.isSubmitting) return;

  // 🔥 Immediately update UI
  this.zone.run(() => {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
  });
  this.cdr.detectChanges();

  if (this.dobError) {
    this.zone.run(() => {
      this.errorMessage = 'Invalid Date of Birth';
      this.isSubmitting = false;
    });
    this.cdr.detectChanges();
    return;
  }

  const email = localStorage.getItem('loggedInUser');

  if (!email) {
    this.zone.run(() => this.isSubmitting = false);
    this.router.navigate(['/login']);
    return;
  }

  const payload = {
    email,
    fullName: this.fullName.trim(),
    dob: this.dob,
    phoneNumber: this.phoneNumber.trim(),
    identityType: this.identityType,
    identityNumber: this.identityNumber.trim(),
    accountType: this.accountType
  };

  this.http.post(
    'http://localhost:8080/api/accounts/create',
    payload
  ).subscribe({
    next: () => {
      this.zone.run(() => {
        this.isSubmitting = false;
        this.successMessage = 'Account created successfully';
      });
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/dashboard']), 1000);
    },
    error: (err) => {
      this.zone.run(() => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Something went wrong';
      });
      this.cdr.detectChanges(); // 🔥 FORCE UI REFRESH
    }
  });
}

}
