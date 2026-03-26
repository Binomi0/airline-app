export interface AirlineConfig {
  id: string
  name: string
  color: string
  secondaryColor?: string
  logo: string
  hero: string
  overlay: string
  description: string
}

export const AIRLINES: Record<string, AirlineConfig> = {
  iberia: {
    id: 'iberia',
    name: 'Iberia',
    color: '#b01d21',
    secondaryColor: '#ffffff',
    logo: '/img/logos/iberia_icon.png',
    hero: '/img/events/iberia_hero.png',
    overlay: 'PUENTE AÉREO • EXCLUSIVO IBERIA',
    description: 'La aerolínea de bandera de España, líder en rutas entre Europa y Latinoamérica.'
  },
  vueling: {
    id: 'vueling',
    name: 'Vueling',
    color: '#ffcc00', // Vueling Yellow
    secondaryColor: '#333333',
    logo: '/img/logos/vueling_icon.png',
    hero: '/img/events/vueling_hero.png',
    overlay: 'VUELOS NACIONALES • EXCLUSIVO VUELING',
    description: 'Compañía aérea low-cost con sede en Barcelona, conectando los principales destinos europeos.'
  },
  ryanair: {
    id: 'ryanair',
    name: 'Ryanair',
    color: '#003399', // Ryanair Blue
    secondaryColor: '#f1c400', // Ryanair Yellow
    logo: '/img/logos/ryanair_icon.png',
    hero: '/img/events/ryanair_hero.png',
    overlay: 'LOW COST • EXCLUSIVO RYANAIR',
    description: 'La aerolínea de bajo coste más grande de Europa, conocida por sus tarifas competitivas.'
  }
}
