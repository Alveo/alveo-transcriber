import { Segment } from './segment';

export class Clip {
  id: number;
  label: string;
  audio_url: string;
  duration: number;
  segments: Segment[];
}
