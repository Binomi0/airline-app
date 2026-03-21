# Mecánicas de ATC en WeiFly

Este documento define la lógica de negocio, incentivos económicos y el sistema de reputación diseñado para atraer, retener y recompensar a los Controladores de Tráfico Aéreo (ATC) de IVAO dentro del ecosistema de WeiFly.

---

## 1. Incentivos Económicos y Gamificación

Para recompensar a los controladores (actualmente los pilotos reciben un multiplicador de `+50%` si hay ATC, pero el controlador no gana nada por defecto), se proponen las siguientes mecánicas integradas con las Smart Accounts y el token dual ($AIRL / $AIRG):

### 1.1. "Proof-of-Control" (Minería Pasiva Basada en Tráfico)
El controlador genera recompensas en $AIRL no por el tiempo que esté conectado de forma aislada, sino **por su interacción con pilotos de WeiFly**.
- **Mecánica:** El ATC gana una cantidad fija de $AIRL únicamente por cada piloto activo de WeiFly que cruce su espacio aéreo y pase un tiempo mínimo en su frecuencia.
- **Objetivo:** Evitar el *farming* (conectarse a un aeropuerto vacío y quedarse AFK) y fomentar que los ATCs se posicionen en aeropuertos que la comunidad de WeiFly frecuenta.

### 1.2. Sistema de Propinas Web3 "Frictionless"
- **Mecánica:** Aprovechando las transacciones sin gas de las Smart Accounts (ERC-4337), al aterrizar o al cambiar de frecuencia, la interfaz de WeiFly le permite al piloto enviar una propina rápida (ej. 10 $AIRG o 1 $AIRL) al controlador con un solo clic/passkey.
- **Objetivo:** Recompensa emocional y meritocrática instantánea pagada de usuario a usuario por un buen servicio.

### 1.3. Bounties (Contratos de Staffing)
- **Mecánica:** WeiFly (o DAOs/Aerolíneas en el ecosistema) puede publicar "Misiones" usando fondos del *Marketing & Referral Pool*. Por ejemplo: `"Cobertura total pedida en EHAM de 18:00 a 20:00Z"`.
- Los primeros ATCs que se registren y cumplan el bloque de horas reciben un Airdrop automático del Bounty.
- **Objetivo:** Dirigir el tráfico para eventos y asegurar liquidez de controladores donde la plataforma lo necesite.

### 1.4. Progresión y Utilidad Cruzada (NFTs Soulbound)
- **Mecánica:** Al controlar hitos de tráfico (ej. 50, 200, 500 aviones de WeiFly), el ATC mintea un NFT intransferible como "Insignia de Rango".
- **Utilidad:** Si el ATC decide volar como piloto en WeiFly, poseer altos rangos de ATC le otorga mejoras permanentes (p. ej., un multiplicador aumentado en el `Level_Modifier` o exención de tasas en su primer avión).

### 1.5. Tesorerías de "Guilds" (vACCs de IVAO)
- **Mecánica:** Las divisiones reales de IVAO pueden registrar un "Guild" en WeiFly. Cuando sus miembros controlan el espacio aéreo, una micro-comisión pasiva va a la tesorería de la división.
- **Objetivo:** Incorporación masiva de usuarios provenientes de las organizaciones locales de IVAO.

---

## 2. Sistema de Reputación Asimétrica (Kudos y Flags)

El sistema de reputación clásico de "5 estrellas" es punitivo y tóxico en la simulación aérea debido a la curva de aprendizaje. WeiFly propone un sistema basado en **refuerzo positivo y protección al estudiante**.

### 2.1. El "Escudo de Aprendiz" (Sincronización con Rango IVAO)
- WeiFly lee el rango real del controlador mediante la API de IVAO (Whazzup).
- Si el ATC tiene rango de formación (`AS1`, `AS2`, `AS3`), se le activa automáticamente el **"Escudo de Aprendiz"**.
- Bajo este escudo, **los pilotos no pueden emitir puntuaciones negativas**. Solo pueden darle votos positivos. Esto evita la frustración del estudiante y le incentiva a aprender en el ecosistema de WeiFly.

### 2.2. Sistema de Etiquetas (Kudos) en lugar de Estrellas
Tras una interacción, los pilotos pueden otorgar *Kudos* específicos, en lugar de un rating numérico:
- 🎙️ **Procedimientos Claros:** Profesionalidad y exactitud.
- 🤝 **Extremadamente Paciente:** Excelente para estudiantes o controladores comprensivos.
- ⚡ **Manejo de Tráfico Pesado:** Eficiencia en eventos abarrotados.
- Si un ATC no da un buen servicio, simplemente recibe una ausencia de Kudos (no sube de nivel, pero tampoco es castigado con saldo negativo).

### 2.3. Sistema "Flag" (Protección Anti-Trolls Bilateral)
Para lidiar con el troleo deliberado (el problema clásico de IVAO):
- **ATC a Piloto:** Si un piloto troll estropea la simulación, el ATC puede aplicarle un Flag a su vuelo en curso. Esto hace que el `Activity_Modifier` del piloto caiga drásticamente (ej. de 1.0x a 0.5x), asfixiándole económicamente para que quemar gasolina ($AIRG) no le resulte rentable.
- **Piloto a ATC:** Si el ATC es el troll, los pilotos pueden reportarlo. Sin embargo, un solo reporte no hace daño (para evitar cacerías de brujas). Se requiere que el sistema detecte, por ejemplo, **3 Flags de 3 pilotos diferentes en menos de 2 horas** para colocar al controlador en "Shadowban" (dejando de minar recompensas temporalmente).

### 2.4. El Multiplicador de Karma
Los Kudos acumulados y la buena consistencia forman el **Karma** del ATC.
- Un Karma elevado otorga multiplicadores pasivos al minar $AIRL cuando está en frecuencia.
- Los ATCs con mayor Karma aparecen destacados visualmente en el mapa en vivo de WeiFly, atrayendo automáticamente a todos los pilotos activos que busquen su bono de +50% en un entorno seguro y profesional.
