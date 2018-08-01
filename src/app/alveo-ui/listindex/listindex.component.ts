import { Component, OnInit } from '@angular/core';

import { AlveoClientService } from '../../alveo-client/alveo-client.module';
import { SessionService } from '../../session/session.module';
import { environment } from '../../../environments/environment';

import { AuthService } from '../shared/auth.service';
import { Paths } from '../shared/paths';

/* The listindex component is responible for the display of the itemlists
 * and for the display of the controls that relate to it. It makes use of
 * the DataControlComponent to handle the control side of things.
 *
 * If the listindex component is redirecting you to the datasource view,
 * that is is because it requires some data available in the local cache
 * for it to function.
 */
@Component({
  selector: 'app-listindex',
  templateUrl: './listindex.component.html',
  styleUrls: ['./listindex.component.css'],
})
export class ListIndexComponent implements OnInit {
  public sourceUrl: string= environment.alveoPaths.mainUrl;
  public isLoading: boolean= true;
  public lists: Array<any>;

  constructor(
    private alveoClientService: AlveoClientService,
    private authService: AuthService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    // Put the component in loading mode so the user knows something is in the
    // works.
    this.isLoading = true;

    // Retrieve our needed data if we can, if not, begin workflow to guide
    // the user to it.
    this.dataSetupHandler();
  }

  private async dataSetupHandler() {
    try {
      // Retrieve lists from the cache, we're not interested in querying the API
      //  since that is done at the datasource selection view. There is an error
      //  handling case for 'No data', in the catch clause.
      const lists = await this.alveoClientService.getListDirectory(true, false);

      // Combine the two lists we receive back from Alveo into one. A key is included
      // with each list that denotes this already, so it's not applicable for us to
      // use two components to represent both lists.
      this.lists = lists['own'].concat(lists['shared']);

      // Disable the loading spinner.
      this.isLoading = false;
    } catch (error) {
      if (error.statusCode === 401) {
        // We technically shouldn't encounter this error as we're not querying the API,
        //  but just in case the ClientService changes, it doesn't hurt to have.
        this.authService.promptLogin();
      } else if (error.message === 'No data') {
        // Data doesn't exist, send them to datasource selection view to get it
        this.sessionService.navigate([Paths.SelectDataSource]);
      } else {
        // Unexpected error, likely to do with the cache, let the user know before
        // we send them elsewhere.
        this.sessionService.displayError(error.message, error);
        this.sessionService.navigate([Paths.SelectDataSource]);
      }
    }
  }

  public onItemListSelect(list: any): void {
    // When a user clicks on the list, we'd like to move the user over to
    //  the ListView. To do that, we need to get the item_list from the url,
    //  as we don't have identifier key/value to work with.
    const id = this.sessionService.shortenItemUrl(list['item_list_url']);
    this.sessionService.navigate([Paths.ListView, id]);
  }
}
