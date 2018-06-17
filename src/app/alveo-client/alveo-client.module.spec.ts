import { AlveoClientModule } from './alveo-client.module';

describe('AlveoClientModule', () => {
  let alveoClientModule: AlveoClientModule;

  beforeEach(() => {
    alveoClientModule = new AlveoClientModule();
  });

  it('should create an instance', () => {
    expect(alveoClientModule).toBeTruthy();
  });
});
