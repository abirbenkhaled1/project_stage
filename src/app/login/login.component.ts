import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
//import   Swal from 'sweetalert2';
import { Location } from '@angular/common';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
//import { NotificationService } from 'src/app/services/notification.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
//variable for test validation robots
//declare var grecaptcha: any;

/***********************
 * 
 * @author Tarchoun Abir
 * 
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  protected f!: FormGroup;
  form: any = {
    username: '',
    password: '',
  };
  isLoggedIn = false;
  isLoginFailed = false;
  Message !: string;
  role !: string;
  username!: string;
  password!: string;
  fieldTextType!: boolean;
  userStatus!: string;
  showUserBoardadmin = true;
  data: any;

  constructor(
    private authService: AuthService,
    public router: Router,
    private tokenStorage: TokenStorageService,
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  // show password
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  //post login
  onSubmit(): void {
    const { username, password } = this.form;
 
    this.authService.login(username, password).subscribe(
      (data: any) => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        //====== redirect with role 
        if (data.role === 'user') {
          this.router.navigate(['/home']);
          return;
        }
        else if (data.role === 'admin') {
        this.router.navigate(['/home']);
          return;
        }
      },
      (err) => {

          //get error from backend : inactivate account || blocked account || username  not correct || password not correct
          if (err.error.message){
            console.log(err.error.message,"******************");
            /*this._snackBar.open(err.error.message, '', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-toolbar', 'mat-warn'],
            });*/
            return;
          }

        //  login failed  :  error connexion or error from the server 
        else if ((this.isLoginFailed = true)) {
          /*this._snackBar.open(' Error connexion ', '', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn'],
          });*/
        }
      }
    );
  }

 // logout : session destroy 
  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
  }


  //succes notification
  successNotification() {
   // Swal.fire('Welcome', + this.data.role + ' You Logged Successfully ', 'success');
  }


}