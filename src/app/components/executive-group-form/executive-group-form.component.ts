import { TreeviewComponent } from '../treeview/treeview.component';
import { ExecutiveGroup } from './../../classes/ExecutiveGroup/executive-group';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ExecutiveService } from 'src/app/services/executive.service';
import { NgForm } from '@angular/forms';

@Component({
  providers: [TreeviewComponent],
  selector: 'app-executive-group-form',
  templateUrl: './executive-group-form.component.html',
  styleUrls: ['./executive-group-form.component.scss']
})
export class ExecutiveGroupFormComponent implements OnInit {
  @Input() execGroupNode: ExecutiveGroup; // decorate the property with @Input()

  constructor(public execServ: ExecutiveService, public tree: TreeviewComponent) { }

  ngOnInit(): void {
  }

  onSubmitExecutiveGroup(form: NgForm): void {
    console.log(form.value);

    // formatting the Executive Group  from form (without Id) for updating.
    var ExecutiveGroupUpdated: ExecutiveGroup = {"name": form.value['name'],"version": this.execGroupNode.version };

     // calling Service for update API method
    this.execServ.updateExecutiveGroup(this.execGroupNode.id,ExecutiveGroupUpdated);
    this.execGroupNode.version++;
    // Calling to Treeview compenent for refreshing the tree view.

    this.execServ.executiveGroups=null;
    this.tree.refreshTree();
  }

  //function to close the alert for a succeed updation.
  onRemoveAlert(){
    this.execServ.updated = false;
  }

  //function to close the error alert.
  onRemoveErrorAlert(){
    this.execServ.httpError = null;
  }

}
