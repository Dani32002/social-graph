import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  _user!: User;
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly router: Router 
  ) { }

  ngOnInit(): void {
    this.userService.validateToken().subscribe({
      next: (response) => {
        if (response.valid) {
          this.userId = this.route.snapshot.paramMap.get('id')!
          if (this.userId) {
            this.getUser();
          }
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  addFriend(userId: string): void {
    this.userService.addFriend(userId).subscribe(() => {
      this.ngOnInit();
    });
    
  }

  removeFriend(userId: string): void {
    this.userService.removeFriend(userId).subscribe(() => {
      this.ngOnInit();
    });
    
  }

  notMe(): boolean {
    const ownId = localStorage.getItem('own_id')!;
    return this._user?.id !== ownId;
  }

  isFriend(): boolean {
    const ownId = localStorage.getItem('own_id')!;
    return this._user?.friends?.some((f) => f.id === ownId) || false;
  }

  getUser() {
    this.userService.getUserById(this.userId).subscribe((user) => {
      this._user = user;
      this.getFriends();
    });
  }

  getFriends(): void {
    this.userService.getFriends(this._user.id).subscribe((friends) => {
      this._user.friends = friends;
    });
  }
}
