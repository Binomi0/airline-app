import {
  SelectChangeEvent,
  Grow,
  Grid,
  Card,
  CardHeader,
  Typography,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useCallback } from 'react'
import { FRoute } from 'types'
import styles from 'styles/Home.module.css'

const CargoItem: React.FC<{
  flights: FRoute[]
  delay: number
  origin: string
  onSelect: (origin: string, destination: string) => void
}> = ({ flights, delay, origin, onSelect }) => {
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      onSelect(origin, event.target.value as string)
    },
    [onSelect, origin]
  )

  return (
    <Grow in timeout={{ enter: delay }}>
      <Grid item xs={12} md={6} lg={4} xl={3} p={2}>
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
      </Grid>
    </Grow>
  )
}

export default CargoItem
