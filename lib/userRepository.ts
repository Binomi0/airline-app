import fs from 'fs'

interface Authenticator {
  credentialID: string
  credentialPublicKey: string
  counter: number
}

interface User {
  email: string
  challenge: string
  authenticators: Authenticator[]
}

const file = fs.readFileSync('./challenge.json', 'utf-8')
// fs.writeFileSync("./challenge.json", JSON.stringify({}), "utf-8");

const userByChallenge = JSON.parse(file)

const getUserList = () => {
  return Object.values(userByChallenge) as User[]
}

export const findByEmail = (email: string) => {
  return getUserList().find((user) => user.email === email)
}

export const findByChallenge = (challenge: string) => {
  return userByChallenge[challenge]
}

export const create = (user: User) => {
  userByChallenge[user.challenge] = user
  fs.writeFileSync('./challenge.json', JSON.stringify(userByChallenge), 'utf-8')
}

export const addKeyToUser = (user: User, key: string) => {
  userByChallenge[user.challenge] = {
    ...user,
    key
  }

  fs.writeFileSync('./challenge.json', JSON.stringify(userByChallenge), 'utf-8')
}

export const addAuthenticator = (user: User, authenticator: any) => {
  userByChallenge[user.challenge] = {
    ...user,
    authenticators: user.authenticators ? [...user.authenticators, authenticator] : [authenticator]
  }

  fs.writeFileSync('./challenge.json', JSON.stringify(userByChallenge), 'utf-8')
}

export const updateUserChallenge = (user: User, challenge: string) => {
  delete userByChallenge[user.challenge]

  userByChallenge[challenge] = {
    ...user,
    challenge
  }
  fs.writeFileSync('./challenge.json', JSON.stringify(userByChallenge), 'utf-8')
}

const utils = {
  create,
  findByEmail,
  findByChallenge,
  addKeyToUser,
  addAuthenticator,
  updateUserChallenge
}

export default utils
