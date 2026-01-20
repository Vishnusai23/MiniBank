import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-transactions.html',
  styleUrls: ['./view-transactions.css']
})
export class ViewTransactions implements OnInit {

  transactions: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,   // ✅ SAME AS VIEW BALANCE
    private zone: NgZone              // ✅ SAME AS VIEW BALANCE
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      return;
    }

    // 🔥 RESET STATE (IMPORTANT)
    this.loading = true;
    this.errorMessage = '';
    this.transactions = [];

    const payload = { email };

    this.http
      .post<any[]>('http://localhost:8080/api/transactions/history', payload)
      .pipe(
        finalize(() => {
          // ✅ ALWAYS stop loader & refresh UI
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Transactions response:', res);

          // 🔥 FORCE Angular change detection
          this.zone.run(() => {
            this.transactions = Array.isArray(res) ? [...res] : [];
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage =
            err?.error?.message || 'Unable to load transactions';
        }
      });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
  goDashboard(): void {
  this.router.navigate(['/dashboard']);
}

logout(): void {
  localStorage.clear();     // clear session
  this.router.navigate(['/']);
}
}
