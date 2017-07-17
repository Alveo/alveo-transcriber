import { AlveottPage } from './app.po';

describe('alveott App', () => {
  let page: AlveottPage;

  beforeEach(() => {
    page = new AlveottPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
