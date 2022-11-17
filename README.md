# audiobuffer-pulses

Generates desired number of decibel pulses from raw PCM data.

## Installation

`npm install --save audiobuffer-pulses`

## Usage

```typescript
import { getAudioBufferPulses } from 'audiobuffer-pulses';

const float32Array = getAudioBufferPulses({
  audioBuffer,
  pulsesCount: 100,
  maxDecibels: -20,
  minDecibels: -90,
});
```
