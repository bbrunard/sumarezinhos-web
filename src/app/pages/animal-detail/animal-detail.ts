import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService } from '../../core/services/animal.service';
import { AdocaoService } from '../../core/services/adocao.service';
import { AuthService } from '../../core/services/auth.service';
import { Animal } from '../../core/models/animal.model';

@Component({
  selector: 'app-animal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './animal-detail.html',
  styleUrls: ['./animal-detail.scss']
})
export class AnimalDetailComponent implements OnInit {
  private route     = inject(ActivatedRoute);
  private animalSvc = inject(AnimalService);
  private adocaoSvc = inject(AdocaoService);
  auth = inject(AuthService);

  animal?: Animal;
  loading = true;
  motivacao = '';
  enviando = false;
  mensagem = '';
  sucesso = false;
  erro = '';

  get emoji(): string {
    const map: Record<string, string> = { Cao: '🐶', Gato: '🐱', Outro: '🐇' };
    return map[this.animal?.especie ?? ''] ?? '🐾';
  }

  get idadeLabel(): string {
    const m = this.animal?.idadeMeses ?? 0;
    return m < 12 ? `${m} ${m === 1 ? 'mês' : 'meses'}` : `${Math.floor(m / 12)} ano(s)`;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.animalSvc.obterPorId(id).subscribe({
      next: res => { if (res.sucesso) this.animal = res.dados; },
      error: () => this.erro = 'Animal não encontrado.',
      complete: () => this.loading = false
    });
  }

  solicitar() {
    if (!this.motivacao.trim() || !this.animal) return;
    this.enviando = true;
    this.adocaoSvc.solicitar({ animalId: this.animal.id, motivacao: this.motivacao }).subscribe({
      next: res => {
        if (res.sucesso) { this.sucesso = true; this.mensagem = res.mensagem; }
        else { this.erro = res.mensagem; }
      },
      error: () => this.erro = 'Erro ao enviar solicitação.',
      complete: () => this.enviando = false
    });
  }
}
