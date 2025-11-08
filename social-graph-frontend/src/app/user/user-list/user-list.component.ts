import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users: Array<User> = [];
  selected: boolean = false;
  selectedUser!: User;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
      this.userService.validateToken().subscribe({
      next: (response) => {
        if (response.valid) {
          this.getUsers();
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  onSelected(user: User): void {
    this.selected = true;
    this.selectedUser = user;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

}
