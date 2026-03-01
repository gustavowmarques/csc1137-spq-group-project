import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable()
export class AccountLedgersFacade {
  private folderStructureUpdatedEvent = new Subject<string>();

}