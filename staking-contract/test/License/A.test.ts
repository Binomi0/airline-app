import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import {
  deployAirlineCoin,
  deployLicenseNFT,
  lazyMintLicense,
  mintLicense,
  setClaimConditionsLicense
} from '../../utils'

describe('License A NFT', async function () {
  async function deployContracts() {
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners()
    const airlineCoin = await deployAirlineCoin(owner.address)
    const license = await deployLicenseNFT(owner.address)

    return { license, airlineCoin, owner, otherAccount, thirdAccount }
  }

  it('Should set the right owner', async function () {
    const { license, owner } = await loadFixture(deployContracts)

    expect(await license.owner()).to.equal(owner.address)
  })

  it('Should set new claim conditions', async () => {
    const { license, owner, airlineCoin } = await loadFixture(deployContracts)
    await lazyMintLicense('4', 3, owner, license)
    await setClaimConditionsLicense(license, 3, airlineCoin)

    const cc = await license.claimCondition(3)

    expect(cc.maxClaimableSupply).to.be.equal(BigNumber.from('100'))
  })

  it('Should NOT be able to claim license A if no license B', async () => {
    const { license, owner, otherAccount, airlineCoin } = await loadFixture(deployContracts)

    await lazyMintLicense('4', 3, owner, license)
    await setClaimConditionsLicense(license, 3, airlineCoin)

    const balance = await license.balanceOf(otherAccount.address, 3)
    expect(balance).to.equal(0)

    try {
      await mintLicense(license, otherAccount, 3, airlineCoin)
      expect(false).to.equal(true)
    } catch (error) {
      expect(true).to.equal(true)
    }
  })

  it('Should be able to claim license A if has license B', async () => {
    const { license, owner, otherAccount, airlineCoin } = await loadFixture(deployContracts)
    await lazyMintLicense('4', 0, owner, license)
    await setClaimConditionsLicense(license, 0, airlineCoin)
    await mintLicense(license, otherAccount, 0, airlineCoin)

    expect(await license.balanceOf(otherAccount.address, 0)).to.equal(1)
    expect(await license.balanceOf(otherAccount.address, 1)).to.equal(0)

    await setClaimConditionsLicense(license, 1, airlineCoin)
    await mintLicense(license, otherAccount, 1, airlineCoin)

    expect(await license.balanceOf(otherAccount.address, 1)).to.equal(1)
    expect(await license.balanceOf(otherAccount.address, 2)).to.equal(0)

    await setClaimConditionsLicense(license, 2, airlineCoin)
    await mintLicense(license, otherAccount, 2, airlineCoin)

    expect(await license.balanceOf(otherAccount.address, 2)).to.equal(1)
    expect(await license.balanceOf(otherAccount.address, 3)).to.equal(0)

    await setClaimConditionsLicense(license, 3, airlineCoin)
    await mintLicense(license, otherAccount, 3, airlineCoin)

    expect(await license.balanceOf(otherAccount.address, 3)).to.equal(1)
  })
})