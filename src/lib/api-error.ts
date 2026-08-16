type NestErrorBody = {
  message?: string | string[];
};

/**
 * Extrai uma mensagem legível de um erro de API.
 * Assume o formato padrão do NestJS ({ statusCode, message, error }),
 * onde `message` pode ser uma string única ou um array (class-validator).
 */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Não foi possível concluir a ação. Tente novamente."
): string {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: NestErrorBody } }).response;
    const message = response?.data?.message;

    if (Array.isArray(message) && message.length > 0) return message.join(" ");
    if (typeof message === "string" && message.length > 0) return message;
  }

  if (err instanceof Error && err.message) return err.message;

  return fallback;
}
