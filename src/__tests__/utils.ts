import { getId } from '../shared'

export function toBeTheSameIds<T extends { id: string }>(
  received: (T | string)[],
  expected: (T | string)[],
  sorted = true
) {
  const receivedIds = received.map((r) => getId(r))
  const expectedIds = expected.map((r) => getId(r))

  if (sorted) {
    receivedIds.sort((a, b) => (a > b ? -1 : 1))
    expectedIds.sort((a, b) => (a > b ? -1 : 1))
  }

  expect(receivedIds).toEqual(expectedIds)
}
