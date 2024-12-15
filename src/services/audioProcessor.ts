import { AudioNodes } from '../utils/audioContext';

export class AudioProcessor {
  private nodes: AudioNodes | null = null;

  setNodes(nodes: AudioNodes) {
    this.nodes = nodes;
  }

  adjustBass(value: number) {
    if (this.nodes) {
      this.nodes.bassFilter.gain.value = value;
    }
  }

  adjustTreble(value: number) {
    if (this.nodes) {
      this.nodes.trebleFilter.gain.value = value;
    }
  }

  adjustEQ(frequency: number, value: number) {
    if (this.nodes) {
      const eqIndex = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
        .findIndex(freq => freq === frequency);
      
      if (eqIndex !== -1) {
        this.nodes.equalizers[eqIndex].gain.value = value;
      }
    }
  }
}

export const audioProcessor = new AudioProcessor();