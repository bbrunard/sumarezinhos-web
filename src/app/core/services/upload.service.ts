import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  // ─── Configuração Cloudinary ──────────────────────────────────────
  // 1. Crie conta grátis em cloudinary.com
  // 2. No painel: Settings → Upload → Add upload preset → Unsigned → salve o nome
  // 3. Substitua os dois valores abaixo
  private readonly CLOUD_NAME   = 'SEU_CLOUD_NAME';   // ex: dxyz1234
  private readonly UPLOAD_PRESET = 'SEU_UPLOAD_PRESET'; // ex: sumarezinhos_preset

  private get uploadUrl() {
    return `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;
  }

  constructor(private http: HttpClient) {}

  uploadImagem(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', this.UPLOAD_PRESET);
    form.append('folder', 'sumarezinhos');

    return this.http
      .post<{ secure_url: string }>(this.uploadUrl, form)
      .pipe(map(res => res.secure_url));
  }
}
