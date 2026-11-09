# Confirmación y recuperación de cuenta

Sitio estático para verificar los enlaces de correo de Supabase y permitir que los usuarios creen una nueva contraseña. No requiere backend: utiliza el cliente de Supabase desde el navegador con la clave pública `anon`.

## Instalación local

Se requiere Node.js 20.19+ o 22.12+.

```bash
cd web-auth
npm install
```

Copia `.env.example` a `.env` y rellena las variables:

```dotenv
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Para validar y generar la versión de producción:

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. En la configuración del proyecto, establece `web-auth` como **Root Directory**.
3. Usa los valores predeterminados: comando de build `npm run build` y directorio de salida `dist`.
4. En **Settings → Environment Variables**, añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para los entornos que vayas a desplegar.
5. Despliega el proyecto. `vercel.json` reescribe las rutas `/confirm` y `/reset-password` para que Vercel sirva la aplicación.

En la configuración de entorno de la app móvil (y en el entorno de compilación de EAS si aplica), define también la URL base de este despliegue:

```dotenv
EXPO_PUBLIC_AUTH_WEB_URL=https://<tu-app>.vercel.app
```

Usa solo el dominio, sin `/confirm` ni `/reset-password`. La app añade esas rutas al registrar una cuenta y al solicitar la recuperación, respectivamente.

## Configuración de Supabase

En **Authentication → URL Configuration → Redirect URLs**, añade la URL del despliegue para permitir las dos rutas:

```text
https://<tu-app>.vercel.app/**
```

Configura las plantillas en **Authentication → Email Templates** para que cada correo dirija a la ruta de Vercel indicada por la app y pase el token hash:

- **Confirmación**: `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email`
- **Recuperación de contraseña**: `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery`

Si tu proyecto utiliza el tipo `signup` en sus correos de confirmación, también es aceptado por la ruta `/confirm`.

La clave `anon` está diseñada para uso en el cliente; nunca configures ni incluyas una clave `service_role` en este sitio.
