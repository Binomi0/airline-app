import { BytesLike, Hexable, hexConcat, hexDataSlice, hexlify, hexZeroPad, parseEther } from 'ethers/lib/utils'
import { BigNumber, BigNumberish, ethers, Signer } from 'ethers'

import { fillUserOpDefaults } from './userOp'
import { AccountFactory, type EntryPoint } from 'typechain-types'
import { PackedUserOperationStruct } from 'typechain-types/@account-abstraction/contracts/core/EntryPoint'

export const HashZero = ethers.constants.HashZero
export const ONE_ETH = parseEther('1')
export const TWO_ETH = parseEther('2')
export const FIVE_ETH = parseEther('5')

// helper function to create the initCode to deploy the account, using our account factory.
export function getAccountInitCode(owner: string, factory: AccountFactory, salt = 0): BytesLike {
  return hexConcat([factory.address, factory.interface.encodeFunctionData('createBaseAccount', [owner])])
}

export async function isDeployed(addr: string): Promise<boolean> {
  const code = await ethers.getDefaultProvider().getCode(addr)
  return code.length > 2
}

export function packAccountGasLimits(verificationGasLimit: BigNumberish, callGasLimit: BigNumberish): string {
  return ethers.utils.hexConcat([
    hexZeroPad(hexlify(verificationGasLimit, { hexPad: 'left' }), 16),
    hexZeroPad(hexlify(callGasLimit, { hexPad: 'left' }), 16)
  ])
}

export function packPaymasterData(
  paymaster: string,
  paymasterVerificationGasLimit: BytesLike | Hexable | number | bigint,
  postOpGasLimit: BytesLike | Hexable | number | bigint,
  paymasterData: string
): string {
  return ethers.utils.hexConcat([
    paymaster,
    hexZeroPad(hexlify(paymasterVerificationGasLimit, { hexPad: 'left' }), 16),
    hexZeroPad(hexlify(postOpGasLimit, { hexPad: 'left' }), 16),
    paymasterData
  ])
}

export function unpackAccountGasLimits(accountGasLimits: string): {
  verificationGasLimit: number
  callGasLimit: number
} {
  return {
    verificationGasLimit: parseInt(accountGasLimits.slice(2, 34), 16),
    callGasLimit: parseInt(accountGasLimits.slice(34), 16)
  }
}

export interface ValidationData {
  aggregator: string
  validAfter: number
  validUntil: number
}

export const maxUint48 = 2 ** 48 - 1
export function parseValidationData(validationData: BigNumberish): ValidationData {
  const data = hexZeroPad(BigNumber.from(validationData).toHexString(), 32)

  // string offsets start from left (msb)
  const aggregator = hexDataSlice(data, 32 - 20)
  let validUntil = parseInt(hexDataSlice(data, 32 - 26, 32 - 20))
  if (validUntil === 0) {
    validUntil = maxUint48
  }
  const validAfter = parseInt(hexDataSlice(data, 0, 6))

  return {
    aggregator,
    validAfter,
    validUntil
  }
}

export function packValidationData(validationData: ValidationData): BigNumber {
  return BigNumber.from(validationData.validAfter)
    .shl(48)
    .add(validationData.validUntil)
    .shl(160)
    .add(validationData.aggregator)
}

// find the lowest number in the range min..max where testFunc returns true
export async function findMin(
  testFunc: (index: number) => Promise<boolean>,
  min: number,
  max: number,
  delta = 5
): Promise<number> {
  if (await testFunc(min)) {
    throw new Error(`increase range: function already true at ${min}`)
  }
  if (!(await testFunc(max))) {
    throw new Error(`no result: function is false for max value in ${min}..${max}`)
  }
  while (true) {
    const avg = Math.floor((max + min) / 2)
    if (await testFunc(avg)) {
      max = avg
    } else {
      min = avg
    }
    // console.log('== ', min, '...', max, max - min)
    if (Math.abs(max - min) < delta) {
      return max
    }
  }
}

export async function getUserOp({
  sender,
  nonce,
  initCode,
  callData,
  callGasLimit = 800_000,
  verificationGasLimit = 800_000,
  preVerificationGas = 20_000,
  maxFeePerGas = ethers.utils.parseUnits('20', 'gwei'),
  maxPriorityFeePerGas = ethers.utils.parseUnits('10', 'gwei')
}: {
  sender: string
  nonce: BigNumber
  initCode: string
  callData: string
  callGasLimit?: BigNumberish
  verificationGasLimit?: BigNumberish
  preVerificationGas?: BigNumberish
  maxFeePerGas?: BigNumberish
  maxPriorityFeePerGas?: BigNumberish
}) {
  const filledUserOp = fillUserOpDefaults({
    sender,
    nonce,
    initCode,
    callData
  })

  const userOp = {
    ...filledUserOp,
    sender,
    nonce,
    initCode,
    callData,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    signature: '0x'
  }

  return userOp
}

export const getSender = async (entryPoint: EntryPoint, initCode: string) =>
  entryPoint.getSenderAddress(initCode).catch((err) => {
    if (err.data) {
      return `0x${err.data.slice(-40)}`
    } else if (err.error) {
      return `0x${err.error.data.data.slice(-40)}`
    }
    throw new Error('Wrong data from getSenderAddress')
  })

export const getBaseInitCode = (accountFactory: AccountFactory, account: string) =>
  accountFactory.address + accountFactory.interface.encodeFunctionData('createBaseAccount', [account]).slice(2)

export const getInitCode = (accountFactory: AccountFactory, account: string) =>
  accountFactory.address + accountFactory.interface.encodeFunctionData('createRecoverableAccount', [account]).slice(2)

export const signUserOp = async (
  entryPoint: EntryPoint,
  packedUserOp: PackedUserOperationStruct,
  owner: Signer
): Promise<PackedUserOperationStruct> => {
  const userOpHash = await entryPoint.getUserOpHash(packedUserOp)
  packedUserOp.signature = await owner.signMessage(ethers.utils.arrayify(userOpHash))

  return packedUserOp
}
