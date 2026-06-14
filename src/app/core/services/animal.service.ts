import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Animal, CriarAnimalDto, AtualizarAnimalDto } from '../models/animal.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private url = `${environment.apiUrl}/animais`;

  constructor(private http: HttpClient) {}

  listar(especie?: number, porte?: number, sexo?: string, apenasDisponiveis = true): Observable<ApiResponse<Animal[]>> {
    let params = new HttpParams().set('apenasDisponiveis', apenasDisponiveis);
    if (especie) params = params.set('especie', especie);
    if (porte)   params = params.set('porte', porte);
    if (sexo)    params = params.set('sexo', sexo);
    return this.http.get<ApiResponse<Animal[]>>(this.url, { params });
  }

  obterPorId(id: string): Observable<ApiResponse<Animal>> {
    return this.http.get<ApiResponse<Animal>>(`${this.url}/${id}`);
  }

  meusAnimais(): Observable<ApiResponse<Animal[]>> {
    return this.http.get<ApiResponse<Animal[]>>(`${this.url}/meus`);
  }

  criar(dto: CriarAnimalDto): Observable<ApiResponse<Animal>> {
    return this.http.post<ApiResponse<Animal>>(this.url, dto);
  }

  atualizar(id: string, dto: AtualizarAnimalDto): Observable<ApiResponse<Animal>> {
    return this.http.put<ApiResponse<Animal>>(`${this.url}/${id}`, dto);
  }

  remover(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.url}/${id}`);
  }
}