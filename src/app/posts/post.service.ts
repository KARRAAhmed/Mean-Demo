import { Injectable } from '@angular/core';
import { Post } from './post';
import {Subject} from 'rxjs' ;
import {HttpClient} from '@angular/common/http' ;
import {map} from 'rxjs/operators' ;
import {Router} from '@angular/router' ;

@Injectable({
  providedIn: 'root'
})
export class PostService {
posts: Post [] = [];
private postUpdated = new Subject<{posts: Post [] , postCount: number}>() ;
  constructor(private http: HttpClient, private router: Router) { }


  getPosts (postsPerPages: number , currentPage: number) {
   const queryParams = `?pagesize=${postsPerPages}&page=${currentPage}` ;
    this.http.get<{message: string , posts: any , maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return {posts : postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator : post.creator
        };
      }), maxPosts : postData.maxPosts

    };
    }))
    .subscribe((dataAfterMap) => {
      console.log(dataAfterMap) ;
      this.posts = dataAfterMap.posts ;
      this.postUpdated.next(
        { posts : [...this.posts],
         postCount : dataAfterMap.maxPosts}) ;
    }) ;
  }
  getPostUpdatedList() {
    return this.postUpdated.asObservable() ;
  }
 /* addPost(title: string , content: string ) {
      const post: Post = {id: null, title: title , content : content } ;
      this.http.post<{message: string , postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        post.id = responseData.postId ;
        this.posts.push(post) ;
        this.postUpdated.next([...this.posts] );
        this.router.navigate(['/']) ;
      });
  }*/
  addPost(title: string , content: string , image: File ) {
    const postData = new FormData() ;
    postData.append('title', title) ;
    postData.append('content', content) ;
    postData.append('image', image , title) ;
    this.http.post<{message: string , post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      /*const post: Post = {id : responseData.post.id ,
         title: title ,
          content : content ,
        imagePath : responseData.post.imagePath};
      console.log(responseData.message);
      // post.id = responseData.post.id ;
      this.posts.push(post) ;
      this.postUpdated.next([...this.posts] );*/
      this.router.navigate(['/']) ;
    });
}
  getPost(id: string) {
// tslint:disable-next-line: max-line-length
 return this.http.get<{_id: string, title: string, content: string , imagePath: string , creator: string}>('http://localhost:3000/api/posts/' + id ) ;
  }
  updatePost(id: string , title: string , content: string , image: string | File) {
    let postData: Post | FormData ;
    if ( typeof(image) === 'object') {
      postData = new FormData() ;
      postData.append('id', id) ;
      postData.append('title', title) ;
      postData.append('content', content) ;
      postData.append('image', image , title) ;
    } else {
      postData = {
        id : id ,
        title : title ,
        content : content ,
        imagePath : image ,
        creator : null
      };

    }
    // const post: Post = {id: id , title: title , content : content , imagePath : null} ;
    this.http.put('http://localhost:3000/api/posts/' + id , postData )
    .subscribe(response => {console.log(response);
    this.router.navigate(['/']) ; }) ;
  }
  deletePost(PostId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + PostId) ;
      /*.subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== PostId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });*/
  }
}
