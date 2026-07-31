import { describe, expect, it } from 'vitest'
import { allocateTimelineMarkerLanes } from './timelineLayout'

const markers = [
  { id: 'early', position: 0 },
  { id: 'modern-a', position: 98.6 },
  { id: 'modern-b', position: 99.1 },
  { id: 'modern-c', position: 99.55 },
  { id: 'latest', position: 100 },
] as const

describe('timeline marker layout', () => {
  it.each([332, 1200])(
    'keeps pointer targets separated at a %dpx plot width',
    (width) => {
      const layout = allocateTimelineMarkerLanes(markers, width)
      for (let first = 0; first < markers.length; first += 1) {
        for (let second = first + 1; second < markers.length; second += 1) {
          const a = markers[first]!
          const b = markers[second]!
          if (layout.lanes.get(a.id) !== layout.lanes.get(b.id)) continue
          const distance = Math.abs(a.position - b.position) * width / 100
          expect(distance).toBeGreaterThanOrEqual(28)
        }
      }
    },
  )
})
