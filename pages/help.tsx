import React from 'react'

const help = () => {
  return (
    <div>
      Entiendo, parece que WeiFly ha diseñado un sistema bastante interesante para su aerolínea virtual, utilizando dos
      tokens diferentes, AIRL y AIRG, para gestionar su economía y proporcionar combustible virtual para sus aviones.
      Permíteme desglosar las características y funcionamiento del sistema: - 1. **Token AIRL (Token Principal)**: - Es
      el token principal de la aerolínea virtual WeiFly y maneja toda la economía de la plataforma. - Probablemente se
      utilice para diversas funciones dentro de la plataforma, como la compra de licencias de vuelo, adquisición de
      aeronaves y otros servicios relacionados con la aerolínea. - Este token puede ser intercambiado en exchanges o
      utilizado dentro del ecosistema de WeiFly. - 2. **Token AIRG (Token Secundario)**: - Se utiliza para proporcionar
      &quot;Litros de gasolina&quot; virtuales para los aviones dentro de la plataforma de WeiFly. - Cada token AIRG
      equivale a un litro de combustible virtual. - Este token es crucial para realizar vuelos dentro de WeiFly, ya que
      se requiere combustible para operar las aeronaves. - 3. **Licencia y Aeronave (NFT - ERC1155)**: - La obtención de
      una licencia y una aeronave son requisitos necesarios para realizar vuelos dentro de WeiFly. - Ambos se
      representan como tokens no fungibles (NFT) basados en el estándar ERC1155 de Ethereum. 4. **Contrato Inteligente
      de Staking**: - WeiFly ha implementado un contrato inteligente de staking que permite a los usuarios depositar sus
      tokens AIRL y obtener tokens AIRG a cambio. - La tasa de conversión es de 100 tokens AIRG por cada 24 horas por
      cada 1 token AIRL depositado. - Este mecanismo de staking proporciona a los poseedores de AIRL una forma de
      obtener AIRG, lo que les permite adquirir combustible para sus aviones y realizar vuelos dentro de la plataforma.
      En resumen, WeiFly ha creado un ecosistema complejo pero bien diseñado que utiliza dos tokens diferentes, AIRL y
      AIRG, junto con contratos inteligentes y tokens no fungibles para gestionar y operar su aerolínea virtual. Este
      modelo económico y técnico proporciona una estructura sólida para la plataforma y ofrece a los usuarios una
      experiencia inmersiva en la simulación de vuelo virtual.
    </div>
  )
}

export default help
