## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_THIRDWEB_SECRET_KEY=your_secret_key
NEXT_PUBLIC_THIRDWEB_CHAIN_ID=43114

# Optional
NEXT_PUBLIC_IVAO_CLIENT_ID=your_ivao_client_id
NEXT_PUBLIC_IVAO_CLIENT_SECRET=your_ivao_client_secret
```

### 3. Run Development Server

```bash
pnpm dev
```

### 4. Build for Production

```bash
pnpm build
```

### 5. Start Production Server

```bash
pnpm start
```

es una aerolinea virtual descentralizada. Una plataforma a la que un usuario se conecta únicamente con su email, lo valida y crea un passkey en cuantos dispositivos quiera (esta será la única forma de desbloquear su wallet) ya que usaremos smart account de thirdweb sponsorizando el gas de las transacciones por algún tiempo o bajo determinadas circunstancias.
Una vez un usuario se registra se guarda la sesión con un token jwt de sesión, se crea un wallet random (EOA) del cual el usuario usa su passkey para encriptar y guardar localmente. De esta forma no necesitamos crear el wallet sino que podemos derivar y mostrar su dirección hasta que realice una transación.
Para poder comprar ciertas aeronaves necesitas diferentes licencias:
De momento hay 4 licencias: vamos a llamarlas 1,2,3 y 4
y 4 aviones: c172 que necesita la licencia 1, c700 que requiere la 2, b737 la 3 y el AN-225 la 4.
Este es el esquema inicial luego habrá mas aviones nfts que usaran las mismas licencias pongamos el caso de un A320, requeriría la licencia 3.
Una vez adquiere la licencia "desbloquea" ciertos aviones que podrá gestionar en su hangar.
La plataforma ofrece vuelos remunerados en forma de tokens AIRL. éstos vuelos requiren de avion, licencia y además gasolina, si un token ERC20 destinado a eso mismo.
El token AIRG (combustible) se obtiene mediante un contrato de staking, el usuario pone al menos 1 AIRL en staking y la plataforma le produce 100 AIRG cada 24 horas por cada 1 AIRL.
Una vez el usuario está listo, tiene licncia, avios y combustible, puede elegir entre ciertos vuelos a realizar propuestos por weifly que cumplan sus características, weifly le entregará un callsign para cada vuelo que tendrá que añadir en su simulador real para que podamos trazar su trayecto. Estos vuelos una vez completados y validados harán entrega de un NFT al usuario que los irá acumulando.
Los vuelos se monitorizan a través de una aplicación electron que el usuario tendrá que tener instalada, abierta y configurada antes de empezar su vuelo.
Necesitmoas un sistema de verificación de vuelo para evitar los bots. Quizá un sistema de machine learning pero no tengo nada de experiencia en eso.
Para conseguir los tokens se creará un pool de liquidez en uniswap contra USDC o WETH o ambos para que los usuarios puedan adquirirlos.

La parte de los vuelos se gestiona mayormente a través del simulador y una conexión con IVAO. Los usuarios se conectan a IVAO con su cuenta de IVAO y la plataforma se conecta a IVAO para obtener la información de los vuelos.
Para poder escocger un vuelo, el usuario primer elige entre las torres de control (ATC) conectadas en IVAO, puede elegir un inicio y un destino siempre y cuando hay control aereo de IVAO activo en la ruta, minimo en la salida y llegada.
Entonces una vez el usuario ha elegido el aeropuerto de salida y llegada, se le ofrecen un vuelo disponible.
Otra opción sería que solo eligiera el punto de salida dejando a weifly que elija el destino y los detalles del vuelo.
O que weifly proponga rutas aleatorias ya predefinidas que el usuario pueda elegir.
