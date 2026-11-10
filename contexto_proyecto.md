# Contexto completo del proyecto gestor-gastos-mensual


================================================
ARCHIVO: .claude/settings.json
================================================

{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


================================================
ARCHIVO: .github/modernize/java-upgrade/.gitignore
================================================


**/*


================================================
ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local
/web-auth/.env

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android

.vercel
.env*


================================================
ARCHIVO: .vercel/repo.json
================================================

{
  "remoteName": "origin",
  "projects": [
    {
      "id": "prj_jwS8uuZABh0NoZW0nAkCVEt0O4vo",
      "name": "gestor-gastos-mensual",
      "directory": "web-auth",
      "orgId": "team_EU1BVrlIPudvfCvvK2CR8apg"
    }
  ]
}


================================================
ARCHIVO: AGENTS.md
================================================

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


================================================
ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "gestor-gastos-mensual",
    "slug": "gestor-gastos-mensual",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "migestorgastos",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.jairo_maigua.gestorgastosmensual"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ],
      "expo-web-browser",
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  }
]);


================================================
ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ARCHIVO: metro.config.js
================================================

const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
});

================================================
ARCHIVO: package.json
================================================

{
  "name": "gestor-gastos-mensual",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.26",
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@supabase/supabase-js": "^2.119.0",
    "@tanstack/react-query": "^5.107.1",
    "async-storage": "^0.1.0",
    "expo": "~57.0.32",
    "expo-auth-session": "~57.0.16",
    "expo-constants": "~57.0.23",
    "expo-device": "~57.0.2",
    "expo-font": "~57.0.4",
    "expo-glass-effect": "~57.0.5",
    "expo-image": "~57.0.5",
    "expo-linking": "~57.0.13",
    "expo-router": "~57.0.30",
    "expo-secure-store": "~57.0.4",
    "expo-splash-screen": "~57.0.11",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.3",
    "expo-system-ui": "~57.0.4",
    "expo-vector-icons": "^10.0.1",
    "expo-web-browser": "~57.0.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-get-random-values": "~1.11.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-url-polyfill": "^4.0.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1",
    "tailwindcss": "^4.3.5",
    "uniwind": "^1.13.2"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~57.0.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}


================================================
ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
ARCHIVO: scripts/reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /src and /scripts directories to /example based on user input and creates a new /src/app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["src", "scripts"];
const exampleDir = "example";
const newAppDir = "src/app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /src/app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /src/app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 src/app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 src/app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        userInput === "y"
          ? `\n4. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
ARCHIVO: src/app/(auth)/auth/callback.tsx
================================================

import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { createSessionFromUrl } from '../../../lib/auth';

export default function AuthCallbackScreen() {
  const url = Linking.useLinkingURL();
  const router = useRouter();
  const [result, setResult] = useState<{ url: string; error: string | null } | null>(null);

  useEffect(() => {
    if (!url) return;

    let active = true;
    createSessionFromUrl(url)
      .then(() => {
        if (active) router.replace('/');
      })
      .catch((cause: unknown) => {
        if (active) {
          setResult({
            url,
            error: cause instanceof Error
              ? cause.message
              : 'No se pudo completar el inicio de sesión con Google.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [router, url]);

  const error = result?.url === url ? result.error : null;
  const isProcessing = Boolean(url) && result?.url !== url;

  return (
    <View className="flex-1 items-center justify-center bg-stone-950 px-6">
      {isProcessing || !url ? (
        <>
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text className="mt-4 text-center text-stone-200">
            Esperando la respuesta de Google...
          </Text>
        </>
      ) : error ? (
        <>
          <Text className="text-center text-stone-200">{error}</Text>
          <Link href="/(auth)/login" className="mt-6 text-amber-400">
            Volver al inicio de sesión
          </Link>
        </>
      ) : (
        <Text className="text-center text-stone-200">
          Inicio de sesión completado. Redirigiendo...
        </Text>
      )}
    </View>
  );
}


================================================
ARCHIVO: src/app/(auth)/forgot-password.tsx
================================================

import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { getAuthRedirectUrl } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetRequest = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      Alert.alert('Correo no válido', 'Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getAuthRedirectUrl('/reset-password'),
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (error) {
      Alert.alert(
        'No se pudo enviar el enlace',
        error instanceof Error ? error.message : 'Comprueba tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Recuperar contraseña</Text>
        <Text className="mt-2 text-sm text-stone-400">
          {emailSent
            ? 'Si existe una cuenta con ese correo, recibirás un enlace para crear una nueva contraseña.'
            : 'Ingresa el correo de tu cuenta y te enviaremos un enlace seguro.'}
        </Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="mb-4 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 text-stone-100"
          placeholder="Correo electrónico"
          placeholderTextColor="#78716c"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailSent(false);
          }}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handleResetRequest}
          disabled={loading}
          className="mb-4 items-center rounded-xl bg-amber-500 py-3.5 shadow-lg active:bg-amber-600"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-base font-bold text-stone-950">
              {emailSent ? 'Enviar otro enlace' : 'Enviar enlace de recuperación'}
            </Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="text-center text-stone-400">
          Volver a <Text className="font-bold text-amber-400">iniciar sesión</Text>
        </Link>
      </View>
    </View>
  );
}


================================================
ARCHIVO: src/app/(auth)/login.tsx
================================================

import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';
import { signInWithGoogle } from '../../lib/auth';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. Login con Correo y Contraseña
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error de Autenticación', error.message);
  };

const handleGoogleLogin = async () => {
  setGoogleLoading(true);
  try {
    await signInWithGoogle();
  } catch (e) {
    Alert.alert(
      'Error con Google',
      e instanceof Error ? e.message : 'Intenta de nuevo.'
    );
  } finally {
    setGoogleLoading(false);
  }
};
  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Control de Gastos</Text>
        <Text className="text-sm text-stone-400 mt-1">Inicia sesión para gestionar tus bloques del mes</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-4"
          placeholder="Correo electrónico"
          placeholderTextColor="#78716c"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-6"
          placeholder="Contraseña"
          placeholderTextColor="#78716c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleEmailLogin}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg active:bg-amber-600 mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={googleLoading}
          className="bg-stone-900 border border-stone-800 py-3.5 rounded-xl items-center flex-row justify-center gap-3"
        >
          {googleLoading ? (
            <ActivityIndicator color="#e7e5e4" />
          ) : (
            <Text className="text-stone-200 font-bold text-sm">Continuar con Google</Text>
          )}
        </TouchableOpacity>

        <Link href="./forgot-password" className="text-center text-amber-400">
          ¿Olvidaste tu contraseña?
        </Link>

        <Link href="/(auth)/register" className="text-center text-stone-400">
          ¿No tienes cuenta? <Text className="text-amber-400 font-bold">Regístrate aquí</Text>
        </Link>
      </View>
    </View>
  );
}

================================================
ARCHIVO: src/app/(auth)/register.tsx
================================================

import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from 'expo-router';
import { getAuthRedirectUrl } from '../../lib/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl('/confirm'),
        },
      });

      if (error) throw error;
      Alert.alert(
        'Revisa tu correo',
        'Te enviamos un enlace para confirmar tu cuenta. Al abrirlo, Vercel completará la confirmación.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error) {
      Alert.alert(
        'Error en Registro',
        error instanceof Error ? error.message : 'No se pudo crear la cuenta. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Crear Cuenta</Text>
        <Text className="text-sm text-stone-400 mt-1">Registra tu correo institucional o personal</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-4"
          placeholder="Correo electrónico"
          placeholderTextColor="#78716c"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-6"
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor="#78716c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg active:bg-amber-600 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Registrarse</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="text-center text-stone-400">
          ¿Ya tienes cuenta? <Text className="text-amber-400 font-bold">Inicia sesión</Text>
        </Link>
      </View>
    </View>
  );
}

================================================
ARCHIVO: src/app/(main)/add-expense.tsx
================================================

import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

export default function AddExpenseScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('basic_needs');
  const [loading, setLoading] = useState(false);

  const blocks = [
    { key: 'basic_needs', label: 'Necesidades Básicas' },
    { key: 'personal_needs', label: 'Necesidades Personales' },
    { key: 'luxuries', label: 'Lujos' },
    { key: 'savings', label: 'Ahorro' },
  ];

  const handleAddExpense = async () => {
    if (!activeMonth) {
      Alert.alert('Error', 'No hay un mes activo configurado.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!note.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Ingresa una descripción válida y un monto mayor a 0.');
      return;
    }

    setLoading(true);

    // 1. Obtener el usuario autenticado actual para satisfacer el RLS de Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error de Sesión', 'No se pudo identificar al usuario autenticado.');
      return;
    }

    // 2. Insertar enviando explícitamente el user_id y la nota
    const { error } = await supabase.from('expenses').insert({
      user_id: user.id, // <-- Crítico para superar el RLS
      month_id: activeMonth.id,
      block: selectedBlock,
      note: note.trim(),
      amount: numericAmount,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error al registrar gasto', error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['budget_details'] });
      Alert.alert('Éxito', 'Gasto registrado correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12">
      <Text className="text-2xl font-bold text-amber-400 mb-1">Registrar Gasto</Text>
      <Text className="text-sm text-stone-400 mb-6">Asigna el consumo a uno de tus bloques presupuestarios.</Text>

      {/* Selector de Bloques */}
      <Text className="text-stone-300 font-semibold mb-2 text-sm">Seleccionar Bloque</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {blocks.map((b) => (
          <TouchableOpacity
            key={b.key}
            onPress={() => setSelectedBlock(b.key)}
            className={`py-2 px-4 rounded-xl border ${selectedBlock === b.key ? 'bg-amber-500 border-amber-500' : 'bg-stone-900 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${selectedBlock === b.key ? 'text-stone-950' : 'text-stone-300'}`}>
              {b.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input de Descripción / Nota */}
      <View className="mb-6">
        <Text className="text-stone-300 text-sm mb-1">Descripción del Gasto</Text>
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
          placeholder="Ej. Almuerzo universitario, pasajes..."
          placeholderTextColor="#78716c"
          value={note}
          onChangeText={setNote}
        />
      </View>

      {/* Input de Monto */}
      <View className="mb-8">
        <Text className="text-stone-300 text-sm mb-1">Monto (USD)</Text>
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
          placeholder="0.00"
          placeholderTextColor="#78716c"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <TouchableOpacity
        onPress={handleAddExpense}
        disabled={loading}
        className="bg-amber-500 py-4 rounded-xl items-center shadow-lg"
      >
        {loading ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text className="text-stone-950 font-bold text-base">Guardar Gasto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

================================================
ARCHIVO: src/app/(main)/expenses.tsx
================================================

import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function ExpensesScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const blockLabels: Record<string, string> = {
    basic_needs: 'Necesidades Básicas',
    personal_needs: 'Necesidades Personales',
    luxuries: 'Lujos',
    savings: 'Ahorro',
  };

  const blockColors: Record<string, string> = {
    basic_needs: 'text-amber-400',
    personal_needs: 'text-sky-400',
    luxuries: 'text-purple-400',
    savings: 'text-emerald-400',
  };

  const handleDeleteExpense = (expenseId: string, expenseNote: string) => {
    Alert.alert(
      'Eliminar Gasto',
      `¿Estás seguro de que deseas eliminar "${expenseNote}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(expenseId);
            const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
            setDeletingId(null);

            if (error) {
              Alert.alert('Error', 'No se pudo eliminar el gasto: ' + error.message);
            } else {
              // Invalidar caché para refrescar totales en el dashboard y listado
              queryClient.invalidateQueries({ queryKey: ['budget_details'] });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  const expenses = budgetData?.expenses || [];

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-12">
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Historial de Gastos</Text>
          <Text className="text-sm text-stone-400">Transacciones del mes en curso</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl"
        >
          <Text className="text-stone-200 text-xs font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Listado de Gastos */}
      {expenses.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-20">
          <Text className="text-stone-400 text-center text-base mb-2">No hay gastos registrados este mes.</Text>
          <Text className="text-stone-600 text-center text-xs">Usa el botón "+ Nuevo Gasto" desde el dashboard para empezar.</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isDeleting = deletingId === item.id;
            return (
              <View className="bg-stone-900 border border-stone-800 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <Text className="text-stone-100 font-bold text-base mb-0.5">{item.note}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-xs font-semibold ${blockColors[item.block] || 'text-stone-400'}`}>
                      {blockLabels[item.block] || item.block}
                    </Text>
                    <Text className="text-stone-600 text-xs">•</Text>
                    <Text className="text-stone-500 text-xs">{item.expense_date}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-rose-400 font-bold text-base mb-1">-${Number(item.amount).toFixed(2)}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(item.id, item.note)}
                    disabled={isDeleting}
                    className="bg-stone-950 border border-stone-800 px-2.5 py-1 rounded-lg"
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#f43f5e" />
                    ) : (
                      <Text className="text-rose-500 text-xs font-semibold">Eliminar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

================================================
ARCHIVO: src/app/(main)/index.tsx
================================================

import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter, Link } from 'expo-router';
export default function DashboardScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  // Si el mes no ha sido configurado, mostrar opción para ir al setup
  if (!activeMonth || !budgetData || budgetData.income === 0) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-amber-400 mb-2 text-center">Sin Presupuesto Activo</Text>
        <Text className="text-stone-400 text-center mb-6">
          Aún no has configurado los ingresos y bloques para este mes.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/setup-month')}
          className="bg-amber-500 py-3.5 px-6 rounded-xl shadow-lg"
        >
          <Text className="text-stone-950 font-bold text-base">Configurar Mes Actual</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { income, budgets, expenses } = budgetData;

  // Calcular el total gastado por bloque sumando los gastos asociados
  const blockTotals: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    blockTotals[exp.block] = (blockTotals[exp.block] || 0) + Number(exp.amount);
  });

  const totalSpent = Object.values(blockTotals).reduce((acc, val) => acc + val, 0);
  const totalAllocated = budgets.reduce((acc: number, b: any) => acc + Number(b.allocated_amount), 0);
  const unallocatedMoney = income - totalAllocated;

  const blockLabels: Record<string, string> = {
    basic_needs: 'Necesidades Básicas',
    personal_needs: 'Necesidades Personales',
    luxuries: 'Lujos',
    savings: 'Ahorro',
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12 pb-10">
      {/* Cabecera con enlace al Perfil */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-sm text-stone-400">Mes en curso ({currentMonth}/{currentYear})</Text>
          <Text className="text-2xl font-bold text-amber-400">Gestor de Gastos</Text>
        </View>
        <Link href="/profile" className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl">
          <Text className="text-stone-200 text-xs font-semibold">Perfil</Text>
        </Link>
      </View>

      {/* Tarjeta de Resumen Financiero */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6 shadow-md">
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-stone-400 text-xs">Ingreso Total</Text>
            <Text className="text-lg font-bold text-stone-100">${Number(income).toFixed(2)}</Text>
          </View>
          <View>
            <Text className="text-stone-400 text-xs">Gasto Total</Text>
            <Text className="text-lg font-bold text-rose-400">${totalSpent.toFixed(2)}</Text>
          </View>
        </View>
        <View className="border-t border-stone-800 pt-3 flex-row justify-between items-center">
          <Text className="text-stone-400 text-xs">Dinero No Asignado:</Text>
          <Text className="text-amber-400 font-bold">${unallocatedMoney.toFixed(2)}</Text>
        </View>
      </View>

      {/* Barra de Acciones Principales */}
      <View className="flex-row gap-3 mb-3">
        <TouchableOpacity
          onPress={() => router.push('/setup-month')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Editar Presupuesto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/add-expense')}
          className="flex-1 bg-amber-500 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-950 font-bold text-sm">+ Nuevo Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de Navegación Secundaria (Ahorros e Historial) */}
      <View className="flex-row gap-3 mb-8">
        <TouchableOpacity
          onPress={() => router.push('/savings')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Ahorros 💰</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/expenses')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Historial 📋</Text>
        </TouchableOpacity>
      </View>

      {/* Listado de Bloques de Presupuesto */}
      <Text className="text-lg font-bold text-stone-200 mb-4">Bloques del Mes</Text>
      <View className="space-y-4 mb-8">
        {budgets.map((b: any) => {
          const spent = blockTotals[b.block] || 0;
          const allocated = Number(b.allocated_amount);
          const percentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
          const isOverBudget = spent > allocated;

          return (
            <View key={b.id} className="bg-stone-900 border border-stone-800 p-4 rounded-2xl mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-stone-200 font-bold text-base">{blockLabels[b.block] || b.block}</Text>
                <Text className="text-xs text-stone-400">
                  <Text className={isOverBudget ? 'text-rose-400 font-bold' : 'text-stone-200'}>${spent.toFixed(2)}</Text> / ${allocated.toFixed(2)}
                </Text>
              </View>

              {/* Barra de Progreso */}
              <View className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <View
                  style={{ width: `${percentage}%` }}
                  className={`h-full ${isOverBudget ? 'bg-rose-500' : 'bg-amber-400'}`}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

================================================
ARCHIVO: src/app/(main)/profile.tsx
================================================

import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../provider/AuthProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario ingresó por proveedor externo (Google)
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  const handleUpdatePassword = async () => {
    if (isGoogleUser) {
      Alert.alert('Acceso restringido', 'Iniciaste sesión con Google. No tienes una contraseña asociada en el sistema.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      Alert.alert('Error al actualizar', error.message);
    } else {
      Alert.alert('¡Éxito!', 'Contraseña actualizada correctamente.');
      setNewPassword('');
    }
  };

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-16">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-amber-400">Perfil de Usuario</Text>
        <Text className="text-sm text-stone-400 mt-1">{user?.email}</Text>
      </View>

      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6">
        <Text className="text-stone-200 font-semibold mb-2">Método de Autenticación:</Text>
        <Text className="text-stone-400 text-sm mb-4">
          {isGoogleUser ? 'Google OAuth (Sin contraseña local)' : 'Correo y Contraseña'}
        </Text>

        {!isGoogleUser ? (
          <>
            <Text className="text-stone-300 text-sm mb-2">Cambiar Contraseña</Text>
            <TextInput
              className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-4"
              placeholder="Nueva contraseña"
              placeholderTextColor="#78716c"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={handleUpdatePassword}
              disabled={loading}
              className="bg-amber-500 py-3 rounded-xl items-center"
            >
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text className="text-stone-950 font-bold">Actualizar Contraseña</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View className="bg-stone-950/50 p-4 rounded-xl border border-amber-500/20">
            <Text className="text-amber-400 text-xs font-semibold">
              Tu cuenta está vinculada a Google. La gestión de credenciales depende de tu proveedor externo.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={signOut}
        className="bg-rose-500/10 border border-rose-500/30 py-3.5 rounded-xl items-center mt-auto mb-8"
      >
        <Text className="text-rose-400 font-bold text-base">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

================================================
ARCHIVO: src/app/(main)/savings.tsx
================================================

import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function SavingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [loading, setLoading] = useState(false);

  // Consultar los movimientos de ahorro del usuario autenticado
  const { data: savingsData = [], isLoading } = useQuery({
    queryKey: ['savings_movements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No usuario autenticado');

      const { data, error } = await supabase
        .from('savings_movements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calcular el balance total de ahorros
  const totalSavings = savingsData.reduce((acc: number, item: any) => {
    const val = Number(item.amount);
    return item.type === 'deposit' ? acc + val : acc - val;
  }, 0);

  const handleSaveMovement = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0.');
      return;
    }

    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    const { error } = await supabase.from('savings_movements').insert({
      user_id: user.id,
      type: movementType,
      amount: numericAmount,
      note: note.trim() || (movementType === 'deposit' ? 'Depósito a ahorros' : 'Retiro de emergencia'),
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setAmount('');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['savings_movements'] });
      Alert.alert('Éxito', 'Movimiento registrado correctamente.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12 pb-10">
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Fondo de Ahorro</Text>
          <Text className="text-sm text-stone-400">Controla tus depósitos y retiros</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl"
        >
          <Text className="text-stone-200 text-xs font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Balance Total de Ahorros */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6 shadow-md items-center">
        <Text className="text-stone-400 text-xs mb-1">Ahorro Acumulado Total</Text>
        <Text className={`text-3xl font-bold ${totalSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          ${totalSavings.toFixed(2)}
        </Text>
      </View>

      {/* Formulario de Nuevo Movimiento */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6">
        <Text className="text-stone-200 font-bold text-base mb-4">Registrar Movimiento</Text>

        {/* Selector de Tipo (Depósito / Retiro) */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => setMovementType('deposit')}
            className={`flex-1 py-2.5 rounded-xl border items-center ${movementType === 'deposit' ? 'bg-emerald-500 border-emerald-500' : 'bg-stone-950 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${movementType === 'deposit' ? 'text-stone-950' : 'text-stone-300'}`}>
              Depósito 📥
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMovementType('withdrawal')}
            className={`flex-1 py-2.5 rounded-xl border items-center ${movementType === 'withdrawal' ? 'bg-rose-500 border-rose-500' : 'bg-stone-950 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${movementType === 'withdrawal' ? 'text-stone-950' : 'text-stone-300'}`}>
              Retiro 📤
            </Text>
          </TouchableOpacity>
        </View>

        {/* Monto */}
        <View className="mb-4">
          <Text className="text-stone-300 text-sm mb-1">Monto (USD)</Text>
          <TextInput
            className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Nota opcional */}
        <View className="mb-6">
          <Text className="text-stone-300 text-sm mb-1">Motivo / Nota (Opcional)</Text>
          <TextInput
            className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="Ej. Aporte quincenal, emergencia médica..."
            placeholderTextColor="#78716c"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveMovement}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Guardar Movimiento</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Historial de Movimientos de Ahorro */}
      <Text className="text-lg font-bold text-stone-200 mb-3">Historial de Ahorros</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="#fbbf24" />
      ) : savingsData.length === 0 ? (
        <Text className="text-stone-500 text-xs">No hay movimientos de ahorro registrados.</Text>
      ) : (
        savingsData.map((item: any) => {
          const isDeposit = item.type === 'deposit';
          return (
            <View key={item.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl mb-3 flex-row justify-between items-center">
              <View className="flex-1 mr-3">
                <Text className="text-stone-100 font-bold text-sm mb-0.5">{item.note}</Text>
                <Text className="text-stone-500 text-xs">{item.created_at.split('T')[0]}</Text>
              </View>
              <Text className={`font-bold text-base ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isDeposit ? '+' : '-'}${Number(item.amount).toFixed(2)}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

================================================
ARCHIVO: src/app/(main)/setup-month.tsx
================================================

import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter } from 'expo-router';

export default function SetupMonthScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1 - 12

  const { budgetData, setupMonth, isSettingUp } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();

  const [totalIncome, setTotalIncome] = useState('');
  const [basicNeeds, setBasicNeeds] = useState('');
  const [personalNeeds, setPersonalNeeds] = useState('');
  const [luxuries, setLuxuries] = useState('');
  const [savings, setSavings] = useState('');

  // Rellenar datos existentes si ya configuró el mes
  useEffect(() => {
    if (budgetData && budgetData.income > 0) {
      setTotalIncome(budgetData.income.toString());
      const bMap = new Map(budgetData.budgets.map((b: any) => [b.block, b.allocated_amount.toString()]));
      setBasicNeeds(bMap.get('basic_needs') || '');
      setPersonalNeeds(bMap.get('personal_needs') || '');
      setLuxuries(bMap.get('luxuries') || '');
      setSavings(bMap.get('savings') || '');
    }
  }, [budgetData]);

  // Regla de negocio: Sugerir el 15% de ahorro automáticamente al cambiar el ingreso total
  const handleIncomeChange = (text: string) => {
    setTotalIncome(text);
    const numericIncome = parseFloat(text);
    if (!isNaN(numericIncome) && numericIncome > 0) {
      const suggestedSavings = (numericIncome * 0.15).toFixed(2);
      setSavings(suggestedSavings);
    } else {
      setSavings('');
    }
  };

  // Cálculo en tiempo real del dinero no asignado
  const incomeNum = parseFloat(totalIncome) || 0;
  const basicNum = parseFloat(basicNeeds) || 0;
  const personalNum = parseFloat(personalNeeds) || 0;
  const luxuriesNum = parseFloat(luxuries) || 0;
  const savingsNum = parseFloat(savings) || 0;

  const totalAllocated = basicNum + personalNum + luxuriesNum + savingsNum;
  const unallocatedAmount = incomeNum - totalAllocated;

  const handleSave = async () => {
    if (incomeNum <= 0) {
      Alert.alert('Error', 'Ingresa un monto de ingreso mensual válido.');
      return;
    }

    if (unallocatedAmount < 0) {
      Alert.alert('Presupuesto excedido', 'La suma de los cuatro bloques supera tu ingreso total.');
      return;
    }

    try {
      await setupMonth({
        totalIncome: incomeNum,
        allocations: [
          { block: 'basic_needs', amount: basicNum },
          { block: 'personal_needs', amount: personalNum },
          { block: 'luxuries', amount: luxuriesNum },
          { block: 'savings', amount: savingsNum },
        ],
      });
      Alert.alert('¡Éxito!', 'Presupuesto mensual configurado correctamente.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12">
      <Text className="text-2xl font-bold text-amber-400 mb-1">Presupuesto del Mes</Text>
      <Text className="text-sm text-stone-400 mb-6">Distribuye tus ingresos en los 4 bloques obligatorios.</Text>

      {/* Ingreso Total */}
      <View className="mb-6 bg-stone-900 border border-stone-800 p-4 rounded-2xl">
        <Text className="text-stone-300 font-semibold mb-2">Ingreso Total del Mes (USD)</Text>
        <TextInput
          className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
          placeholder="0.00"
          placeholderTextColor="#78716c"
          keyboardType="numeric"
          value={totalIncome}
          onChangeText={handleIncomeChange}
        />
      </View>

      {/* Bloques de Presupuesto */}
      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-stone-300 text-sm mb-1">1. Necesidades Básicas</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={basicNeeds}
            onChangeText={setBasicNeeds}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">2. Necesidades Personales</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={personalNeeds}
            onChangeText={setPersonalNeeds}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">3. Lujos</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={luxuries}
            onChangeText={setLuxuries}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">4. Ahorro (Sugerido 15%)</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-amber-400 px-4 py-3 rounded-xl font-bold"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={savings}
            onChangeText={setSavings}
          />
        </View>
      </View>

      {/* Indicador de Monto No Asignado */}
      <View className={`p-4 rounded-xl mb-6 border ${unallocatedAmount < 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-stone-900 border-stone-800'}`}>
        <Text className="text-xs text-stone-400">Dinero pendiente por asignar:</Text>
        <Text className={`text-xl font-bold ${unallocatedAmount < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
          ${unallocatedAmount.toFixed(2)} USD
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={isSettingUp}
        className="bg-amber-500 py-4 rounded-xl items-center mb-12 shadow-lg"
      >
        {isSettingUp ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text className="text-stone-950 font-bold text-base">Guardar Presupuesto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

================================================
ARCHIVO: src/app/_layout.tsx
================================================

import '../../global.css';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../provider/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}

================================================
ARCHIVO: src/components/animated-icon.tsx
================================================

import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const image = <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />;

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});


================================================
ARCHIVO: src/components/animated-icon.web.tsx
================================================

import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';

import classes from './animated-icon.module.css';
const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
});


================================================
ARCHIVO: src/components/app-tabs.tsx
================================================

import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}


================================================
ARCHIVO: src/components/app-tabs.web.tsx
================================================

import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});


================================================
ARCHIVO: src/components/external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
ARCHIVO: src/components/hint-row.tsx
================================================

import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});


================================================
ARCHIVO: src/components/themed-text.tsx
================================================

import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});


================================================
ARCHIVO: src/components/themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}


================================================
ARCHIVO: src/components/ui/collapsible.tsx
================================================

import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <ThemedView type="backgroundElement" style={styles.button}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={theme.text}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    marginLeft: Spacing.four,
    padding: Spacing.four,
  },
});


================================================
ARCHIVO: src/components/web-badge.tsx
================================================

import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});


================================================
ARCHIVO: src/constants/theme.ts
================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;


================================================
ARCHIVO: src/hooks/use-color-scheme.ts
================================================

export { useColorScheme } from 'react-native';


================================================
ARCHIVO: src/hooks/use-color-scheme.web.ts
================================================

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}


================================================
ARCHIVO: src/hooks/use-theme.ts
================================================

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}


================================================
ARCHIVO: src/hooks/useMonthlyBudget.ts
================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../provider/AuthProvider';

export function useMonthlyBudget(year: number, month: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Obtener o verificar si existe el mes activo para el usuario
  const { data: activeMonth, isLoading: loadingMonth } = useQuery({
    queryKey: ['month', year, month, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('months')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = No rows found
      return data;
    },
    enabled: !!user,
  });

  // 2. Obtener el ingreso y los presupuestos de los 4 bloques si el mes existe
  const { data: budgetData, isLoading: loadingBudgets } = useQuery({
    queryKey: ['budget_details', activeMonth?.id],
    queryFn: async () => {
      if (!activeMonth) return null;

      const [incomeRes, budgetsRes, expensesRes] = await Promise.all([
        supabase.from('incomes').select('*').eq('month_id', activeMonth.id).single(),
        supabase.from('budgets').select('*').eq('month_id', activeMonth.id),
        supabase.from('expenses').select('*').eq('month_id', activeMonth.id),
      ]);

      return {
        income: incomeRes.data?.total_amount || 0,
        budgets: budgetsRes.data || [],
        expenses: expensesRes.data || [],
      };
    },
    enabled: !!activeMonth,
  });

  // 3. Mutación para inicializar el mes, ingreso y los 4 bloques (incluyendo el 15% de ahorro sugerido)
  const setupMonthMutation = useMutation({
    mutationFn: async ({ totalIncome, allocations }: { totalIncome: number; allocations: { block: string; amount: number }[] }) => {
      if (!user) throw new Error('No usuario autenticado');

      // A. Crear o asegurar el mes
      let monthId = activeMonth?.id;
      if (!monthId) {
        const { data: newMonth, error: monthError } = await supabase
          .from('months')
          .insert({ user_id: user.id, year, month, is_active: true })
          .select()
          .single();
        if (monthError) throw monthError;
        monthId = newMonth.id;
      }

      // B. Registrar ingreso total
      const { error: incomeError } = await supabase
        .from('incomes')
        .upsert({ user_id: user.id, month_id: monthId, total_amount: totalIncome }, { onConflict: 'month_id' });
      if (incomeError) throw incomeError;

      // C. Registrar los bloques de presupuesto
      const budgetPayload = allocations.map((item) => ({
        user_id: user.id,
        month_id: monthId,
        block: item.block,
        allocated_amount: item.amount,
      }));

      const { error: budgetsError } = await supabase
        .from('budgets')
        .upsert(budgetPayload, { onConflict: 'month_id,block' });
      if (budgetsError) throw budgetsError;

      return monthId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month', year, month] });
      queryClient.invalidateQueries({ queryKey: ['budget_details'] });
    },
  });

  return {
    activeMonth,
    budgetData,
    isLoading: loadingMonth || loadingBudgets,
    setupMonth: setupMonthMutation.mutateAsync,
    isSettingUp: setupMonthMutation.isPending,
  };
}

================================================
ARCHIVO: src/lib/auth.ts
================================================

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

let lastCode: string | null = null;

export function getAuthRedirectUrl(path: '/confirm' | '/reset-password') {
  const configuredUrl = process.env.EXPO_PUBLIC_AUTH_WEB_URL?.trim();
  if (!configuredUrl) {
    throw new Error('Falta configurar EXPO_PUBLIC_AUTH_WEB_URL con la URL del sitio de autenticación en Vercel.');
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredUrl);
  } catch {
    throw new Error('EXPO_PUBLIC_AUTH_WEB_URL debe ser una URL válida del sitio de autenticación en Vercel.');
  }

  if (
    baseUrl.protocol !== 'https:' &&
    !(baseUrl.protocol === 'http:' && baseUrl.hostname === 'localhost')
  ) {
    throw new Error('EXPO_PUBLIC_AUTH_WEB_URL debe usar HTTPS.');
  }

  return new URL(path, baseUrl.origin).toString();
}

export async function createSessionFromUrl(url: string) {
  const { queryParams } = Linking.parse(url);
  const code = queryParams?.code;
  console.log('[AUTH] procesando URL:', url);
  if (typeof code === 'string') {
    if (code === lastCode) return;
    lastCode = code;
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }
const { data: s } = await supabase.auth.getSession();
console.log('[AUTH] sesión activa:', !!s.session);
  // Respaldo por si devuelve tokens en el fragmento
  const fragment = url.split('#')[1];
  if (fragment) {
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) throw error;
    }
  }
}

export async function signInWithGoogle() {
  try {
    const redirectTo = Linking.createURL('/auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('Supabase no devolvió la URL de Google');

    // Abre el navegador OAuth
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
console.log('[AUTH] resultado del navegador:', result.type, 'url' in result ? result.url : '');
    // Si el navegador devuelve la URL de éxito directamente, la procesamos
    if (result && result.type === 'success' && result.url) {
      await createSessionFromUrl(result.url);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Ocurrió un error al iniciar sesión con Google.');
  }
}

function utilsVerifyResult(result: any) {
  return result;
}

================================================
ARCHIVO: src/lib/supabase.ts
================================================

import 'react-native-get-random-values';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
const WebStorageAdapter = {
  getItem: async (key: string): Promise<string | null> =>
    typeof document === 'undefined' ? null : AsyncStorage.getItem(key),
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof document !== 'undefined') await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof document !== 'undefined') await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: Platform.OS === 'web' ? WebStorageAdapter : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);
// Control automático para refrescar tokens cuando la app vuelve a primer plano
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

================================================
ARCHIVO: src/provider/AuthProvider.tsx
================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';
import * as Linking from 'expo-linking';
import { createSessionFromUrl } from '../lib/auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ session: null, user: null, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Manejar deep links cuando la app recibe la redirección del navegador OAuth
    const handleDeepLink = async (event: { url: string }) => {
      try {
        await createSessionFromUrl(event.url);
      } catch (error) {
        console.error('Error al procesar el deep link:', error);
      }
    };

    const urlListener = Linking.addEventListener('url', handleDeepLink);

    // 2. Verificar si la app se abrió inicialmente mediante una URL de redirección
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        try {
          await createSessionFromUrl(url);
        } catch (error) {
          console.error('Error al procesar initial URL:', error);
        }
      }
    });

    // 3. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 4. Suscribirse a cambios de estado de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      urlListener.remove();
      subscription.unsubscribe();
    };
  }, []);

  // 5. Protección y redirección de rutas con Expo Router
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(main)');
    }
  }, [session, segments, isLoading]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

================================================
ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}


================================================
ARCHIVO: uniwind-types.d.ts
================================================

// NOTE: This file is generated by uniwind and it should not be edited manually.
/// <reference types="uniwind/types" />

declare module 'uniwind' {
    export interface UniwindConfig {
        themes: readonly ['light', 'dark']
    }
}

export {}


================================================
ARCHIVO: web-auth/package.json
================================================

{
  "name": "gestor-gastos-auth-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.119.0",
    "vercel": "^65.12.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "tailwindcss": "^4.1.13",
    "typescript": "^5.9.3",
    "vite": "^7.1.12"
  }
}


================================================
ARCHIVO: web-auth/README.md
================================================

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


================================================
ARCHIVO: web-auth/src/lib/supabase.ts
================================================

import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en las variables de entorno.",
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}


================================================
ARCHIVO: web-auth/src/main.ts
================================================

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


================================================
ARCHIVO: web-auth/src/pages/confirm.ts
================================================

import { getSupabaseClient } from "../lib/supabase";

const icon = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-6 w-6"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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
        <div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl ${success ? "bg-amber-400/10 text-amber-400" : "bg-stone-800 text-stone-400"}">
          ${success ? icon : `<span aria-hidden="true" class="text-lg">!</span>`}
        </div>
        <h1 class="text-2xl font-semibold tracking-tight text-stone-50">${success ? "Cuenta confirmada" : "No se pudo confirmar"}</h1>
        <p class="mt-3 text-sm leading-6 text-stone-300">${message}</p>
        <div class="mt-8 border-t border-stone-800 pt-5">
          <p class="text-xs leading-5 text-stone-500">Puedes cerrar esta página y continuar desde la app.</p>
        </div>
      </section>
    </main>
  `;
}

export async function renderConfirmPage() {
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


================================================
ARCHIVO: web-auth/src/pages/reset-password.ts
================================================

import { getSupabaseClient } from "../lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

const checkIcon = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-6 w-6"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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
    `<div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/10 text-amber-400">${checkIcon}</div>
     <h1 class="text-2xl font-semibold tracking-tight text-stone-50">Contraseña actualizada</h1>
     <p class="mt-3 text-sm leading-6 text-stone-300">Contraseña actualizada. Vuelve a la app e inicia sesión.</p>`,
  );
}

function renderForm(client: SupabaseClient) {
  renderFrame(
    "Nueva contraseña",
    `<h1 class="text-2xl font-semibold tracking-tight text-stone-50">Crea una nueva contraseña</h1>
     <p class="mt-3 text-sm leading-6 text-stone-400">Elige una contraseña segura para proteger tu cuenta.</p>
     <form id="reset-form" class="mt-7 space-y-5" novalidate>
       <div>
         <label for="password" class="mb-2 block text-sm font-medium text-stone-200">Nueva contraseña</label>
         <input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required class="w-full min-w-0 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" placeholder="Al menos 8 caracteres" />
       </div>
       <div>
         <label for="password-confirm" class="mb-2 block text-sm font-medium text-stone-200">Confirma tu contraseña</label>
         <input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" minlength="8" required class="w-full min-w-0 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20" placeholder="Repite la contraseña" />
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


================================================
ARCHIVO: web-auth/tsconfig.json
================================================

{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}


================================================
ARCHIVO: web-auth/vercel.json
================================================

{
  "rewrites": [
    { "source": "/confirm", "destination": "/index.html" },
    { "source": "/reset-password", "destination": "/index.html" }
  ]
}


================================================
ARCHIVO: web-auth/vite.config.ts
================================================

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
