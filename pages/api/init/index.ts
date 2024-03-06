import { NextApiRequest, NextApiResponse } from 'next'
import { open, Protocol } from 'node-simconnect'

const EVENT_ID_PAUSE = 1

open('My SimConnect client', Protocol.FSX_SP1)
  .then(function ({ recvOpen, handle }) {
    console.log('Connected to', recvOpen.applicationName)

    handle.on('event', function (recvEvent) {
      switch (recvEvent.clientEventId) {
        case EVENT_ID_PAUSE:
          console.log(recvEvent.data === 1 ? 'Sim paused' : 'Sim unpaused')
          break
      }
    })
    handle.on('exception', function (recvException) {
      console.log(recvException)
    })
    handle.on('quit', function () {
      console.log('Simulator quit')
    })
    handle.on('close', function () {
      console.log('Connection closed unexpectedly (simulator CTD?)')
    })

    handle.subscribeToSystemEvent(EVENT_ID_PAUSE, 'Pause')
  })
  .catch(function (error) {
    console.log('Connection failed:', error)
  })

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(202).end()
}

export default handler
