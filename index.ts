export function getAudioBufferPulses(options: {
  audioBuffer: AudioBuffer
  destination: Float32Array
  minDecibels?: number
  maxDecibels?: number
}): void
export function getAudioBufferPulses(options: {
  audioBuffer: AudioBuffer
  pulsesCount: number
  minDecibels?: number
  maxDecibels?: number
}): Float32Array
export function getAudioBufferPulses({
  audioBuffer,
  pulsesCount,
  destination = new Float32Array(pulsesCount || 0),
  minDecibels = -100,
  maxDecibels = -30,
}: {
  audioBuffer: AudioBuffer
  pulsesCount?: number
  destination?: Float32Array
  minDecibels?: number
  maxDecibels?: number
}): Float32Array | void {
  const { length } = destination
  const step = audioBuffer.length / length
  const ceilStep = Math.ceil(step)
  const energies = new Float32Array(length)
  const { numberOfChannels } = audioBuffer

  for (let c = 0; c < numberOfChannels; c++) {
    const data = audioBuffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const from = Math.floor(i * step)
      const to = from + ceilStep

      for (let d = from; d < to; d += 1) {
        energies[i] += data[d] * data[d]
      }
    }
  }
  const rangeScaleFactor = maxDecibels === minDecibels ? 1 : 1 / (maxDecibels - minDecibels)

  energies.forEach((energy, index) => {
    const rootMeanSquare = Math.sqrt(energy / ceilStep / numberOfChannels)
    const decibels = rootMeanSquare ? 20 * log10(rootMeanSquare) : minDecibels
    const scaledValue = (decibels - rootMeanSquare) * rangeScaleFactor

    destination[index] = scaledValue > 1 ? 1 : scaledValue < 0 ? 0 : scaledValue
  })

  return destination
}

function log10(value: number) {
  return Math.log(value) * Math.LOG10E
}
