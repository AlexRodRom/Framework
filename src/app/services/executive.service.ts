import { ExecutiveGroup,ExectiveGroupNode } from './../classes/ExecutiveGroup/executive-group';
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
  executiveGroupsData: ExecutiveGroup[];

  // data for formatted objects for tree view
  executiveGroups: ExectiveGroupNode[];
  executives: ExecutiveNode[];

  // updated prop for alert after updating a record.
  updated:boolean;

  constructor(private http: HttpClient) {
    this.rootApi = 'https://localhost:5001/api/';
  }



  // GET
  public getAllExecutives(): Observable<Executive[]> {
    return this.http.get<Executive[]>(this.rootApi+'executives');
  }

  // GET
  public getAllExecutivesPipe(): Observable<Executive[]> {
    return this.http.get<Executive[]>(this.rootApi+'executives').pipe(map(x=>x["value"]));
  }

  public getExecutive(id: number): Observable<Executive> {
    return this.http.get<Executive>(this.rootApi+'executives/'+id);
  }

  public getAllExecutiveGroups(): Observable<ExecutiveGroup[]> {
    return this.http.get<ExecutiveGroup[]>(this.rootApi+'executiveGroups');
  }

  public getAllExecutiveGroupsPipe(): Observable<ExectiveGroupNode[]> {
    return this.http.get<ExecutiveGroup[]>(this.rootApi+'executiveGroups').pipe(map(x=>x["value"]));
  }

  public getExecutiveGroup(id: number): Observable<ExecutiveGroup> {
    return this.http.get<ExecutiveGroup>(this.rootApi+'executiveGroups/'+id);
  }


  // PUT
  public updateExecutiveGroup(Id:number, ExecutiveGroupUpdated: ExecutiveGroup): void{
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

  public updateExecutive(Id:number, ExecutiveUpdated: Executive){
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

  public getFormatted():any {

    return this.getAllExecutivesPipe()
      .pipe(

        mergeMap(x => this.getAllExecutiveGroupsPipe()
          .pipe(
            map( value => value
              .map(group=> ({...group, children: x
                .map(x=>({...x,name:`${x["firstName"]} ${x["lastName"]}`}))
                .filter(executive=> executive["executiveGroup"].id === group.id) })))

            //map( value => value.map(group=> ({id: group.id, name: group.name, version: group.version, children: (x).filter(executive=> executive["executiveGroup"].id === group.id) })))

            // // map(x=>({...x,name:`${x["firstName"]} ${x["lastName"]}`})),
            // // map( value => value.map(group=> ({...group, children: x.filter(executive=> executive["executiveGroup"].id === group.id) })))
        )
      )
      )


    //).subscribe(x=> console.log(x));

    // this.getAllExecutivesPipe()
    // .pipe(
    //   map( value => value.filter(group=> group["executiveGroup"].id === 2))
    // ).subscribe(x=> console.log(x));

    // this.getAllExecutiveGroupsPipe()
    // .pipe(
    //   map( value => value.map(group=> ({id: group.id, name: group.name, children: [null] })))
    // ).subscribe(x=> console.log(x));

    // this.getAllExecutivesPipe()
    // .pipe(
    //   map( value => value.filter(group=> group["executiveGroup"].id === 2))
    // ).subscribe(x=> console.log(x));


  }



  // Formatting data in Nodes
  // This has been created to get an array of Executive Group with the executives includes and classified.
  // Here an extra Group called "All Executives" will be added on top of the array.
  public getFormattedData(): Observable<ExecutiveGroup[]> {

    return new Observable<ExecutiveGroup[]>((observer) => {
      this.getAllExecutiveGroups().subscribe(data=>
      {
        this.executiveGroups = data['value'];
        this.executiveGroupsData = data['value'];

        this.getAllExecutives().subscribe(data=>
        {
            this.executives = data['value'];
            this.executivesData = data['value'];

            this.sortOn(this.executives, "firstName");

            // adding a new group "All Executives"
            var allExecutivesGroup: ExectiveGroupNode = {"id": -1,"name": "All Executives","children": []};

            // Classifying the executives into their groups
            this.executives.forEach(exec => {
              exec.name = exec.firstName+" "+exec.lastName;
              allExecutivesGroup.children.push(exec);

              this.executiveGroups.forEach(execGroup => {
                if(exec.executiveGroup.id == execGroup.id){
                  if(execGroup.children == undefined){
                    execGroup.children = [];
                  }
                  execGroup.children.push(exec);
                }
              })
            })
            this.executiveGroups.unshift(allExecutivesGroup);
            observer.next(this.executiveGroups);
            observer.complete();
        })
      })
    })
  }

  //tool to sort the array alphabetically
  public sortOn (arr, prop) {
    arr.sort (
        function (a, b) {
            if (a[prop] < b[prop]){
                return -1;
            } else if (a[prop] > b[prop]){
                return 1;
            } else {
                return 0;
            }
        }
    );
}

}
