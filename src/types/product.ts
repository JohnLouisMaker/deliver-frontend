export const Categoria = {
  LANCHES: "Lanches",
  PIZZAS: "Pizzas",
  BEBIDAS: "Bebidas",
  SOBREMESAS: "Sobremesas",
} as const;

export type CategoriaEnum = keyof typeof Categoria;

export interface ItemCardapio {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: CategoriaEnum;
  disponivel: boolean;
  imagem_url: string;
}