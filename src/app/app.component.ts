import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthService) {}
  title = 'meanAngular';
  /*Storedposts: Post[] = [] ;
  onAddPost(post) {
    this.Storedposts.push(post) ;
  }*/
  ngOnInit(): void {
    this.authService.autoAuthUser() ;
  }
}
