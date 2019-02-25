import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

private  authListenerSubs: Subscription ;
isAuthenticated = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getAuthenticated() ;
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>
      this.isAuthenticated = isAuthenticated);

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe() ;
  }
  onlogout() {
    this.authService.logout() ;
  }
}
