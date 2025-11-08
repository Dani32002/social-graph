import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-register',
  standalone: false,
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  registerForm: FormGroup;
  submitting = false;
  error?: string;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      bio: [''],
      avatarUrl: ['']
    });
  }

  get f(): any {
    return this.registerForm.controls as any;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.submitting = true;
    this.error = undefined;

    const payload = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      bio: this.f['bio'].value,
      role: 'user',
      avatarUrl: this.f['avatarUrl'].value
    };

    this.userService.register(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.userService.login(this.f['email'].value, this.f['password'].value).subscribe({
          next: (response) => {
            localStorage.setItem('own_id', response.userId);
            localStorage.setItem('auth_token', response.token);
            this.router.navigate(['/users']);
          },
          error: err => {
            this.submitting = false;
            this.error = err?.error?.message || 'Login failed';
          }
        });
      },
      error: err => {
        this.submitting = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}