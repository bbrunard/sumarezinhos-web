import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnimalService } from '../../core/services/animal.service';
import { UploadService } from '../../core/services/upload.service';
import { EspecieAnimal, PorteAnimal } from '../../core/models/animal.model';

@Component({
  selector: 'app-add-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-animal.html',
  styleUrls: ['./add-animal.scss']
})
export class AddAnimalComponent {
  private animalSvc = inject(AnimalService);
  private uploadSvc = inject(UploadService);
  private router    = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  EspecieAnimal = EspecieAnimal;
  PorteAnimal   = PorteAnimal;

  // Campos
  nome       = '';
  especie: EspecieAnimal = EspecieAnimal.Cao;
  porte: PorteAnimal     = PorteAnimal.Pequeno;
  sexo       = 'M';
  idadeMeses = 0;
  castrado   = false;
  vacinado   = false;
  descricao  = '';

  // Upload — controle de estado para evitar duplo disparo
  fotoUrl         = '';
  fotoPreviewUrl  = '';
  uploadando      = false;
  erroUpload      = '';
  arquivoNome     = '';
  private _processando = false;   // ← trava para evitar upload duplo

  // Estado geral
  loading  = false;
  erro     = '';
  sucesso  = '';

  // Wizard
  etapa       = 1;
  totalEtapas = 3;

  get progressoPct() { return Math.round((this.etapa / this.totalEtapas) * 100); }
  get etapa1Valida() { return this.nome.trim().length >= 2 && !!this.especie && !!this.porte; }
  get etapa2Valida() { return !!this.sexo && this.idadeMeses >= 0; }
  get etapa3Valida() { return this.descricao.trim().length >= 20; }

  get emojiEspecie(): string {
    const m: Record<number, string> = {
      [EspecieAnimal.Cao]:   '🐶',
      [EspecieAnimal.Gato]:  '🐱',
      [EspecieAnimal.Outro]: '🐇'
    };
    return m[this.especie] ?? '🐾';
  }

  avancar() { if (this.etapa < this.totalEtapas) this.etapa++; }
  voltar()  { if (this.etapa > 1) this.etapa--; }

  decrementarIdade(): void {
    if (this.idadeMeses > 0) this.idadeMeses--;
  }

  incrementarIdade(): void {
    if (this.idadeMeses < 300) this.idadeMeses++;
  }

  // ─── Upload ────────────────────────────────────────────────────
  abrirSeletor(): void {
    // Reseta o valor para permitir selecionar o mesmo arquivo novamente
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileInput.nativeElement.click();
  }

  onArquivoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;
    this.processarArquivo(file);
  }

  onArquivoArrastado(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.processarArquivo(file);
  }

  private processarArquivo(file: File): void {
    if (this._processando) return;

    const tiposOk = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposOk.includes(file.type)) {
      this.erroUpload = 'Formato inválido. Use JPG, PNG ou WEBP.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.erroUpload = 'A imagem deve ter no máximo 5 MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = e => { this.fotoPreviewUrl = e.target?.result as string; };
    reader.readAsDataURL(file);

    this.arquivoNome    = file.name;
    this.erroUpload     = '';
    this.uploadando     = true;
    this.fotoUrl        = '';
    this._processando   = true;

    this.uploadSvc.uploadImagem(file).subscribe({
      next: url => {
        this.fotoUrl      = url;
        this.uploadando   = false;
        this._processando = false;
        if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
      },
      error: () => {
        this.erroUpload     = 'Falha no upload. Tente novamente.';
        this.fotoPreviewUrl = '';
        this.arquivoNome    = '';
        this.uploadando     = false;
        this._processando   = false;
        if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
      }
    });
  }

  removerFoto(): void {
    this.fotoUrl        = '';
    this.fotoPreviewUrl = '';
    this.arquivoNome    = '';
    this.erroUpload     = '';
    this._processando   = false;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // ─── Salvar ────────────────────────────────────────────────────
  salvar(): void {
    if (!this.etapa3Valida || this.uploadando || this.loading) return;

    this.loading = true;
    this.erro    = '';
    this.sucesso = '';

    this.animalSvc.criar({
      nome:       this.nome.trim(),
      especie:    this.especie,
      porte:      this.porte,
      sexo:       this.sexo,
      idadeMeses: this.idadeMeses,
      castrado:   this.castrado,
      vacinado:   this.vacinado,
      descricao:  this.descricao.trim(),
      fotoUrl:    this.fotoUrl || undefined
    }).subscribe({
      next: res => {
        if (res.sucesso) {
          this.sucesso = '🎉 Animal cadastrado com sucesso! Redirecionando...';
          setTimeout(() => this.router.navigate(['/meus-animais']), 1800);
        } else {
          this.erro    = res.mensagem ?? 'Erro ao cadastrar animal.';
          this.loading = false;
        }
      },
      error: () => {
        this.erro    = 'Erro de conexão. Verifique sua internet e tente novamente.';
        this.loading = false;
      }
    });
  }
}
