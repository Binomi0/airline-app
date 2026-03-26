# Contexto y Arquitectura de WeiFly para Aplicación Electron (Flight Tracker)

Este documento centraliza todo el contexto necesario del proyecto **WeiFly** (WebApp) para poder continuar sin fricciones con el desarrollo de la aplicación de escritorio (Electron + MSFS SDK).

## 1. Visión General del Proyecto (WeiFly)

WeiFly es una aerolínea virtual descentralizada (DVA) operada en la red Arbitrum y ligada íntimamente a la red de IVAO. Su núcleo es un sistema Play-to-Earn realista y justificado, con una economía de doble token:

- **$AIRL (Value/Governance):** Recompensa de los vuelos. Permite la compra de activos (licencias, aviones hangar).
- **$AIRG (Utility/Fuel):** Combustible para volar. Se obtiene haciendo staking de AIRL (1 AIRL = 100 AIRG/día). Se quema irrevocablemente al volar.

**El Flujo:**

1. El piloto tiene una _licencia_ y aviones en su hangar.
2. La plataforma le asigna o le permite elegir un vuelo, reservando gasolina y dándole un **callsign** específico.
3. El piloto hace el vuelo en Microsoft Flight Simulator (2020 o 2024).
4. **[El Tracker Electron]** monitorea todo este proceso de principio a fin, valida su autenticidad y reporta la telemetría al backend.
5. Al aterrizar y procesarse, se quema la gasolina correspondiente ($AIRG) y se recompensa con $AIRL.

## 2. El Problema Crítico: Evitar el Abuso y Hacks

Dado que volar recompensa tokens reales ($AIRL), el incentivo para hackear o automatizar el vuelo (farming bot, manipular telemetría) es **muy alto**. El backend por sí solo no puede saber qué pasa en el simulador; todo depende de la información de la aplicación Electron.

Por lo tanto, la aplicación Electron **NO es solo un rastreador pasivo, es un sistema anti-cheat.**

### 2.1. Telemetría Estricta desde el SDK (SimConnect o WebAssembly)

El app de Electron se comunicará con MSFS. Los datos mínimos a monitorear y cruzar constantemente son:

- **Estado de Motores (N1 / RPM)** y consumo real de combustible por hora.
- **Posición (Lat/Lon) y Altitud (MSL y AGL).**
- **Slew Mode State:** Determinar si el usuario está haciendo "teletransporte".
- **Simulation Time Rate:** El "Sim Rate" tiene que ser estrictamente `1.0x`. Las aceleraciones de tiempo deben penalizarse o invalidar el vuelo.
- **Estado de Componentes:** Gear (Tren de aterrizaje), Flaps, Parking Brake, Weight On Wheels (WOW).

### 2.2. Heurísticas de Anti-Bot y Anti-Abuso recomendadas:

- **Micro-fluctuaciones:** El viento y la aerodinámica causan variaciones continuas minúsculas en heading y pitch. Si estos valores están estáticos o matemáticamente perfectos, podría ser un script inyectando telemetría fake.
- **Chequeo de Teletransporte:** Si la distancia entre dos `ticks` consecutivos de GPS da una velocidad resultante de 5,000 nudos, el vuelo debe invalidarse instantáneamente.
- **Crash Detection:** Si MSFS detecta colisión, el vuelo es fallido (no hay recompensas, pero sí quemado de fuel).
- **Validación Criptográfica (Firmas):** Electron deberá (idealmente) firmar los paquetes de telemetría enviados al backend usando un token rotativo o secreto empotrado/ofuscado, para evitar que alguien use Postman para emitir un evento `/finish-flight` sin ni siquiera abrir el simulador.

## 3. Integración con IVAO (Whazzup API)

- El vuelo exige un **callsign** predefinido (generado por la WebApp).
- El app de Electron (o el backend) de WeiFly cruzará el estado del vuelo con la API pública de IVAO.
- **Requisito vital:** Que la posición reportada a la WebApp por Electron coincida aproxima con la posición reportada en la red pública de IVAO.
- En caso de haber controladores de IVAO activos (`+50% Reward Modifier`), la latencia y la conexión constante a IVAO es estrictamente monitorizada.

## 4. Estructura y Vínculo de las Smart Accounts

- La sesión de WeiFly WebAuthn (Passkeys) delega el firmante (EOA encriptado).
- Cuando Electron arranque, deberá haber un mecanismo de "Pairing":
  1. _WebApp muestra un QR o un Magic Link de 6 dígitos._
  2. _Usuario introduce el código en la app Electron._
  3. _Electron asocia ese tracker con el vuelo activo del usuario._

## 5. Datos Contextuales de Frontend (Estilos)

Si el tracker Electron necesita interfaces, es importante recordar los estilos:

- Diseño "Premium" (Glassmorphism, interpolaciones tipo Framer Motion, Dark Mode por defecto con gradientes sutiles).
- Interfaz muy pulida parecida al dashboard actual desarrollado con MUI / Material, para dar integridad visual como "ecosistema real".

## 6. Próximo Paso en el Nuevo Repositorio (Recomendación al LLM de destino)

Cuando empiece la sesión en el repositorio de Electron:

1. Revisar si ya existe conexión SimConnect/Node.
2. Analizar cómo se está extrayendo actualmente la información del MSFS.
3. Validar el sistema de ping o buffer interno para mandar _waypoints_ o telemetría segmentada al backend sin congestionarlo, pero garantizando el _anti-farming_.
4. Establecer la arquitectura Anti-Cheat usando las reglas descritas arriba.
