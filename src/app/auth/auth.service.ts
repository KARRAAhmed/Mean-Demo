import { Injectable } from '@angular/core';
import {Subject} from 'rxjs' ;
import {HttpClient} from '@angular/common/http' ;
import {map} from 'rxjs/operators' ;
import {Router} from '@angular/router' ;
import { AuthData } from './auth-data';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string ;
  private authStatusListener = new Subject<boolean>() ;
  private isAuthenticated = false ;
  private tokenTimer: any ;
  private userId: string ;
  getAuthenticated () {
    return this.isAuthenticated ;
  }
  getToken() {
    return this.token ;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable() ;
  }

  constructor(private http: HttpClient , private  router: Router) { }
  createUser(email: string , password: string) {
   const  authData: AuthData  = {
     email : email ,
     password  : password
    };
    this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(response => {
      console.log(response) ;
      this.router.navigate(['/']) ;
    }, error => {
      this.authStatusListener.next(false) ;
    });
  }
  login(email: string , password: string) {
    const  authData: AuthData  = {
      email : email ,
      password  : password
     };
    this.http.post<{token: string , expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
    .subscribe(response => {
      // console.log(response) ;
      const expiresIn = response.expiresIn ;
      // console.log(response.expiresIn) ;
      this.setAuthTimer(expiresIn) ;
      this.token = response.token ;
      this.isAuthenticated = true ;
      this.userId = response.userId ;
      console.log(this.userId) ;
      this.authStatusListener.next(true) ;
      const now = new Date() ;
      const expirationData = new Date(now.getTime() + expiresIn * 1000) ;
      this.saveAuthData(this.token, expirationData , this.userId) ;
      console.log(expirationData) ;
      this.router.navigate(['/']) ;
    },
    error => {
      this.authStatusListener.next(false) ;
    });
  }
  logout() {
    this.token = null ;
    this.isAuthenticated = false ;
    this.authStatusListener.next(null) ;
    clearTimeout(this.tokenTimer) ;
    this.clearAuthData() ;
    this.userId = null ;
    this.router.navigate(['/']) ;
  }
  private saveAuthData (token: string, expirationData: Date , userId: string) {
    localStorage.setItem('token', token) ;
    localStorage.setItem('expiration', expirationData.toISOString()) ;
    localStorage.setItem('userId', userId) ;
  }

private clearAuthData() {
  localStorage.removeItem('token') ;
  localStorage.removeItem('expiration') ;
  localStorage.removeItem('userId') ;
}
private getAuthdata() {
   const token = localStorage.getItem('token') ;
   const  expirationDate = localStorage.getItem('expiration') ;
   const userId = localStorage.getItem('userId') ;
   if (!token || !expirationDate ) {
     return ;
   }
   return {
     token : token ,
     expirationDate : new Date(expirationDate) ,
     userId : userId
   } ;
}
 autoAuthUser() {
   const authInformation = this.getAuthdata() ;
   if (!authInformation) {
     return ;
   }
   const now = new Date() ;
   const expiresIn = authInformation.expirationDate.getTime() - now.getTime() ;
   if (expiresIn > 0) {
     this.token = authInformation.token ;
     this.isAuthenticated = true ;
     this.userId = authInformation.userId ;
     this.setAuthTimer(expiresIn / 1000) ;
     this.authStatusListener.next(true) ;
   }
 }

 private setAuthTimer(duration: number) {
   console.log('Setting timer :' + duration) ;
 this.tokenTimer =  setTimeout(() => {
  this.logout() ;

}, duration * 1000) ;
}
   getUserId() {
         return this.userId ;
    }

}
