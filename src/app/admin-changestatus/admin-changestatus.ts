import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-changestatus.html',
  styleUrls: ['./admin-changestatus.css']
})
export class AdminAccountsComponents implements OnInit {

  accounts: any[] = [];
  loading = false;
  errorMessage = '';

  // ✅ Available statuses
  statuses = ['ACTIVE', 'BLOCKED', 'CLOSED'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.errorMessage = '';
    this.accounts = [];

    this.http
      .get<any[]>('http://localhost:8080/api/admin/accounts')
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.accounts = [...(res || [])];
          });
        },
        error: () => {
          this.errorMessage = 'Failed to load accounts';
        }
      });
  }

  // 🔥 CHANGE ACCOUNT STATUS
  updateStatus(accountNumber: number, status: string) {

    const payload = {
      accountNumber,
      status
    };

    this.http
      .put(
        'http://localhost:8080/api/admin/accounts/status',
        payload
      )
      .subscribe({
        next: () => {
          alert('Account status updated');
          this.loadAccounts(); // 🔁 refresh list
        },
        error: () => {
          alert('Failed to update status');
        }
      });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
