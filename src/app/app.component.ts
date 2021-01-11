import { ExecutiveGroup } from './classes/ExecutiveGroup/executive-group';
import { Executive } from './classes/Executive/executive';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FrameWorkAngular';
  execNode: Executive;
  execGroupNode: ExecutiveGroup;

  onExecNodeSelected(execNode: Executive) {
    this.execNode = execNode;
  }
  onExecGroupNodeSelected(execGroupNode: ExecutiveGroup) {
    this.execGroupNode = execGroupNode;
  }

}
