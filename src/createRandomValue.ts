import faker from 'faker'

export const createRandomValue = () =>
  faker.random.objectElement<() => unknown>(faker.datatype)()
