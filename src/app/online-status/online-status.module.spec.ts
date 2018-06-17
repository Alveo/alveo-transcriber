import { OnlineStatusModule } from './online-status.module';

describe('OnlineStatusModule', () => {
  let onlineStatusModule: OnlineStatusModule;

  beforeEach(() => {
    onlineStatusModule = new OnlineStatusModule();
  });

  it('should create an instance', () => {
    expect(onlineStatusModule).toBeTruthy();
  });
});
