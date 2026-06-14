import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdocaoService } from '../../core/services/adocao.service';
import { AuthService } from '../../core/services/auth.service';
import { Adocao, StatusAdocao } from '../../core/models/adocao.model';

@Component({
  selector: 'app-my-adoptions',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-adoptions.html',
  styleUrls: ['./my-adoptions.scss']
})
export class MyAdoptionsComponent implements OnInit {
  private svc  = inject(AdocaoService);
  auth         = inject(AuthService);

  adocoes: Adocao[] = [];
  loading    = true;
  erro       = '';
  respondendo: string | null = null;
  mensagemResposta: { [id: string]: string } = {};
  StatusAdocao = StatusAdocao;

  get isProtetor() { return this.auth.isProtetor(); }

  get pendentes()  { return this.adocoes.filter(a => a.status === 'Pendente'); }
  get aprovadas()  { return this.adocoes.filter(a => a.status === 'Aprovada'); }
  get recusadas()  { return this.adocoes.filter(a => a.status === 'Recusada'); }

  ngOnInit() {
    const obs = this.isProtetor
      ? this.svc.recebidas()
      : this.svc.minhasSolicitacoes();

    obs.subscribe({
      next: r => { if (r.sucesso) this.adocoes = r.dados ?? []; else this.erro = r.mensagem; },
      error: () => { this.erro = 'Erro ao carregar solicitações.'; this.loading = false; },
      complete: () => this.loading = false
    });
  }

  toggleResposta(id: string) {
    this.respondendo = this.respondendo === id ? null : id;
  }

  responder(adocao: Adocao, status: StatusAdocao) {
    this.svc.responder(adocao.id, {
      status,
      mensagemResposta: this.mensagemResposta[adocao.id] ?? ''
    }).subscribe({
      next: r => {
        if (r.sucesso && r.dados) {
          const idx = this.adocoes.findIndex(a => a.id === adocao.id);
          if (idx !== -1) this.adocoes[idx] = r.dados!;
          this.respondendo = null;
        } else {
          this.erro = r.mensagem;
        }
      },
      error: () => this.erro = 'Erro ao responder solicitação.'
    });
  }
}
