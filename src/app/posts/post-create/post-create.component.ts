import { Component, OnInit , EventEmitter , Output, OnDestroy} from '@angular/core';
import { Post } from '../post';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from './7.1 mime-type.validator.ts' ;
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

 // newPost = 'NoContent' ;
 // PostValue = '' ;
 enteredTitle = '' ;
 enteredContent = '' ;
 private mode = 'create';
 postId: string ;
 postEdit: Post ;
 loading = false ;
 imagePreview: string ;
 // @Output() postCreated = new EventEmitter <Post> () ;
 form: FormGroup ;
 private authStatusSub: Subscription ;

  constructor(private postService: PostService , private route: ActivatedRoute , private authService: AuthService) { }
  /*onAddPost(inputPost: HTMLTextAreaElement) {
    console.dir(inputPost) ;
    this.newPost = inputPost.value ;
    alert('Post Added') ;
  }*/

  onSavePost() {
    if (this.form.invalid) {return ; }
   // const post: Post = {id: null, title : form.value.title, content : form.value.content} ;
   // this.postCreated.emit(post) ;
   this.loading = true ;
   if (this.mode === 'create') {this.postService.addPost(this.form.value.title , this.form.value.content , this.form.value.image); }
// tslint:disable-next-line: one-line
   else {
     this.postService.updatePost(this.postId, this.form.value.title , this.form.value.content , this.form.value.image);
   }
   this.form.reset();

  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(suthStatus => {
      this.loading = false ;
    }) ;

    this.form = new FormGroup(
      {
        'title' : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}) ,
        'content' : new FormControl(null, {validators: [Validators.required]}),
        'image' : new FormControl(null, {validators: [Validators.required], asyncValidators : [mimeType]})
      }
    );
    this.route.paramMap.subscribe((parmMap: ParamMap) => {
         if (parmMap.has('id')) {this.mode = 'edit';
         this.postId = parmMap.get('id') ;
         this.loading = true ;
         this.postService.getPost(this.postId)
         .subscribe(postData => {
          this.loading = false ;
          // this.postEdit = {id: postData._id, title: postData.title, content: postData.content , imagePath : null} ;
        this.form.setValue(
          {'title': postData.title ,
           'content': postData.content,
           'image' : postData.imagePath
           }) ;
        }) ;
      } else {this.mode = 'create'; this.postId = null ; }
    }
    );
  }
  onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0] ;
       this.form.patchValue({'image': file}) ;
       this.form.get('image').updateValueAndValidity() ;
       console.log(file) ;
       console.log(this.form) ;
       const reader = new FileReader() ;
       reader.onload = () => {
           this.imagePreview = reader.result as string;
       } ;
       reader.readAsDataURL(file) ;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe() ;
  }
}
