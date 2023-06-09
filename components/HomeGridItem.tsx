import { Grow, Grid, Card, CardContent, Typography } from '@mui/material'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { memo } from 'react'

interface IGridItem {
  link: string
  title: string
  text: string
  delay: number
}

const HomeGridItem: React.FC<IGridItem> = ({ link, title, text, delay }) => (
  <Grow in timeout={{ enter: delay }}>
    <Grid item xs={12} md={6} lg={6} p={2}>
      <Link href={link}>
        <Card className={styles.card}>
          <CardContent className={styles.text}>
            <Typography component='h4' variant='h4' color='white' paragraph>
              {title}
            </Typography>
            <Typography color='white'>{text}</Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  </Grow>
)

export default memo(HomeGridItem)
