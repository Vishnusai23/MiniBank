import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

import { Dashboard } from './dashboard/dashboard';
import { OpenAccountComponent } from './open-account/open-account';
import { ViewBalanceComponent } from './view-balance/view-balance';
import { ViewTransactions } from './view-transactions/view-transactions';
import { TransferComponent } from './transfer/transfer';
import { DepositComponent } from './deposit/deposit';

import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminApprovalComponent } from './admin-approval/admin-approval';
import { AdminUsersComponent } from './admin-users/admin-users';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts';
import { AdminAccountsComponents } from './admin-changestatus/admin-changestatus';
import { AdminTransactionsComponent } from './admin-transactions/admin-transactions';
import { OtpVerification } from './otp-verification/otp-verification';

// ✅ GUARDS
import { userAuthGuard } from './app/guards/user-auth-guard';
import { adminAuthGuard } from './app/guards/admin-auth-guard';

export const routes: Routes = [

  // 🌐 PUBLIC ROUTES
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // 👤 USER ROUTES (JWT REQUIRED)
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [userAuthGuard]
  },
  {
    path: 'open-account',
    component: OpenAccountComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'dashboard/view-balance',
    component: ViewBalanceComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'view-transactions',
    component: ViewTransactions,
    canActivate: [userAuthGuard]
  },
  {
    path: 'dashboard/transfer',
    component: TransferComponent,
    canActivate: [userAuthGuard]
  },
  {
    path: 'dashboard/deposit',
    component: DepositComponent,
    canActivate: [userAuthGuard]
  },

  // 🛡️ ADMIN ROUTES (ADMIN JWT REQUIRED)
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-approval',
    component: AdminApprovalComponent,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-users',
    component: AdminUsersComponent,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-accounts',
    component: AdminAccountsComponent,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-changestatus',
    component: AdminAccountsComponents,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin-viewtransactions',
    component: AdminTransactionsComponent,
    canActivate: [adminAuthGuard]
  },
  {
  path: 'verify-otp',
  component: OtpVerification
}

];
