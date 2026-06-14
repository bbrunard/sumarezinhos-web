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

  animais: Animal[] = [];
  loading  = true;
  erro     = '';
  removendo: string | null = null;
  confirmandoId: string | null = null;

  get disponiveis() { return this.animais.filter(a => a.status === 'Disponivel'); }
  get reservados()  { return this.animais.filter(a => a.status === 'Reservado'); }
  get adotados()    { return this.animais.filter(a => a.status === 'Adotado'); }

  get emoji() {
    return (a: Animal) => ({ Cao: '🐶', Gato: '🐱', Outro: '🐇' }[a.especie] ?? '🐾');
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.svc.meusAnimais().subscribe({
      next: r => { if (r.sucesso) this.animais = r.dados ?? []; else this.erro = r.mensagem; },
      error: () => { this.erro = 'Erro ao carregar animais.'; this.loading = false; },
      complete: () => this.loading = false
    });
  }

  confirmarRemocao(id: string) { this.confirmandoId = id; }
  cancelarRemocao()             { this.confirmandoId = null; }

  remover(id: string) {
    this.removendo = id;
    this.confirmandoId = null;
    this.svc.remover(id).subscribe({
      next: r => {
        if (r.sucesso) this.animais = this.animais.filter(a => a.id !== id);
        else this.erro = r.mensagem;
      },
      error: () => { this.erro = 'Erro ao remover animal.'; },
      complete: () => this.removendo = null
    });
  }
}
