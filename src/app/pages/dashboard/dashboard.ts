import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AnimalService } from '../../core/services/animal.service';
import { AdocaoService } from '../../core/services/adocao.service';
import { Animal } from '../../core/models/animal.model';
import { Adocao } from '../../core/models/adocao.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  auth       = inject(AuthService);
  animalSvc  = inject(AnimalService);
  adocaoSvc  = inject(AdocaoService);

  animais: Animal[]   = [];
  adocoes: Adocao[]   = [];
  loadingAnimais = true;
  loadingAdocoes = true;

  get isProtetor()   { return this.auth.isProtetor(); }
  get nomeUsuario()  { return this.auth.currentUser()?.nomeUsuario ?? 'Usuário'; }
  get primeiroNome() { return this.nomeUsuario.split(' ')[0]; }

  get totalDisponiveis() { return this.animais.filter(a => a.status === 'Disponivel').length; }
  get totalAdotados()    { return this.animais.filter(a => a.status === 'Adotado').length; }
  get totalPendentes()   { return this.adocoes.filter(a => a.status === 'Pendente').length; }

  get atalhos() {
    if (this.isProtetor) return [
      { icon: '➕', label: 'Cadastrar animal',    route: '/cadastrar-animal',  cor: '#D98EA0' },
      { icon: '🐾', label: 'Meus animais',        route: '/meus-animais',     cor: '#B8D9C0' },
      { icon: '💌', label: 'Solicitações recebidas', route: '/minhas-adocoes', cor: '#FAD9A1' },
      { icon: '👤', label: 'Meu perfil',           route: '/perfil',           cor: '#C4D4F2' },
    ];
    return [
      { icon: '🔍', label: 'Ver animais',          route: '/animais',          cor: '#D98EA0' },
      { icon: '💌', label: 'Minhas solicitações',  route: '/minhas-adocoes',   cor: '#FAD9A1' },
      { icon: '👤', label: 'Meu perfil',           route: '/perfil',           cor: '#C4D4F2' },
    ];
  }

  ngOnInit() {
    if (this.isProtetor) {
      this.animalSvc.meusAnimais().subscribe({
        next: r => { if (r.sucesso) this.animais = r.dados ?? []; },
        complete: () => this.loadingAnimais = false
      });
      this.adocaoSvc.recebidas().subscribe({
        next: r => { if (r.sucesso) this.adocoes = r.dados ?? []; },
        complete: () => this.loadingAdocoes = false
      });
    } else {
      this.loadingAnimais = false;
      this.adocaoSvc.minhasSolicitacoes().subscribe({
        next: r => { if (r.sucesso) this.adocoes = r.dados ?? []; },
        complete: () => this.loadingAdocoes = false
      });
    }
  }
}
