export interface License {
  id: string
  name: string
  description: string
  image: string
  icon: string
  type: string
  minHours: number
}

export const LICENSES: License[] = [
  {
    id: '0',
    name: 'LIGHT AVIATION PILOT LICENSE - LAPL',
    description:
      'This is a license that does not require experience or previous knowledge of aeronautics, thanks to this license you will be able to fly light recreational aircraft with a maximum weight. If you are looking for a hobby as exciting as flying, this could be your best option. Within this division we can find different options.',
    image: '/img/license/lapl.png',
    icon: '/img/license/icons/lapl.png',
    type: 'LAPC',
    minHours: 0
  },
  {
    id: '1',
    name: 'PRIVATE PILOT LICENCE - PPL(A)',
    description:
      'This is the licence that will allow you to fly aircraft not intended for commercial exploitation, for private purposes, i.e. not for profit. It is the first step to follow if your objective is to become a commercial pilot. You can start the course at the age of 16 years old and you must be 17 years old to be able to take the exam.',
    image: '/img/license/ppl.png',
    icon: '/img/license/icons/ppl.png',
    type: 'PPL(A)',
    minHours: 10
  },
  {
    id: '2',
    name: 'COMMERCIAL PILOTO LICENCE - CPL (A)',
    description:
      'Upon completion of the Modular Commercial Airplane Pilot Course, CPL(A), you will be able to fly aircraft as pilot in command or co-pilot of any aircraft engaged in operations other than commercial air transport, act as pilot in command in commercial air transport of any single-pilot aircraft and/or act as co-pilot in commercial air transport subject to specific restrictions according to the regulations in force.',
    image: '/img/license/cpl.png',
    icon: '/img/license/icons/cpl.png',
    type: 'PPL(A)',
    minHours: 50
  },
  {
    id: '3',
    name: 'AIRLINE TRANSPORT PILOT LICENCE - (ATPL FROZEN)',
    description:
      'License with which you will be able to act as pilot in command (PIC) or co-pilot of any aircraft dedicated to operations other than commercial air transport; act as pilot in command in commercial air transport operations in any aircraft certified for a single pilot and act as co-pilot in commercial air transport of airlines. The program is developed in stages following different modules from less to more complex, obtaining upon completion the Commercial Pilot License CPL(A) and ATPL(A) Frozen.',
    image: '/img/license/atpl.png',
    icon: '/img/license/icons/atpl.png',
    type: 'ATPL',
    minHours: 100
  }
]
