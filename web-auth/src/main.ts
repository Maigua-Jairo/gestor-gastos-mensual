import "./style.css";
import { renderConfirmPage } from "./pages/confirm";
import { renderResetPasswordPage } from "./pages/reset-password";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("No se encontró el contenedor de la página.");
}

switch (window.location.pathname.replace(/\/+$/, "") || "/") {
  case "/confirm":
    void renderConfirmPage();
    break;
  case "/reset-password":
    void renderResetPasswordPage();
    break;
  default:
    app.innerHTML = `
      <main class="grid min-h-screen place-items-center px-5 py-12">
        <section class="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/70 p-6 sm:p-9">
          <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">Gestor de gastos</p>
          <h1 class="mt-6 text-2xl font-semibold tracking-tight text-stone-50">Enlace de acceso</h1>
          <p class="mt-3 text-sm leading-6 text-stone-300">Abre el enlace de confirmación o recuperación que recibiste por correo.</p>
        </section>
      </main>
    `;
}
