import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../../core/services/animal.service';
import { Animal } from '../../core/models/animal.model';

@Component({
  selector: 'app-my-animals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-animals.html',
  styleUrls: ['./my-animals.scss']
})
export class MyAnimalsComponent implements OnInit {
  private svc = inject(AnimalService);

  animais:       Animal[] = [];
  loading        = true;
  erro           = '';
  removendo:     string | null = null;
  confirmandoId: string | null = null;

  get disponiveis() { return this.animais.filter(a => a.status === 'Disponivel'); }
  get reservados()  { return this.animais.filter(a => a.status === 'Reservado');  }
  get adotados()    { return this.animais.filter(a => a.status === 'Adotado');    }

  emojiDe(a: Animal): string {
    return ({ Cao: '🐶', Gato: '🐱', Outro: '🐇' } as Record<string, string>)[a.especie] ?? '🐾';
  }

  bgDe(a: Animal): string {
    return ({ Cao: '#FFF8E0', Gato: '#FFF0F5', Outro: '#F0FFF0' } as Record<string, string>)[a.especie] ?? '#FDF6EC';
  }

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.loading = true;
    this.erro    = '';

    this.svc.meusAnimais().subscribe({
      next: r => {
        if (r.sucesso && r.dados != null) {
          this.animais = r.dados;
        } else {
          this.erro = r.mensagem ?? 'Erro ao carregar animais.';
        }
        this.loading = false;
      },
      error: () => {
        this.erro    = 'Não foi possível conectar à API. Verifique sua conexão.';
        this.loading = false;
      }
    });
  }

  confirmarRemocao(id: string): void { this.confirmandoId = id; }
  cancelarRemocao():               void { this.confirmandoId = null; }

  remover(id: string): void {
    this.removendo     = id;
    this.confirmandoId = null;

    this.svc.remover(id).subscribe({
      next: r => {
        if (r.sucesso) {
          this.animais = this.animais.filter(a => a.id !== id);
        } else {
          this.erro = r.mensagem ?? 'Erro ao remover animal.';
        }
        this.removendo = null;
      },
      error: () => {
        this.erro      = 'Erro ao remover animal. Tente novamente.';
        this.removendo = null;
      }
    });
  }
}
