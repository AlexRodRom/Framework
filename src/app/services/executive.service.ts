import { ExecutiveGroup, ExectiveGroupNode } from './../classes/ExecutiveGroup/executive-group';
import { Executive, ExecutiveNode } from '../classes/Executive/executive';
import { map, filter, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    const valueProp = 'value';
    return this.http.get<Executive[]>(this.rootApi + 'executives').pipe(map(x => x[valueProp]));
  }

  public getAllExecutiveGroupsPipe(): Observable<ExectiveGroupNode[]> {
    const valueProp = 'value';
    return this.http.get<ExecutiveGroup[]>(this.rootApi + 'executiveGroups').pipe(map(x => x[valueProp]));
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

  public getFormatted(): Observable<ExectiveGroupNode[]> {

    const firstName = 'firstName';
    const lastName = 'lastName';
    const executiveGroup = 'executiveGroup';
    return this.getAllExecutivesPipe()
    .pipe(
      // Adding All Executives to global variable for using when selecting a exec from treeview.
      map(exec => this.executivesData = exec),
      mergeMap(exec => this.getAllExecutiveGroupsPipe()
        .pipe(
          map( value => {

            // Adding All Groups to global variable for using when selecting a Group from treeview and for the Dropdownlist in exec form.
            this.executiveGroupsData = value;
            // Adding "All Executives" group.
            value.unshift({id: -1, name: 'All Executives', children: []});

            // returning the groupNodes formatted.
            return value
            .map(group => ({...group, children: exec
              // adding "name" prop to show in the treeview.
              .map(executive => ({...executive, name: `${executive[firstName]} ${executive[lastName]}`}))
              // grouping the executives inside its group or All Executives if group id is -1 (Added group)
              .filter(executive => executive[executiveGroup].id === group.id || group.id === -1 ) })
            );
          })
        )
      )
    );
  }

}
