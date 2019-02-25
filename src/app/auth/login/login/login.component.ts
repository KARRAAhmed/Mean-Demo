import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy {

loading = false ;
private authStatusSub: Subscription ;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(suthStatus => {
      this.loading = false ;
    }) ;
  }
  onLogin(form: NgForm) {
    // console.log(form.value) ;
    if (form.invalid) {
      return ;
    }
    this.loading = true ;
    this.authService.login(form.value.email, form.value.password) ;
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe() ;
  }
}
