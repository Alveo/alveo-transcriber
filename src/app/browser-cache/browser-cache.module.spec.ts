import { BrowserCacheModule } from './browser-cache.module';

describe('BrowserCacheModule', () => {
  let browserCacheModule: BrowserCacheModule;

  beforeEach(() => {
    browserCacheModule = new BrowserCacheModule();
  });

  it('should create an instance', () => {
    expect(browserCacheModule).toBeTruthy();
  });
});
