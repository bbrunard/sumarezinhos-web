import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, AtualizarUsuarioDto } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.apiUrl}/usuarios`;

  private readonly CLOUD_NAME    = 'dsnlvengh';
  private readonly UPLOAD_PRESET = 'sumarezinhos_preset';

  constructor(private http: HttpClient) {}

  perfil(): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.url}/perfil`);
  }

  atualizarPerfil(dto: AtualizarUsuarioDto): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.url}/perfil`, dto);
  }
}
