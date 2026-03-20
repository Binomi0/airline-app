import { useContext } from 'react'
import { ContractContext } from 'context/ContractProvider'

export const useAppContracts = () => {
  return useContext(ContractContext)
}
