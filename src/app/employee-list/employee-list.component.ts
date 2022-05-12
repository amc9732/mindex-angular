import {Component, OnInit} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';
import {EditModalComponent} from '../edit-modal/edit-modal.component';
import {DeleteModalComponent} from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe();
  }

  onEditReport(emp: Employee) {
    const editModal = this.dialog.open(EditModalComponent, {
      data: emp
    });

    editModal.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.employeeService.save({
          ...emp,
          compensation: Number(result[1])
        }).subscribe((updatedEmployee) => {
          this.employees = this.employees.map(el => el.id === updatedEmployee.id ? updatedEmployee : el);
          this.employeeService.employeeEditEvent.next(updatedEmployee);
        });
      }
    });
  }

  onDeleteReport(emp: Employee) {
    const deleteModal = this.dialog.open(DeleteModalComponent, {
      data: emp
    });

    deleteModal.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      let tempEmployees = this.employees.filter((e1) => e1.id !== emp.id);
      this.employees = tempEmployees;

      tempEmployees = tempEmployees.map((e2) => {
        if (e2.directReports && e2.directReports.includes(emp.id)) {
          const tempDirectReports = e2.directReports.filter((empId) => empId !== emp.id);
          return {
            ...e2,
            directReports: tempDirectReports
          };
        } else {
          return e2;
        }
      });
      for (const tempEmp of tempEmployees) {
        this.employeeService.save(tempEmp).subscribe((updatedEmployee) => {
          this.employees = this.employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e);
        });
      }
      this.employeeService.remove(emp).subscribe();
    });
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }
}
