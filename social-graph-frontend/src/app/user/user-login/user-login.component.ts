import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'] // ensure plural
})
export class UserLoginComponent {
  
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  

  submitting = false;
  error?: string;

  // return a relaxed type so the template can use f.email without TS4111 errors
  get f(): any {
    return this.loginForm.controls as any;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.error = undefined;
    this.submitting = true;

    const { email, password } = this.loginForm.value;
    this.userService.login(email!, password!).subscribe({
      next: (response) => {
        localStorage.setItem('own_id', response.userId);
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
        this.submitting = false;
      }
    });
  }
}