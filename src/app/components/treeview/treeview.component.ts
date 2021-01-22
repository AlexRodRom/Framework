import { Executive, ExecutiveNode } from './../../classes/Executive/executive';
import { ExecutiveGroup,ExectiveGroupNode } from './../../classes/ExecutiveGroup/executive-group';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ExecutiveService } from 'src/app/services/executive.service';
import { map, filter} from 'rxjs/operators';

/** Flat node with expandable and level information */
interface ExecutiveFlatNode {
  expandable: boolean;
  name: string;
  id: number;
  level: number;
}

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnInit {
  @Output() execNode = new EventEmitter<any>();
  @Output() execGroupNode = new EventEmitter<any>();

  public treeControl: FlatTreeControl<ExecutiveFlatNode>;
  public treeFlattener: any;
  public dataSource: any;

  constructor(public execServ: ExecutiveService) { }

  public _transformer = (node: ExectiveGroupNode , level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      version: node.version,
      level: level,
    };
  }

  // build the tree with the Groups and the executives classified from API from Service.
  ngOnInit(): void {
    this.buildTree();
  }

  public buildTree() {
    this.treeControl = new FlatTreeControl<ExecutiveFlatNode>(
      node => node.level, node => node.expandable);

    this.treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.execServ.getFormatted().subscribe((data)=>{console.log(data);this.dataSource.data = data});

  }

  public refreshTree() {
    this.dataSource = this.execServ.executiveGroups;
  }

  hasChild = (_: number, node: ExecutiveFlatNode) => node.expandable;

  // function triggered whe select a noda ( Group: Level 0 , Executive: Level 1)
  openNode(node: ExecutiveFlatNode){
    console.log(node);

    // populate the OUTPUT with the selected Executive node to be sent to the form.
    if(node.level===1){
      //var executive: Executive = this.execServ.executivesData.find(x => x.id === node.id);
      var executive: Executive = this.dataSource.data.find(x => x.id === node.id);
      this.execGroupNode.emit(null);
      this.execNode.emit(executive);
    }
    // populate the OUTPUT with the selected Executive Group node to be sent to the form.
    else{
      //var executiveGroup: ExecutiveGroup = this.execServ.executiveGroupsData.find(x => x.id === node.id);
      var executiveGroup: ExecutiveGroup = this.dataSource.data.find(x => x.id === node.id);
      this.execNode.emit(null);
      this.execGroupNode.emit(executiveGroup);
    }
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;

    // var newGroup: ExectiveGroupNode[] = [{"id": -2,"name": "New Group","children": []}];
    // this.dataSource = newGroup;
    // // this.dataSource.data.forEach(element => {

    //   // console.log(element.children);
    //   // console.log(element.children.filter = filterValue.trim().toLowerCase());

    //   // element.children.forEach(child => {
    //   //   if(child.firstName != filterValue.trim().toLowerCase())
    //   //   {
    //   //     console.log("remove:"+ child);
    //   //     //this.dataSource
    //   //   }
    //   // });

    //   // element.filter = filterValue.trim().toLowerCase();
    //   // element.Children.forEach(child => {

    //   // });

    // // });

    // this.dataSource.filter = filterValue.trim().toLowerCase();

  }

}
