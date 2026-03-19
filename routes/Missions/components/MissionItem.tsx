import { useCallback } from 'react'
import { FRoute } from 'types'
import styles from 'styles/Home.module.css'
import Grow from '@mui/material/Grow'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const MissionItem: React.FC<{
  flights: FRoute[]
  delay: number
  origin: string
  // eslint-disable-next-line no-unused-vars
  onSelect: (origin: string, destination: string) => void
  style?: React.CSSProperties
}> = ({ flights, delay, origin, onSelect, style }) => {
  // ... existing logic ...
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      onSelect(origin, event.target.value as string)
    },
    [onSelect, origin]
  )

  return (
    <div style={style}>
      <Grow in timeout={{ enter: delay }}>
        <Box p={2}>
          <Card className={styles.card}>
            <CardHeader
              title={
                <Typography variant='h2' color='white'>
                  {origin}
                </Typography>
              }
            />
            <CardContent>
              <FormControl fullWidth>
                <InputLabel id='flight-destination-select'>Destination</InputLabel>
                <Select
                  defaultValue=''
                  labelId='flight-destination-select'
                  id='destination-select'
                  label='Destination'
                  onChange={handleChange}
                >
                  <MenuItem disabled value=''>
                    Select destination
                  </MenuItem>
                  {flights.map(({ destination }) => (
                    <MenuItem value={destination} key={destination}>
                      {destination}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Box>
      </Grow>
    </div>
  )
}

export default MissionItem
