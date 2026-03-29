import Swal, { SweetAlertIcon } from 'sweetalert2'
import { formatNumber } from 'utils'

// Configuración base con tema
const getSwalConfig = (): { theme: 'material-ui-dark' | 'material-ui-light' } => ({
  theme: localStorage.getItem('mui-mode') === 'dark' ? 'material-ui-dark' : 'material-ui-light'
})

export const missingKeySwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Missing Key',
    text: 'We could not find your key in this device, do you want to import it?',
    icon: 'question',
    input: 'file',
    showCancelButton: true,
    inputLabel: 'Upload your file key',
    inputAttributes: {
      accept: 'application/x-pem-file',
      'aria-label': 'Upload your wallet key'
    }
  })

export const backupDoneSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Backup complete!',
    text: 'You can now log into your account with your new added device.',
    icon: 'info'
  })

export const accountBackupSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Account Login Backup',
    text: 'Add another device to log in this site',
    showCancelButton: true,
    showConfirmButton: true,
    icon: 'info'
  })

export const removeBackupSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Removing Device',
    text: 'Are you sure you want to remove this device?',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: true
  })

export const backupErrorSwal = async (text?: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Backup not complete',
    text: text || 'An error occoured while adding a new backup',
    icon: 'error'
  })

export const errorSwal = async (title: string, text: string, confirmButtonText?: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title,
    text,
    icon: 'error',
    confirmButtonText: confirmButtonText ?? 'Intentar de nuevo'
  })

export const missingExportKeySwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Missing local wallet',
    text: 'There is no local wallet available to export',
    icon: 'error'
  })

export const signedOutSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Sign Out',
    text: 'Are you leaving?',
    showCancelButton: true,
    showConfirmButton: true
  })

export const accountImportErrorSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Invalid file',
    text: 'Double check that imported the right file.',
    icon: 'error'
  })

export const walletExportSwal = async (qrcode: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Export Wallet KEY',
    text: 'Do not share this with anyone, is the only way to unlock your funds in weifly',
    imageUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=' + qrcode + '&amp;size=150x150',
    imageWidth: 250,
    imageHeight: 250,
    imageAlt: 'QR Code',
    showCancelButton: true,
    confirmButtonText: 'Download Wallet KEY'
  })

export const handleStakeSwal = async (amount: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title: `Stake ${amount} AIRL`,
    text: `Are you sure you want to stake ${amount} tokens?`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
  })

export const handleUnStakeSwal = async (unstakeAmount: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Unstaking AIRL token',
    text: `Are you sure you want to withdraw ${unstakeAmount} tokens?`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
  })

export const amountExceedBalanceSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Amount exceed balance',
    text: 'Cannot stake more tokens than current balance',
    icon: 'info'
  })

export const unstakedSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'UnStaked!',
    text: 'Funds already claimed from staking, hope your planes are full!',
    icon: 'success'
  })

export const stakedSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Staked!',
    text: 'Wow! Good increase your fuel rate!',
    icon: 'success'
  })

export const maxWithdrawExceeded = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Maximun exceeded',
    text: 'Cannot withdraw more than deposited :)',
    icon: 'info'
  })

export const stakingClaimRewardsSwal = async (rewards: number) =>
  Swal.fire({
    ...getSwalConfig(),
    title: `Claim ${formatNumber(rewards / 1e18)} AIRG?`,
    text: `You will get ${formatNumber(rewards / 1e18)} AIRG fuel tokens`,
    icon: 'question',
    showCancelButton: true
  })

export const stakingRewardsClaimedSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Claimed Rewards!',
    text: 'Gas already collected',
    icon: 'success'
  })

export const stakingInsufficientRewardsSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Unsufficient Rewards',
    text: 'You need to collect at least 100L in order to claim gas',
    icon: 'warning'
  })

export const consentSecureWalletSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Secure your Wallet?',
    text: 'We can encrypt your private key using your Passkey. WeiFly will never have access to it.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Secure with Passkey',
    cancelButtonText: 'Later'
  })

export const consentCloudSyncSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Cloud Backup?',
    text: 'Do you want to sync your encrypted wallet to the cloud? This allows recovery on other devices using ONLY your Passkey.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, sync it',
    cancelButtonText: 'Local only'
  })

export const unlockWalletSwal = async () =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'Unlock Wallet',
    text: 'Please use your Passkey to unlock your digital assets.',
    icon: 'info',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Unlock',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false
  })

export const eventBookingSuccessSwal = async (callsign: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title: 'VUELO RESERVADO',
    text: `Has reservado el vuelo ${callsign} con éxito. Abre la WeiFly Desktop App para iniciar la simulación.`,
    icon: 'success',
    confirmButtonText: 'ENTENDIDO'
  })

export const confirmSwal = async (title: string, text: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar'
  })

export const questionSwal = async (title: string, text: string, confirmButtonText?: string) =>
  Swal.fire({
    ...getSwalConfig(),
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmButtonText ?? 'Continuar',
    cancelButtonText: 'Cancelar'
  })

export const notificationSwal = async (title: string, text: string, icon: SweetAlertIcon = 'success') =>
  Swal.fire({
    ...getSwalConfig(),
    title,
    text,
    icon,
    toast: true,
    position: 'bottom-right',
    timer: 3 * 1000,
    scrollbarPadding: false,
    showCloseButton: true,
    showConfirmButton: false
  })
