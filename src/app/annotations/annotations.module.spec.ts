import { AnnotationsModule } from './annotations.module';

describe('AnnotationsModule', () => {
  let annotationsModule: AnnotationsModule;

  beforeEach(() => {
    annotationsModule = new AnnotationsModule();
  });

  it('should create an instance', () => {
    expect(annotationsModule).toBeTruthy();
  });
});
