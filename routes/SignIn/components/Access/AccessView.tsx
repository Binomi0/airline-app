import { type FC, useState } from 'react'
import { useRecoilValue } from 'recoil'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Lock from '@mui/icons-material/Lock'
import styles from './style.module.css'
import Header from './components/Header'
import { userState } from 'store/user.atom'

const SiginInView: FC = () => {
  const user = useRecoilValue(userState)
  const [isLoading, _setIsLoading] = useState(true)

  if (isLoading)
    return (
      <div className={styles.container}>
        <CircularProgress size={90} />
      </div>
    )

  return user ? null : (
    <div className={styles.container}>
      <Stack spacing={2} className={styles.accessLayout}>
        <Header />

        {/* {step === 0 && <SignIn onCreate={() => setStep(2)} />}
        {step === 2 && <SignUp />} */}

        <Stack direction='row' alignItems='center' height='100%' spacing={1}>
          <Lock fontSize='small' />
          <Typography variant='caption'>
            By entering you agree with terms and conditions, privacy policy and cookies.
          </Typography>
        </Stack>
      </Stack>
    </div>
  )
}

export default SiginInView
