import { z } from "zod";

export const signupSchema = z
  .object({
    nome: z
      .string()
      .min(3, "O nome deve ter pelo menos 3 caracteres")
      .max(100, "O nome não pode exceder 100 caracteres"),

    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .email("E-mail inválido")
      .max(150, "O e-mail não pode exceder 150 caracteres"),

    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha está muito longa"),

    confirmPassword: z.string().min(1, "A confirmação é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
