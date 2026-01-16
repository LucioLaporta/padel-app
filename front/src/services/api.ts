// src/services/api.ts

// Simula latencia de servidor
export const fakeDelay = (ms: number = 500) => {
  return new Promise<void>((resolve) =>
    setTimeout(resolve, ms)
  );
};

// Simula respuesta OK (200)
export const apiOk = <T>(data: T, ms = 500): Promise<T> =>
  fakeDelay(ms).then(() => data);

// Simula error de backend
export const apiError = (
  message = "Error de servidor",
  ms = 500
): Promise<never> =>
  fakeDelay(ms).then(() => {
    throw new Error(message);
  });

