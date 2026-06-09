export enum TipoUsuario { Adotante = 1, Protetor = 2 }

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  tipo: string;
}

export interface RegistrarDto {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cidade: string;
  tipo: TipoUsuario;
}

export interface LoginDto {
  email: string;
  senha: string;
}

export interface TokenDto {
  token: string;
  nomeUsuario: string;
  email: string;
  tipo: string;
  expiracao: string;
}

export interface AtualizarUsuarioDto {
  nome: string;
  telefone: string;
  cidade: string;
}
