import {Component, Inject} from '@angular/core';
import {Employee} from '../employee';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) { }

}
