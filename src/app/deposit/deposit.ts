import {
  Component,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.html',
  styleUrls: ['./deposit.css']
})
export class DepositComponent {

  amount!: number;
  method = '';

  upiId = '';
  cardNumber = '';
  expiry = '';
  cvv = '';

  expiryError = false;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onMethodChange() {
    this.upiId = '';
    this.cardNumber = '';
    this.expiry = '';
    this.cvv = '';
    this.expiryError = false;
  }

  allowNumbersOnly(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, '');

    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    event.target.value = value;
    this.expiry = value;
  }

  validateExpiry() {
    this.expiryError = false;

    if (!this.expiry || !this.expiry.includes('/')) {
      this.expiryError = true;
      return;
    }

    const [mm, yy] = this.expiry.split('/');
    const month = Number(mm);
    const year = Number('20' + yy);

    if (month < 1 || month > 12) {
      this.expiryError = true;
      return;
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (year < currentYear ||
        (year === currentYear && month < currentMonth)) {
      this.expiryError = true;
    }
  }

  deposit(form: any) {
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      return;
    }


    if (this.method === 'DEBIT_CARD' && this.expiryError) {
      this.errorMessage = 'Please correct card expiry date';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: any = {
      amount: this.amount,
      method: this.method
    };

    if (this.method === 'UPI') {
      payload.upiId = this.upiId;
    }

    if (this.method === 'DEBIT_CARD') {
      payload.cardNumber = this.cardNumber;
      payload.expiry = this.expiry;
      payload.cvv = this.cvv;
    }

    this.http.post<any>(
      'http://localhost:8080/api/transactions/deposit',
      payload,
      {
        headers: { 'X-USER-EMAIL': email }
      }
    )
    .pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.successMessage = res?.message || 'Deposit successful';
          form.resetForm();
          this.expiryError = false;
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.errorMessage = err?.error?.message || 'Deposit failed';
        });
      }
    });
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
        localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    localStorage.removeItem('loggedInUser');

    this.router.navigate(['/']);
  }
}
