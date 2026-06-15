import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  loading = true;
  erro = '';
  filtroEspecie?: number;
  filtroPorte?: number;
  filtroSexo?: string;

  filtros = [
    { label: '🐾 Todos', especie: undefined },
    { label: '🐶 Cães', especie: EspecieAnimal.Cao },
    { label: '🐱 Gatos', especie: EspecieAnimal.Gato },
    { label: '🐇 Outros', especie: EspecieAnimal.Outro }
  ];

  portes = [
    { label: 'Qualquer porte', value: undefined },
    { label: '🔹 Pequeno', value: PorteAnimal.Pequeno },
    { label: '🔸 Médio', value: PorteAnimal.Medio },
    { label: '🔶 Grande', value: PorteAnimal.Grande }
  ];

  filtroAtivo = 0;

  ngOnInit() { this.buscar(); }

  setEspecie(i: number, especie?: number) {
    this.filtroAtivo = i;
    this.filtroEspecie = especie;
    this.buscar();
  }

  buscar() {
    this.loading = true;
    this.erro = '';
    this.svc.listar(this.filtroEspecie, this.filtroPorte, this.filtroSexo).subscribe({
      next: res => {
        if (res.sucesso) {
          this.animais = res.dados ?? [];
        } else {
          console.error('API error listar:', res.mensagem);
          this.erro = res.mensagem ?? 'Erro ao carregar animais.';
          this.animais = [];
        }
      },
      error: (err) => { console.error('Erro ao buscar animais:', err); this.erro = 'Erro ao buscar animais. Verifique o console (Network).'; this.animais = []; },
      complete: () => this.loading = false
    });
  }
}
