import { AlveoTransservClientModule } from './alveo-transserv-client.module';

describe('AlveoTransservClientModule', () => {
  let alveoTransservClientModule: AlveoTransservClientModule;

  beforeEach(() => {
    alveoTransservClientModule = new AlveoTransservClientModule();
  });

  it('should create an instance', () => {
    expect(alveoTransservClientModule).toBeTruthy();
  });
});
