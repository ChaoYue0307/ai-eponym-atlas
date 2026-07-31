export type CircleGeometry = {
  readonly x: number
  readonly y: number
  readonly r: number
}

export type CircleConnection = {
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
}

/** Return a connector whose endpoints meet, rather than pass beneath, two circles. */
export function connectCircleBoundaries(
  from: CircleGeometry,
  to: CircleGeometry,
): CircleConnection {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)

  if (distance === 0) {
    throw new RangeError('Constellation nodes must not share the same center')
  }

  const unitX = dx / distance
  const unitY = dy / distance

  return {
    x1: from.x + unitX * from.r,
    y1: from.y + unitY * from.r,
    x2: to.x - unitX * to.r,
    y2: to.y - unitY * to.r,
  }
}
