import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {

  private readonly CLOUD_NAME   = 'dsnlvengh';
  private readonly UPLOAD_PRESET = 'sumarezinhos_preset';

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
