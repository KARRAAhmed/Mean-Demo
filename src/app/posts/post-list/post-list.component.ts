import { Component, OnInit , Input, OnDestroy } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import {Subscription} from 'rxjs' ;
import {PageEvent} from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [{title: 'First Post', content: 'This is nthe first Post'},
  // {title: 'First Post', content: 'This is nthe first Post'},
 // {title: 'First Post', content: 'This is nthe first Post'}];
@Input () posts: Post [] = [] ;

loading = false ;
totalPosts = 0 ;
postPerPage = 2 ;
currentPage = 1 ;
pageSizeOptions = [1, 2, 5, 10];
  constructor(private PostsService: PostService , private authService: AuthService) { }
private postSub = new Subscription;

private  authListenerSubs: Subscription ;
isAuthenticated = false;
userId: string ;
  ngOnInit() {
    // this.posts = this.PostsService.getPosts() ;
    this.loading = true ;
    this.PostsService.getPosts(this.postPerPage, this.currentPage) ;
    this.userId = this.authService.getUserId() ;
    this.postSub = this.PostsService.getPostUpdatedList()
    .subscribe((postData: {posts: Post [] , postCount: number}) => {
      this.loading = false ;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount ; }
    ) ;
    this.isAuthenticated = this.authService.getAuthenticated() ;
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => { this.isAuthenticated = isAuthenticated ;
      this.userId = this.authService.getUserId(); });
  }
  onDelete(postId: string) {
    this.loading = true ;
    this.PostsService.deletePost(postId).subscribe(() => {
      this.PostsService.getPosts(this.postPerPage, this.currentPage) ;
    }, () => { this.loading = false ; }) ;

  }

  ngOnDestroy(): void {
   this.postSub.unsubscribe() ;
   this.authListenerSubs.unsubscribe() ;
  }
  onChangedPage(pageData: PageEvent) {
    this.loading = true ;
    this.currentPage = pageData.pageIndex + 1 ;
    this.postPerPage = pageData.pageSize ;
    this.PostsService.getPosts(this.postPerPage, this.currentPage) ;

  }

}
