/* Tipos base do cardápio */

export const TAMANHOS_PIZZA = ["pequena", "media", "grande"] as const;

export type TamanhoPizza = (typeof TAMANHOS_PIZZA)[number];

/** Rótulo legível do tamanho ("media" -> "Média"). */
export const ROTULOS_TAMANHO: Record<TamanhoPizza, string> = {
  pequena: "Pequena",
  media: "Média",
  grande: "Grande",
};

export const Categoria = {
  LANCHES: "Lanches",
  PIZZAS: "Pizzas",
  BEBIDAS: "Bebidas",
  SOBREMESAS: "Sobremesas",
} as const;

export type CategoriaEnum = keyof typeof Categoria;

/**
 * Preço por tamanho de pizza (contrato fechado: campo `precos_por_tamanho`
 * no GET /cardapio, adicional e derivado de itens_cardapio_precos_tamanho).
 * Campo ausente no backend em prod = backend antigo (fallback: UI usa o preço
 * base como referência); campo presente mas vazio/sem o tamanho = preço a
 * definir, sem estimativa.
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
  precos_por_tamanho?: PrecoTamanho[];
}

/** Verifica se o item é pizza (produzida por tamanho, exatamente 1 sabor). */
export function ehPizza(item: ItemCardapio): boolean {
  const categoria = item.categoria.toLowerCase();
  return categoria === "pizza" || categoria === "pizzas";
}

/**
 * Preço do item no tamanho informado.
 * - Não-pizza: preco fixo.
 * - Pizza com precificação `precos_por_tamanho`: preco do tamanho, ou null se o
 *   tamanho existir no modelo mas não tiver preço (preço a definir).
 * - Pizza sem o campo (backend antigo em prod): null -> UI usa o preco base
 *   como referência (placeholder).
 */
export function precoDoItem(
  item: ItemCardapio,
  tamanho?: TamanhoPizza,
): number | null {
  if (!ehPizza(item)) return item.preco;
  if (!tamanho) return null;
  if (!item.precos_por_tamanho) return null; // backend antigo: placeholder
  const registro = item.precos_por_tamanho.find(
    (p) => p.tamanho === tamanho,
  );
  return registro ? registro.preco : null;
}

/**
 * O backend expõe precificação por tamanho para o item? (campo presente).
 * Usado para distinguir fallback (backend antigo) de "preço a definir".
 */
export function temPrecosPorTamanho(item: ItemCardapio): boolean {
  return Array.isArray(item.precos_por_tamanho);
}

/**
 * Preço informativo de uma linha do carrinho.
 * - Item de preço fixo: preço base.
 * - Pizza com preço do tamanho: preço do tamanho.
 * - Pizza sem campo de preços (backend antigo): preço base como referência.
 * - Pizza com campo de preços mas sem preço no tamanho: null (a definir).
 */
export function precoNoCarrinho(
  item: ItemCardapio,
  tamanho?: TamanhoPizza,
): number | null {
  const preco = precoDoItem(item, tamanho);
  if (preco !== null) return preco;
  return temPrecosPorTamanho(item) ? null : item.preco;
}
