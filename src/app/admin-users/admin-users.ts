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
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,   // ✅ ADDED
    private zone: NgZone              // ✅ ADDED
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    // 🔥 RESET STATE
    this.loading = true;
    this.errorMessage = '';
    this.users = [];

    this.http
      .get<any[]>('http://localhost:8080/api/admin/users')
      .pipe(
        finalize(() => {
          // ✅ ALWAYS stop loading & refresh UI
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Users response:', res);

          // 🔥 FORCE Angular to detect changes
          this.zone.run(() => {
            this.users = [...(res || [])];
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load users';
        }
      });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
