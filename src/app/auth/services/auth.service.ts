import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt = new JwtHelperService()

  private readonly baseUrl: string = 'http://localhost:8080'

  constructor(
    private http: HttpClient,
    private router: Router
    
  ) { }

  signIn(user: User): Observable<{ Authorization: string}> {
    return this.http.post<{ Authorization: string }>(`${this.baseUrl}/login`, user)
    .pipe(
      tap((response) => {
        this.armazenarToken(response.Authorization)
      })
    )
  }

  signOut(): void {
    this.removerToken()

    this.router.navigateByUrl('/auth/login')
    }

  armazenarToken(token: string): void {
    localStorage.setItem('authorization', token)
  }

  recuperarToken(): string | null {
    return localStorage.getItem('authorization')
  }

  removerToken() {
    localStorage.removeItem('authorization')
  }

  logado(): boolean {
    // o usuario estara logado se o token estiver armazenado e o token ainda for valido
    const token = this.recuperarToken()

    if(token == null) {
      return false
    }
    return !this.jwt.isTokenExpired(token) // testando a validade do token
    
  }
}
