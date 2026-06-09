import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animal } from '../../../core/models/animal.model';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './animal-card.html',
  styleUrls: ['./animal-card.scss']
})
export class AnimalCardComponent {
  @Input() animal!: Animal;
  @Input() showActions = false;
  @Output() remover = new EventEmitter<string>();

  get emoji(): string {
    const map: Record<string, string> = { Cao: '🐶', Gato: '🐱', Outro: '🐇' };
    return map[this.animal.especie] ?? '🐾';
  }

  get bgColor(): string {
    const map: Record<string, string> = { Cao: '#FFF8E0', Gato: '#FFF0F5', Outro: '#F0FFF0' };
    return map[this.animal.especie] ?? '#FDF6EC';
  }

  get isDisponivel(): boolean { return this.animal.status === 'Disponivel'; }

  get idadeLabel(): string {
    const m = this.animal.idadeMeses;
    return m < 12 ? `${m} ${m === 1 ? 'mês' : 'meses'}` : `${Math.floor(m / 12)} ${Math.floor(m / 12) === 1 ? 'ano' : 'anos'}`;
  }
}
