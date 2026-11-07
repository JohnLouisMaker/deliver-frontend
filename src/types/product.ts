/* Tipos base do cardápio */

export const TAMANHOS_PIZZA = ["pequena", "media", "grande"] as const;

export type TamanhoPizza = (typeof TAMANHOS_PIZZA)[number];

export const Categoria = {
  LANCHES: "Lanches",
  PIZZAS: "Pizzas",
  BEBIDAS: "Bebidas",
  SOBREMESAS: "Sobremesas",
} as const;

export type CategoriaEnum = keyof typeof Categoria;

/**
 * Preço por tamanho de pizza (contrato: somente pizzas possuem tamanho).
 * O endpoint read-only do cardápio ainda não expõe esses valores; o campo é
 * opcional e a UI exibe o preço base como placeholder enquanto não houver API.
 */
export interface PrecoTamanho {
  tamanho: TamanhoPizza;
  preco: number;
}

export interface ItemCardapio {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: string;
  disponivel: boolean;
  imagem_url: string;
  precos_tamanho?: PrecoTamanho[];
}

/** Verifica se o item é pizza (produzida por tamanho, exatamente 1 sabor). */
export function ehPizza(item: ItemCardapio): boolean {
  const categoria = item.categoria.toLowerCase();
  return categoria === "pizza" || categoria === "pizzas";
}
