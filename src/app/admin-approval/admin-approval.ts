import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-approval.html',
  styleUrls: ['./admin-approval.css']
})
export class AdminApprovalComponent implements OnInit {

  pendingAccounts: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,   // ✅ ADDED
    private zone: NgZone              // ✅ ADDED
  ) {}

  ngOnInit(): void {
    this.loadPendingAccounts();
  }

  loadPendingAccounts() {
    // 🔥 RESET STATE
    this.loading = true;
    this.errorMessage = '';
    this.pendingAccounts = [];

    this.http.get<any[]>(
      'http://localhost:8080/api/admin/accounts/pending'
    )
    .pipe(
      finalize(() => {
        // ✅ ALWAYS stop loading + force UI refresh
        this.loading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (res) => {
        console.log('Pending accounts:', res);

        // 🔥 FORCE Angular to notice change
        this.zone.run(() => {
          this.pendingAccounts = [...(res || [])];
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load pending accounts';
      }
    });
  }

  approve(accountNumber: number) {
    if (!confirm('Approve this account?')) return;

    const payload = {
      accountNumber,
      status: 'ACTIVE'
    };

    this.http.put(
      'http://localhost:8080/api/admin/accounts/status',
      payload
    ).subscribe(() => {
      alert('Account approved successfully');
      this.loadPendingAccounts(); // 🔁 reload
    });
  }

  reject(accountNumber: number) {
    if (!confirm('Reject this account?')) return;

    const payload = {
      accountNumber,
      status: 'REJECTED'
    };

    this.http.put(
      'http://localhost:8080/api/admin/accounts/status',
      payload
    ).subscribe(() => {
      alert('Account rejected');
      this.loadPendingAccounts(); // 🔁 reload
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
