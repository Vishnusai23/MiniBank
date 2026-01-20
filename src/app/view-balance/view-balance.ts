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
  selector: 'app-view-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-balance.html',
  styleUrls: ['./view-balance.css']
})
export class ViewBalanceComponent implements OnInit {

  balanceData: any = null;
  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,   // ✅ ADDED
    private zone: NgZone              // ✅ ADDED
  ) {}

  ngOnInit(): void {
    this.loadBalance();
  }

  loadBalance() {
    const email = localStorage.getItem('loggedInUser');

    if (!email) {
      this.errorMessage = 'User not logged in';
      return;
    }

    // 🔥 RESET STATE
    this.loading = true;
    this.errorMessage = '';
    this.balanceData = null;

    const payload = { email };

    this.http
      .post<any>('http://localhost:8080/api/accounts/user', payload)
      .pipe(
        finalize(() => {
          // ✅ ALWAYS stop loading & refresh UI
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Balance response:', res);

          // 🔥 FORCE Angular to detect update
          this.zone.run(() => {
            this.balanceData = { ...res }; // new object reference
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage =
            err?.error?.message || 'Unable to fetch balance';
        }
      });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
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
