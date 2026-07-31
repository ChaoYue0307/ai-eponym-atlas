export type TimelineMarker = {
  id: string
  position: number
}

export type TimelineMarkerLayout = {
  lanes: ReadonlyMap<string, number>
  laneCount: number
}

/**
 * Assign true-scale timeline markers to non-overlapping vertical lanes.
 * `position` is a percentage from 0 to 100; the horizontal coordinate never
 * changes, so lane allocation does not distort chronology.
 */
export function allocateTimelineMarkerLanes(
  markers: readonly TimelineMarker[],
  plotWidth: number,
  markerSize = 24,
  gap = 4,
): TimelineMarkerLayout {
  const width = Math.max(1, plotWidth)
  const minimumDistance = markerSize + gap
  const lastXByLane: number[] = []
  const lanes = new Map<string, number>()

  markers.forEach((marker) => {
    const x = (marker.position / 100) * width
    let lane = lastXByLane.findIndex((lastX) => x - lastX >= minimumDistance)
    if (lane < 0) lane = lastXByLane.length
    lastXByLane[lane] = x
    lanes.set(marker.id, lane)
  })

  return { lanes, laneCount: Math.max(1, lastXByLane.length) }
}
