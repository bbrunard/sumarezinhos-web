export enum EspecieAnimal { Cao = 1, Gato = 2, Outro = 3 }
export enum PorteAnimal   { Pequeno = 1, Medio = 2, Grande = 3 }
export enum StatusAnimal  { Disponivel = 1, Reservado = 2, Adotado = 3 }

export interface Animal {
  id: string;
  nome: string;
  especie: string;
  porte: string;
  sexo: string;
  idadeMeses: number;
  castrado: boolean;
  vacinado: boolean;
  descricao: string;
  status: string;
  fotoUrl?: string;
  usuarioId: string;
  nomeProtetor: string;
  telefoneProtetor: string;
  criadoEm: string;
}

export interface CriarAnimalDto {
  nome: string;
  especie: EspecieAnimal;
  porte: PorteAnimal;
  sexo: string;
  idadeMeses: number;
  castrado: boolean;
  vacinado: boolean;
  descricao: string;
  fotoUrl?: string;
}

export interface AtualizarAnimalDto {
  nome: string;
  sexo: string;
  idadeMeses: number;
  castrado: boolean;
  vacinado: boolean;
  descricao: string;
  fotoUrl?: string;
  status: StatusAnimal;
}
