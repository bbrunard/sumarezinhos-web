import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  private svc = inject(UsuarioService);
  auth        = inject(AuthService);

  usuario?: Usuario;
  loading  = true;
  salvando = false;
  erro     = '';
  sucesso  = '';
  editando = false;

  nome     = '';
  telefone = '';
  cidade   = '';

  get inicial()    { return this.usuario?.nome?.charAt(0).toUpperCase() ?? '?'; }
  get isProtetor() { return this.auth.isProtetor(); }

  ngOnInit(): void {
    this.svc.perfil().subscribe({
      next: r => {
        if (r.sucesso && r.dados) {
          this.usuario  = r.dados;
          this.nome     = r.dados.nome;
          this.telefone = r.dados.telefone;
          this.cidade   = r.dados.cidade;
        } else {
          this.erro = r.mensagem ?? 'Não foi possível carregar o perfil.';
        }
        this.loading = false;
      },
      error: () => {
        this.erro    = 'Erro de conexão ao carregar o perfil. Verifique sua internet.';
        this.loading = false;
      }
    });
  }

  salvar(): void {
    if (!this.nome.trim()) return;
    this.salvando = true;
    this.erro     = '';
    this.sucesso  = '';

    this.svc.atualizarPerfil({ nome: this.nome, telefone: this.telefone, cidade: this.cidade })
      .subscribe({
        next: r => {
          if (r.sucesso && r.dados) {
            this.usuario = r.dados;
            this.sucesso  = 'Perfil atualizado com sucesso!';
            this.editando = false;
          } else {
            this.erro = r.mensagem ?? 'Erro ao salvar perfil.';
          }
          this.salvando = false;
        },
        error: () => {
          this.erro     = 'Erro de conexão ao salvar. Tente novamente.';
          this.salvando = false;
        }
      });
  }

  cancelarEdicao(): void {
    this.nome     = this.usuario?.nome     ?? '';
    this.telefone = this.usuario?.telefone ?? '';
    this.cidade   = this.usuario?.cidade   ?? '';
    this.editando = false;
    this.erro     = '';
  }

  logout(): void { this.auth.logout(); }
}
