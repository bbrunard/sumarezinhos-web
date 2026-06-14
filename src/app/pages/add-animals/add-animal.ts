import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnimalService } from '../../core/services/animal.service';
import { EspecieAnimal, PorteAnimal } from '../../core/models/animal.model';

@Component({
  selector: 'app-add-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-animal.html',
  styleUrls: ['./add-animal.scss']
})
export class AddAnimalComponent {
  private svc    = inject(AnimalService);
  private router = inject(Router);

  // Enums expostos para o template
  EspecieAnimal = EspecieAnimal;
  PorteAnimal   = PorteAnimal;

  // Campos do formulário
  nome       = '';
  especie: EspecieAnimal = EspecieAnimal.Cao;
  porte: PorteAnimal     = PorteAnimal.Pequeno;
  sexo       = 'M';
  idadeMeses = 0;
  castrado   = false;
  vacinado   = false;
  descricao  = '';
  fotoUrl    = '';

  // Estado
  loading  = false;
  erro     = '';
  sucesso  = '';

  // Etapa ativa do formulário (wizard)
  etapa = 1;
  totalEtapas = 3;

  get progressoPct() {
    return Math.round((this.etapa / this.totalEtapas) * 100);
  }

  get emojiEspecie(): string {
    const m: Record<number, string> = {
      [EspecieAnimal.Cao]: '🐶',
      [EspecieAnimal.Gato]: '🐱',
      [EspecieAnimal.Outro]: '🐇'
    };
    return m[this.especie] ?? '🐾';
  }

  get etapa1Valida(): boolean {
    return this.nome.trim().length >= 2 && !!this.especie && !!this.porte;
  }

  get etapa2Valida(): boolean {
    return !!this.sexo && this.idadeMeses >= 0;
  }

  get etapa3Valida(): boolean {
    return this.descricao.trim().length >= 20;
  }

  avancar() {
    if (this.etapa < this.totalEtapas) this.etapa++;
  }

  voltar() {
    if (this.etapa > 1) this.etapa--;
  }

  decrementarIdade() {
    if (this.idadeMeses > 0) this.idadeMeses--;
  }

  incrementarIdade() {
    if (this.idadeMeses < 300) this.idadeMeses++;
  }

  salvar() {
    if (!this.etapa3Valida) return;
    this.loading = true;
    this.erro    = '';
    this.sucesso = '';

    this.svc.criar({
      nome:       this.nome.trim(),
      especie:    this.especie,
      porte:      this.porte,
      sexo:       this.sexo,
      idadeMeses: this.idadeMeses,
      castrado:   this.castrado,
      vacinado:   this.vacinado,
      descricao:  this.descricao.trim(),
      fotoUrl:    this.fotoUrl.trim() || undefined
    }).subscribe({
      next: res => {
        if (res.sucesso) {
          this.sucesso = 'Animal cadastrado com sucesso! Redirecionando...';
          setTimeout(() => this.router.navigate(['/meus-animais']), 1800);
        } else {
          this.erro = res.mensagem ?? 'Erro ao cadastrar animal.';
        }
      },
      error: () => {
        this.erro    = 'Erro de conexão. Verifique sua internet e tente novamente.';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
