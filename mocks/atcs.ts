const atc = {
  time: 12778,
  id: 52132052,
  userId: 706680,
  callsign: "LEZL_TWR",
  serverId: "WS",
  softwareTypeId: "aurora/win",
  softwareVersion: "1.3.0.19b",
  rating: 4,
  createdAt: "2023-05-06T19:19:07.000Z",
  lastTrack: {
    altitude: 0,
    altitudeDifference: 0,
    arrivalDistance: null,
    departureDistance: null,
    groundSpeed: 0,
    heading: 0,
    latitude: 37.42152,
    longitude: -5.89743,
    onGround: false,
    state: "En Route",
    timestamp: "2023-05-06T22:51:57.000Z",
    transponder: 0,
    transponderMode: "",
    time: 12771,
  },
  atcSession: {
    frequency: 118.1,
    position: "TWR",
  },
  atis: {
    lines: [
      "worldserver.ts.ivao.aero/LEZL_TWR",
      "Sevilla Tower",
      " Information QUEBEC  recorded at 2250z",
      "LEZL 062230Z 21006KT 170V230 CAVOK 22/16 Q1016 NOSIG",
      "ARR RWY 27 / DEP RWY 27 / TRL FL070 / TA 6000ft",
      "CONFIRM ATIS INFO QUEBEC  on initial contact",
    ],
    revision: "Q",
    timestamp: "2023-05-06T22:51:02.000Z",
  },
};

function createAtc(index: number, callsign: string) {
  return {
    time: 12778,
    id: 52132052 + index,
    userId: 706680 + index,
    callsign,
    serverId: "WS",
    softwareTypeId: "aurora/win",
    softwareVersion: "1.3.0.19b",
    rating: 4,
    createdAt: "2023-05-06T19:19:07.000Z",
    lastTrack: {
      altitude: 0,
      altitudeDifference: 0,
      arrivalDistance: null,
      departureDistance: null,
      groundSpeed: 0,
      heading: 0,
      latitude: 37.42152,
      longitude: -5.89743,
      onGround: false,
      state: "En Route",
      timestamp: "2023-05-06T22:51:57.000Z",
      transponder: 0,
      transponderMode: "",
      time: 12771,
    },
    atcSession: {
      frequency: 118.1,
      position: "TWR",
    },
    atis: {
      lines: [
        "worldserver.ts.ivao.aero/LEZL_TWR",
        "Sevilla Tower",
        " Information QUEBEC  recorded at 2250z",
        "LEZL 062230Z 21006KT 170V230 CAVOK 22/16 Q1016 NOSIG",
        "ARR RWY 27 / DEP RWY 27 / TRL FL070 / TA 6000ft",
        "CONFIRM ATIS INFO QUEBEC  on initial contact",
      ],
      revision: "Q",
      timestamp: "2023-05-06T22:51:02.000Z",
    },
  } as Atc;
}

export type Atc = typeof atc;

export const atcs: Atc[] = [
  createAtc(0, "LEAL_TWR"),
  createAtc(1, "LEZL_TWR"),
  createAtc(2, "LEMD_TWR"),
];
