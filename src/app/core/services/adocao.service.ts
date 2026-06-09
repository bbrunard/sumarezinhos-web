import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Adocao, CriarAdocaoDto, ResponderAdocaoDto } from '../models/adocao.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdocaoService {
  private url = `${environment.apiUrl}/adocoes`;

  constructor(private http: HttpClient) {}

  solicitar(dto: CriarAdocaoDto): Observable<ApiResponse<Adocao>> {
    return this.http.post<ApiResponse<Adocao>>(this.url, dto);
  }

  minhasSolicitacoes(): Observable<ApiResponse<Adocao[]>> {
    return this.http.get<ApiResponse<Adocao[]>>(`${this.url}/minhas`);
  }

  recebidas(): Observable<ApiResponse<Adocao[]>> {
    return this.http.get<ApiResponse<Adocao[]>>(`${this.url}/recebidas`);
  }

  responder(id: string, dto: ResponderAdocaoDto): Observable<ApiResponse<Adocao>> {
    return this.http.put<ApiResponse<Adocao>>(`${this.url}/${id}/responder`, dto);
  }
}
