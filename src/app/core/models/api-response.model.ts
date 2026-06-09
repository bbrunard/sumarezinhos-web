export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
  erros?: string[];
}
