import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = ''; senha = ''; loading = false; erro = '';

  login() {
    if (!this.email || !this.senha) { this.erro = 'Preencha todos os campos.'; return; }
    this.loading = true; this.erro = '';
    this.auth.login({ email: this.email, senha: this.senha }).subscribe({
      next: res => {
        if (res.sucesso) this.router.navigate(['/dashboard']);
        else this.erro = res.mensagem;
      },
      error: () => { this.erro = 'Erro ao conectar. Tente novamente.'; this.loading = false; },
      complete: () => this.loading = false
    });
  }
}
