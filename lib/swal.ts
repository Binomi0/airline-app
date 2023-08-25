import Swal from 'sweetalert2'

export const logInSwal = async () =>
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
