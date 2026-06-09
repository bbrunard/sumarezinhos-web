import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TipoUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nome = ''; email = ''; senha = '';
  telefone = ''; cidade = 'Sumaré';
  tipo: TipoUsuario = TipoUsuario.Adotante;
  TipoUsuario = TipoUsuario;
  loading = false; erro = ''; sucesso = '';

  registrar() {
    if (!this.nome || !this.email || !this.senha || !this.telefone) { this.erro = 'Preencha todos os campos.'; return; }
    this.loading = true; this.erro = '';
    this.auth.registrar({ nome: this.nome, email: this.email, senha: this.senha, telefone: this.telefone, cidade: this.cidade, tipo: this.tipo }).subscribe({
      next: res => {
        if (res.sucesso) { this.sucesso = 'Conta criada! Fazendo login...'; setTimeout(() => this.router.navigate(['/auth/login']), 1500); }
        else this.erro = res.mensagem;
      },
      error: () => { this.erro = 'Erro ao criar conta.'; this.loading = false; },
      complete: () => this.loading = false
    });
  }
}
