import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-setup.html',
  styleUrl: './admin-setup.css'
})
export class AdminSetup implements OnInit {
  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminAuthService.setupStatus().subscribe({
      next: (response) => {
        if (!response.setupRequired) {
          this.router.navigate(['/admin-login']);
        }
      },
      error: () => {
        this.errorMessage = 'Unable to create admin account.';
      }
    });
  }

  createAdmin(): void {
    this.errorMessage = '';

    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    this.loading = true;

    this.adminAuthService.setup({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to create admin account.';
      }
    });
  }
}