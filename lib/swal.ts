import Swal from 'sweetalert2'

export const loginSuccessSwal = async () =>
  Swal.fire({
    title: 'Connected!',
    text: 'You are now logged in',
    icon: 'success'
  })

export const missingKeySwal = async () =>
  Swal.fire({
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
    title: 'Backup complete!',
    text: 'Your wallet has been exported, do not share it, your items will be at risk.',
    icon: 'info'
  })

export const accountBackupSwal = async () =>
  Swal.fire({
    title: 'Account Login Backup',
    text: 'Add another device to log in this site',
    showCancelButton: true,
    showConfirmButton: true,
    icon: 'question'
  })

export const missingExportKeySwal = async () =>
  Swal.fire({
    title: 'Missing local wallet',
    text: 'There is no local wallet available to export',
    icon: 'error'
  })

export const signedOutSwal = async () =>
  Swal.fire({
    title: 'Sign Out',
    text: 'Are you leaving?',
    showCancelButton: true,
    showConfirmButton: true
  })

export const askExportKeySwal = async (qrcode: string) =>
  Swal.fire({
    // title: 'Export Walley KEY',
    // text: 'Wallet key is going to be download, please keep it safe.',
    // icon: 'warning',
    // showCancelButton: true,
    // showConfirmButton: true,
    title: 'Export Walley KEY',
    imageUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=' + qrcode + '&amp;size=150x150',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'QR Code',
    showCancelButton: true,
    confirmButtonText: 'Download Walley KEY',
    showLoaderOnConfirm: true
  })

export const handleStakeSwal = async (amount: string) =>
  Swal.fire({
    title: `Stake ${amount} AIRL`,
    text: `Are you sure you want to stake ${amount} tokens?`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
  })

export const handleUnStakeSwal = async (unstakeAmount: string) =>
  Swal.fire({
    title: 'Unstaking AIRL token',
    text: `Are you sure you want to withdraw ${unstakeAmount} tokens?`,
    icon: 'question',
    showCancelButton: true,
    showConfirmButton: true
  })

export const amountExceedBalanceSwal = async () =>
  Swal.fire({
    title: 'Amount exceed balance',
    text: 'Cannot stake more tokens than current balance',
    icon: 'info'
  })

export const unstakedSwal = async () =>
  Swal.fire({
    title: 'UnStaked!',
    text: 'Funds already claimed from staking, hope your planes are full!',
    icon: 'success'
  })
export const stakedSwal = async () =>
  Swal.fire({
    title: 'Staked!',
    text: 'Wow! Good increase your fuel rate!',
    icon: 'success'
  })

export const maxWithdrawExceeded = async () =>
  Swal.fire({
    title: 'Maximun exceeded',
    text: 'Cannot withdraw more than deposited :)',
    icon: 'info'
  })
