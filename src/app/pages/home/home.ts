import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalCardComponent } from '../../shared/components/animal-card/animal-card';
import { AnimalService } from '../../core/services/animal.service';
import { Animal } from '../../core/models/animal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AnimalCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private animalSvc = inject(AnimalService);

  animaisDestaque: Animal[] = [];
  loading = true;
  erro    = '';

  stats = [
    { num: '127+', label: 'Animais adotados' },
    { num: '48',   label: 'Disponíveis agora' },
    { num: '32',   label: 'Protetores ativos'  },
    { num: '⭐ 4.9', label: 'Avaliação média'  }
  ];

  passos = [
    { icon: '📝', num: 'Passo 1', text: 'Crie sua conta gratuitamente como adotante ou protetor' },
    { icon: '🔍', num: 'Passo 2', text: 'Explore os animaizinhos disponíveis e filtre pelo perfil' },
    { icon: '💌', num: 'Passo 3', text: 'Envie uma solicitação com sua motivação para adotar'    },
    { icon: '🏡', num: 'Passo 4', text: 'Aprovado! Combine a busca e dê um lar cheio de amor'    }
  ];

  depoimentos = [
    { inicial: 'A', nome: 'Ana Lima',      texto: 'Adotei a Mel pelo Sumarezinhos e foi a melhor decisão da minha vida! O processo foi super simples e o protetor muito atencioso.' },
    { inicial: 'R', nome: 'Rafael Santos', texto: 'Como protetor independente, finalmente tenho uma plataforma digna pra divulgar meus animais. Já consegui 8 adoções em 2 meses!'   },
    { inicial: 'C', nome: 'Carla Matos',   texto: 'Meu filho queria um gato há anos. Encontramos o Bolinha aqui e foi amor à primeira vista. Obrigada, Sumarezinhos! 🐾'            }
  ];

  ngOnInit(): void {
    this.animalSvc.listar(undefined, undefined, undefined, true).subscribe({
      next: res => {
        if (res.sucesso && res.dados) {
          this.animaisDestaque = res.dados.slice(0, 4);
        } else {
          this.erro = res.mensagem ?? 'Erro ao carregar animais.';
        }
        this.loading = false;
      },
      error: () => {
        this.erro   = 'Não foi possível conectar à API. Tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }
}
