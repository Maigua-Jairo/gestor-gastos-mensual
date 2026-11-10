import loadingAnimation from "../../../assets/animaciones/Loading sand clock.json";
import successAnimation from "../../../assets/animaciones/Succes 1.json";

type AnimationName = "loading" | "success";

const animationData = {
  loading: loadingAnimation,
  success: successAnimation,
};

export async function playAnimation(containerId: string, name: AnimationName) {
  try {
    const { default: lottie } = await import("lottie-web");
    const container = document.getElementById(containerId);
    if (!container) return;

    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: name === "loading",
      autoplay: true,
      animationData: animationData[name],
    });

    animation.addEventListener("data_failed", () => {
      console.error(`No se pudo cargar la animación "${name}".`);
    });
  } catch (error) {
    console.error(`No se pudo reproducir la animación "${name}".`, error);
  }
}

export function renderLoadingAnimation(message: string) {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) throw new Error("No se encontró el contenedor de la página.");

  app.innerHTML = `
    <main class="grid min-h-screen place-items-center px-5 py-12">
      <section class="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/70 p-6 text-center sm:p-9">
        <div id="loading-animation" role="img" aria-label="Cargando" class="mx-auto h-48 w-48"></div>
        <p class="text-sm leading-6 text-stone-300">${message}</p>
      </section>
    </main>
  `;
  void playAnimation("loading-animation", "loading");
}
