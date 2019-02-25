import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  loading = false;
  private authStatusSub: Subscription ;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(suthStatus => {
        this.loading = false ;
      }) ;
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return ;
    }
    // console.log(form.value) ;
    this.loading = true ;
    this.authService.createUser(form.value.email, form.value.password) ;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe() ;
  }
}
