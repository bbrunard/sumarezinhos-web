import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AnimalCardComponent } from '../../shared/components/animal-card/animal-card';
import { AnimalService } from '../../core/services/animal.service';
import { Animal, EspecieAnimal, PorteAnimal } from '../../core/models/animal.model';

@Component({
  selector: 'app-animals',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimalCardComponent],
  templateUrl: './animals.html',
  styleUrls: ['./animals.scss']
})
export class AnimalsComponent implements OnInit {
  private svc = inject(AnimalService);

  animais: Animal[] = [];
  loading  = true;
  erro     = '';

  filtroEspecie?: number;
  filtroPorte?:   number;
  filtroSexo?:    string;
  filtroAtivo = 0;

  filtros = [
    { label: '🐾 Todos',  especie: undefined             },
    { label: '🐶 Cães',   especie: EspecieAnimal.Cao     },
    { label: '🐱 Gatos',  especie: EspecieAnimal.Gato    },
    { label: '🐇 Outros', especie: EspecieAnimal.Outro   }
  ];

  portes = [
    { label: 'Qualquer porte', value: undefined           },
    { label: '🔹 Pequeno',     value: PorteAnimal.Pequeno },
    { label: '🔸 Médio',       value: PorteAnimal.Medio   },
    { label: '🔶 Grande',      value: PorteAnimal.Grande  }
  ];

  ngOnInit(): void { this.buscar(); }

  setEspecie(i: number, especie?: number): void {
    this.filtroAtivo   = i;
    this.filtroEspecie = especie;
    this.buscar();
  }

  buscar(): void {
    this.loading = true;
    this.erro    = '';
    this.animais = [];

    this.animalSvc.listar(this.filtroEspecie, this.filtroPorte, this.filtroSexo)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          console.debug('animals buscar response', res);
          if (res.sucesso) {
            this.animais = res.dados ?? [];
          } else {
            this.erro = res.mensagem ?? 'Erro ao buscar animais.';
          }
        },
        error: err => {
          console.error('Erro ao buscar animais:', err);
          this.erro = 'Não foi possível conectar à API. Verifique sua conexão.';
        }
      });
  }

  get animalSvc() { return this.svc; }
}
