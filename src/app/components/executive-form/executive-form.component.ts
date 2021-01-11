import { Executive } from './../../classes/Executive/executive';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExecutiveService } from 'src/app/services/executive.service';
import { TreeviewComponent } from '../treeview/treeview.component';

@Component({
  providers: [TreeviewComponent],
  selector: 'app-executive-form',
  templateUrl: './executive-form.component.html',
  styleUrls: ['./executive-form.component.scss']
})
export class ExecutiveFormComponent implements OnInit {
  @Input() execNode: Executive; // decorate the property with @Input()

  selectedGroupId: string;

  constructor(public execServ: ExecutiveService, public tree: TreeviewComponent ) { }

  ngOnInit(): void {}


  // Triggered when submitting the form.
  onSubmitExecutive(form: NgForm): void {

    console.log(form.value);

    // formatting the Executive from form (without Id) for updating.
    var ExecutiveUpdated: Executive =
    {

      "lastName": form.value['lastName'],
      "firstName": form.value['firstName'],
      "initials": form.value['initials'],
      "systemInitials": form.value['systemInitials'],
      "title": form.value['title'],
      "postTitle": form.value['postTitle'],
      "salutation": form.value['salutation'],
      "jobTitle": form.value['jobTitle'],
      "officeId": form.value['officeId'],
      "version": this.execNode.version ,
      "executiveGroup": {
          "id": this.execNode.executiveGroup.id,
          "name": "",
          "version": this.execNode.executiveGroup.version
      }

    };

    // calling Service for update API method
    this.execServ.updateExecutive(this.execNode.id,ExecutiveUpdated);
    // Calling to Treeview compenent for refreshing the tree view.
    this.tree.buildTree();
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
