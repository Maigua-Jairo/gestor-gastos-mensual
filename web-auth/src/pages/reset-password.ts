import { getSupabaseClient } from "../lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { playAnimation, renderLoadingAnimation } from "../lib/animation";

function renderFrame(title: string, content: string) {
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
        ${content}
        <div class="mt-8 border-t border-stone-800 pt-5">
          <p class="text-xs leading-5 text-stone-500">${title === "Contraseña actualizada" ? "Puedes cerrar esta página y volver a la app." : "El enlace de recuperación solo puede utilizarse una vez."}</p>
        </div>
      </section>
    </main>
  `;
}

function renderError(message: string) {
  renderFrame(
    "Enlace no válido",
    `<div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-stone-800 text-stone-400"><span aria-hidden="true" class="text-lg">!</span></div>
     <h1 class="text-2xl font-semibold tracking-tight text-stone-50">Enlace no válido</h1>
     <p class="mt-3 text-sm leading-6 text-stone-300">${message}</p>`,
  );
}

function renderSuccess() {
  renderFrame(
    "Contraseña actualizada",
    `<div id="success-animation" role="img" aria-label="Proceso completado" class="mb-5 h-40 w-40"></div>
     <h1 class="text-2xl font-semibold tracking-tight text-stone-50">Contraseña actualizada</h1>
     <p class="mt-3 text-sm leading-6 text-stone-300">Contraseña actualizada. Vuelve a la app e inicia sesión.</p>`,
  );
  playAnimation("success-animation", "success");
}

function visibilityButton(targetId: string) {
  return `<button type="button" data-password-target="${targetId}" aria-label="Mostrar contraseña" aria-pressed="false" class="absolute inset-y-0 right-2 grid w-11 place-items-center rounded-lg text-stone-400 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-amber-300">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.7"/></svg>
  </button>`;
}

function renderForm(client: SupabaseClient) {
  renderFrame(
    "Nueva contraseña",
    `<h1 class="text-2xl font-semibold tracking-tight text-stone-50">Crea una nueva contraseña</h1>
     <p class="mt-3 text-sm leading-6 text-stone-400">Elige una contraseña segura para proteger tu cuenta.</p>
     <form id="reset-form" class="mt-7 space-y-5" novalidate>
       <div>
         <label for="password" class="mb-2 block text-sm font-medium text-stone-200">Nueva contraseña</label>
         <div class="relative">
           <input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required class="w-full min-w-0 rounded-xl border border-stone-700 bg-stone-950 py-3 pl-4 pr-14 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" placeholder="Al menos 8 caracteres" />
           ${visibilityButton("password")}
         </div>
       </div>
       <div>
         <label for="password-confirm" class="mb-2 block text-sm font-medium text-stone-200">Confirma tu contraseña</label>
         <div class="relative">
           <input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" minlength="8" required class="w-full min-w-0 rounded-xl border border-stone-700 bg-stone-950 py-3 pl-4 pr-14 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" placeholder="Repite la contraseña" />
           ${visibilityButton("password-confirm")}
         </div>
       </div>
       <p id="form-message" role="status" aria-live="polite" class="min-h-5 text-sm text-rose-300"></p>
       <button id="submit-button" type="submit" class="flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-wait disabled:opacity-60">Actualizar contraseña</button>
     </form>`,
  );

  const form = document.querySelector<HTMLFormElement>("#reset-form");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");
  const confirmationInput = document.querySelector<HTMLInputElement>("#password-confirm");
  const message = document.querySelector<HTMLParagraphElement>("#form-message");
  const button = document.querySelector<HTMLButtonElement>("#submit-button");
  if (!form || !passwordInput || !confirmationInput || !message || !button) {
    throw new Error("No se pudo preparar el formulario de contraseña.");
  }

  form.querySelectorAll<HTMLButtonElement>("[data-password-target]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.dataset.passwordTarget;
      const input = targetId ? document.getElementById(targetId) : null;
      if (!(input instanceof HTMLInputElement)) {
        throw new Error("No se encontró el campo de contraseña asociado.");
      }

      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.setAttribute("aria-label", isVisible ? "Mostrar contraseña" : "Ocultar contraseña");
      toggle.setAttribute("aria-pressed", String(!isVisible));
      toggle.innerHTML = isVisible
        ? `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.7"/></svg>`
        : `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="m3 3 18 18M10.6 6.2A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.7M6.2 6.3C3.9 7.8 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = passwordInput.value;

    if (password.length < 8) {
      message.textContent = "La contraseña debe tener al menos 8 caracteres.";
      passwordInput.focus();
      return;
    }

    if (password !== confirmationInput.value) {
      message.textContent = "Las contraseñas no coinciden. Revísalas e inténtalo de nuevo.";
      confirmationInput.focus();
      return;
    }

    button.disabled = true;
    message.classList.remove("text-rose-300");
    message.classList.add("text-stone-400");
    message.textContent = "Actualizando tu contraseña…";

    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) {
        button.disabled = false;
        message.classList.remove("text-stone-400");
        message.classList.add("text-rose-300");
        message.textContent = "No se pudo actualizar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.";
        return;
      }

      const { error: signOutError } = await client.auth.signOut({ scope: "local" });
      if (signOutError) {
        button.disabled = false;
        message.classList.remove("text-stone-400");
        message.classList.add("text-rose-300");
        message.textContent =
          "La contraseña se actualizó, pero no se pudo cerrar la sesión temporal. Cierra esta página para terminar.";
        return;
      }

      renderSuccess();
    } catch {
      button.disabled = false;
      message.classList.remove("text-stone-400");
      message.classList.add("text-rose-300");
      message.textContent =
        "No se pudo completar la solicitud. Comprueba tu conexión e inténtalo otra vez.";
    }
  });
}

export async function renderResetPasswordPage() {
  renderLoadingAnimation("Preparando la recuperación de tu contraseña...");

  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  window.history.replaceState(null, "", window.location.pathname);

  if (!tokenHash || type !== "recovery") {
    renderError("El enlace expiró o ya fue usado. Solicita uno nuevo desde la app.");
    return;
  }

  try {
    const client = getSupabaseClient();
    // verifyOtp consume el token_hash de recuperación y crea la sesión temporal en memoria.
    const { error } = await client.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (error) {
      renderError("El enlace expiró o ya fue usado. Solicita uno nuevo desde la app.");
      return;
    }

    renderForm(client);
  } catch (error) {
    renderError(
      error instanceof Error && error.message.startsWith("Falta configurar")
        ? "El servicio de recuperación no está configurado. Inténtalo más tarde."
        : "El enlace expiró o ya fue usado. Solicita uno nuevo desde la app.",
    );
  }
}
