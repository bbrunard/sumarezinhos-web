export enum StatusAdocao { Pendente = 1, Aprovada = 2, Recusada = 3 }

export interface Adocao {
  id: string;
  motivacao: string;
  status: string;
  mensagemResposta?: string;
  dataResposta?: string;
  animalId: string;
  nomeAnimal: string;
  fotoAnimal?: string;
  adotanteId: string;
  nomeAdotante: string;
  telefoneAdotante: string;
  criadoEm: string;
}

export interface CriarAdocaoDto {
  animalId: string;
  motivacao: string;
}

export interface ResponderAdocaoDto {
  status: StatusAdocao;
  mensagemResposta?: string;
}
