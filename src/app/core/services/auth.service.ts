import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDto, RegistrarDto, TokenDto } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'sumarezinhos_token';
  private readonly USER_KEY  = 'sumarezinhos_user';

  private _tokenData = signal<TokenDto | null>(this.loadFromStorage());

  isLoggedIn  = computed(() => !!this._tokenData());
  currentUser = computed(() => this._tokenData());
  isProtetor  = computed(() => this._tokenData()?.tipo === 'Protetor');

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto): Observable<ApiResponse<TokenDto>> {
    return this.http.post<ApiResponse<TokenDto>>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(res => { if (res.sucesso && res.dados) this.saveSession(res.dados); })
    );
  }

  registrar(dto: RegistrarDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/registrar`, dto);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._tokenData.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._tokenData()?.token ?? null;
  }

  private saveSession(data: TokenDto): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data));
    this._tokenData.set(data);
  }

  private loadFromStorage(): TokenDto | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
