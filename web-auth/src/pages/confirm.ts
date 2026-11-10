import { getSupabaseClient } from "../lib/supabase";
import { playAnimation, renderLoadingAnimation } from "../lib/animation";

function renderMessage(message: string, success: boolean) {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) throw new Error("No se encontró el contenedor de la página.");

  app.innerHTML = `
    <main class="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div aria-hidden="true" class="pointer-events-none absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-400/[0.07] blur-3xl"></div>
      <section class="relative w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/70 p-6 shadow-2xl shadow-black/30 sm:p-9">
        <div class="mb-9 flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400">
            <span class="text-sm font-semibold">G</span>
          </div>
          <div>
            <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">Gestor de gastos</p>
            <p class="mt-1 text-xs text-stone-400">Acceso seguro</p>
          </div>
        </div>
        ${success
          ? `<div id="success-animation" role="img" aria-label="Confirmación completada" class="mx-auto mb-5 h-40 w-40"></div>`
          : `<div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-stone-800 text-stone-400"><span aria-hidden="true" class="text-lg">!</span></div>`}
        <h1 class="text-2xl font-semibold tracking-tight text-stone-50">${success ? "Cuenta confirmada" : "No se pudo confirmar"}</h1>
        <p class="mt-3 text-sm leading-6 text-stone-300">${message}</p>
        <div class="mt-8 border-t border-stone-800 pt-5">
          <p class="text-xs leading-5 text-stone-500">Puedes cerrar esta página y continuar desde la app.</p>
        </div>
      </section>
    </main>
  `;

  if (success) playAnimation("success-animation", "success");
}

export async function renderConfirmPage() {
  renderLoadingAnimation("Confirmando tu cuenta...");

  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  window.history.replaceState(null, "", window.location.pathname);

  if (!tokenHash || (type !== "email" && type !== "signup")) {
    renderMessage(
      "El enlace no es válido, expiró o ya fue usado. Solicita un nuevo correo de confirmación desde la app.",
      false,
    );
    return;
  }

  try {
    // verifyOtp valida directamente el token_hash enviado por Supabase; exchangeCodeForSession es para enlaces con un código PKCE.
    const { error } = await getSupabaseClient().auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      renderMessage(
        "El enlace expiró o ya fue usado. Solicita un nuevo correo de confirmación desde la app.",
        false,
      );
      return;
    }

    renderMessage("Tu cuenta está activa. Vuelve a la app e inicia sesión.", true);
  } catch (error) {
    renderMessage(
      error instanceof Error && error.message.startsWith("Falta configurar")
        ? "El servicio de confirmación no está configurado. Inténtalo más tarde."
        : "No se pudo confirmar tu cuenta. Solicita un nuevo correo desde la app.",
      false,
    );
  }
}
