import { TranscriptionModule } from './transcription.module';

describe('TranscriptionModule', () => {
  let transcriptionModule: TranscriptionModule;

  beforeEach(() => {
    transcriptionModule = new TranscriptionModule();
  });

  it('should create an instance', () => {
    expect(transcriptionModule).toBeTruthy();
  });
});
