import { AIRLINE_COLORS } from 'src/theme'

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
    color: AIRLINE_COLORS.iberia,
    secondaryColor: AIRLINE_COLORS.iberia_secondary,
    logo: '/img/logos/iberia_icon.png',
    hero: '/img/events/iberia_hero.png',
    overlay: 'PUENTE AÉREO • EXCLUSIVO IBERIA',
    description: 'La aerolínea de bandera de España, líder en rutas entre Europa y Latinoamérica.'
  },
  vueling: {
    id: 'vueling',
    name: 'Vueling',
    color: AIRLINE_COLORS.vueling, // Vueling Yellow
    secondaryColor: AIRLINE_COLORS.vueling_secondary,
    logo: '/img/logos/vueling_icon.png',
    hero: '/img/events/vueling_hero.png',
    overlay: 'VUELOS NACIONALES • EXCLUSIVO VUELING',
    description: 'Compañía aérea low-cost con sede en Barcelona, conectando los principales destinos europeos.'
  },
  ryanair: {
    id: 'ryanair',
    name: 'Ryanair',
    color: AIRLINE_COLORS.ryanair, // Ryanair Blue
    secondaryColor: AIRLINE_COLORS.ryanair_secondary, // Ryanair Yellow
    logo: '/img/logos/ryanair_icon.png',
    hero: '/img/events/ryanair_hero.png',
    overlay: 'LOW COST • EXCLUSIVO RYANAIR',
    description: 'La aerolínea de bajo coste más grande de Europa, conocida por sus tarifas competitivas.'
  }
}
