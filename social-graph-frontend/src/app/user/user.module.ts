import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRegisterComponent } from './user-register/user-register.component';



@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserLoginComponent,
    UserRegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    
  ]
})
export class UserModule { }
