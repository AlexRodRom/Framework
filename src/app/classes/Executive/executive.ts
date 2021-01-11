import { ExecutiveGroup } from '../ExecutiveGroup/executive-group';

export class Executive {

  id?: number;
  lastName: string;
  firstName: string;
  initials: string;
  systemInitials: string;
  title: string;
  postTitle: string;
  salutation: string;
  jobTitle: string;
  officeId?: number;
  version?: number;
  executiveGroup: ExecutiveGroup;

}

export interface ExecutiveNode{
  id?: number;
  name: string;
  lastName: string;
  firstName: string;
  initials: string;
  systemInitials: string;
  title: string;
  postTitle: string;
  salutation: string;
  jobTitle: string;
  officeId?: number;
  version?: number;
  executiveGroup: ExecutiveGroup;
}

