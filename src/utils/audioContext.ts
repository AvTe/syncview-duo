let audioContext: AudioContext | null = null;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

export interface AudioNodes {
  source: MediaElementAudioSourceNode;
  bassFilter: BiquadFilterNode;
  trebleFilter: BiquadFilterNode;
  equalizers: BiquadFilterNode[];
  gainNode: GainNode;
}

export const createAudioNodes = (audioElement: HTMLMediaElement): AudioNodes => {
  const context = getAudioContext();
  const source = context.createMediaElementSource(audioElement);
  
  // Create bass filter
  const bassFilter = context.createBiquadFilter();
  bassFilter.type = 'lowshelf';
  bassFilter.frequency.value = 200;
  
  // Create treble filter
  const trebleFilter = context.createBiquadFilter();
  trebleFilter.type = 'highshelf';
  trebleFilter.frequency.value = 2000;
  
  // Create gain node
  const gainNode = context.createGain();
  
  // Create equalizer filters for different frequencies
  const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
  const equalizers = frequencies.map(freq => {
    const filter = context.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.Q.value = 1;
    return filter;
  });
  
  // Connect nodes
  source
    .connect(bassFilter)
    .connect(trebleFilter);
    
  trebleFilter.connect(gainNode);
  
  // Connect equalizer filters in series
  equalizers.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, gainNode);
  
  // Connect the last equalizer to the destination
  equalizers[equalizers.length - 1].connect(context.destination);
  
  return { source, bassFilter, trebleFilter, equalizers, gainNode };
};