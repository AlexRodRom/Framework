import { ExecutiveNode } from '../Executive/executive';

export class ExecutiveGroup {
  id?: number;
  name: string;
  version?: number;
}

export interface ExectiveGroupNode {
  id?: number;
  name: string;
  version?: number;
  children?: ExecutiveNode[];
}
