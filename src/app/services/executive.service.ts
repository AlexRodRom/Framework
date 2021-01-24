import { ExecutiveGroup, ExectiveGroupNode } from './../classes/ExecutiveGroup/executive-group';
import { Executive, ExecutiveNode } from '../classes/Executive/executive';
import { map, filter, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


@Injectable({
  providedIn: 'root'
})
export class ExecutiveService {
  rootApi: string;
  httpError: HttpErrorResponse;

  // data for Whole json from API
  executivesData: Executive[];
  // executiveGroupsData: ExecutiveGroup[];
  executiveGroupsData: ExecutiveGroup[];

  // data for formatted objects for tree view
  executiveGroups: ExectiveGroupNode[];
  executives: ExecutiveNode[];

  // updated prop for alert after updating a record.
  updated: boolean;

  constructor(private http: HttpClient) {
    this.rootApi = 'https://localhost:5001/api/';
  }

  // GET
  public getAllExecutives(): Observable<Executive[]> {
    return this.http.get<Executive[]>(this.rootApi + 'executives');
  }


  public getExecutive(id: number): Observable<Executive> {
    return this.http.get<Executive>(this.rootApi + 'executives/' + id);
  }

  public getAllExecutiveGroups(): Observable<ExecutiveGroup[]> {
    return this.http.get<ExecutiveGroup[]>(this.rootApi + 'executiveGroups');
  }

  public getExecutiveGroup(id: number): Observable<ExecutiveGroup> {
    return this.http.get<ExecutiveGroup>(this.rootApi + 'executiveGroups/' + id);
  }

  // GET Mapped
  public getAllExecutivesPipe(): Observable<Executive[]> {
    // tslint:disable-next-line: no-string-literal
    return this.http.get<Executive[]>(this.rootApi + 'executives').pipe(map(x => x['value']));
  }

  public getAllExecutiveGroupsPipe(): Observable<ExectiveGroupNode[]> {
    // tslint:disable-next-line: no-string-literal
    return this.http.get<ExecutiveGroup[]>(this.rootApi + 'executiveGroups').pipe(map(x => x['value']));
  }


  // PUT
  public updateExecutiveGroup(Id: number, ExecutiveGroupUpdated: ExecutiveGroup): void{
    this.http.put(this.rootApi + 'executiveGroups/' + Id, ExecutiveGroupUpdated ).subscribe(
      data => {
        setTimeout(() => {
          this.updated = false;
        }, 5000);
        this.updated = true;
      },
      data => { this.httpError = data; }
    );
  }

  public updateExecutive(Id: number, ExecutiveUpdated: Executive): void{
    this.http.put(this.rootApi + 'executives/' + Id, ExecutiveUpdated ).subscribe(
      data => {
          setTimeout(() => {
            this.updated = false;
        }, 5000);
          this.updated = true;
      },
      data => { this.httpError = data; }
    );
  }

  public getFormatted(): any {

    return this.getAllExecutivesPipe()
    .pipe(
      // Adding All Executives to global variable for using when selecting a exec from treeview.
      map(exec => this.executivesData = exec),
      mergeMap(x => this.getAllExecutiveGroupsPipe()
        .pipe(
          map( value => {
            // Adding All Groups to global variable for using when selecting a Group from treeview and for the Dropdownlist in exec form.
            this.executiveGroupsData = value;
            return value // returning the groupNodes formatted.
            .map(group => ({...group, children: x
              // tslint:disable-next-line: no-string-literal tslint:disable-next-line: no-shadowed-variable
              .map(x => ({...x, name: `${x['firstName']} ${x['lastName']}`})) // adding "name" prop to show in the treeview.
              // tslint:disable-next-line: no-string-literal
              .filter(executive => executive['executiveGroup'].id === group.id) }) // grouping the executives inside its group.
            );
          })
        )
      )
    );
  }

}
