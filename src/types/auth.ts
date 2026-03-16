import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().pipe(z.email("E-mail inválido")),
  ativo: z.boolean(),
  admin: z.boolean(),
});

export const AuthTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().pipe(z.email("E-mail inválido")),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const SignupSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  email: z.string().pipe(z.email("E-mail inválido")),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  ativo: z.boolean().optional().default(true),
  admin: z.boolean().optional().default(false),
});

export type User = z.infer<typeof UserSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Signup = z.infer<typeof SignupSchema>;
