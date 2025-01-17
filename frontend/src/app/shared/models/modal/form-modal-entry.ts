import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export default interface FormModalEntry {
  displayName: string;
  name: string;
  searchField?: string;
  type: 'text' | 'checkbox' | 'dropdown' | 'multiselect-dropdown';
  required: boolean;
  disabled?: boolean;
  validators?: ValidatorFn[];
  fetchFunction?: (search: string) => Observable<any>;
  displayFunction?: (object: any) => string;
  getFullObjectPropertyNameForUpdate?: () => string;
}
