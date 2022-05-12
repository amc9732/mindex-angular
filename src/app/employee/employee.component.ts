import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  @Output() editReport: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() deleteReport: EventEmitter<Employee> = new EventEmitter<Employee>();
  allSubordinates: Employee[] = [];
  directReports: Employee[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getAllSubordinates(this.employee);

    this.employeeService.employeeEditEvent.subscribe((emp) => {
      this.directReports = this.directReports.map((e) => e.id === emp.id ? emp : e);
      this.allSubordinates = this.allSubordinates.map((e) => e.id === emp.id ? emp : e);
    });
  }

  getAllSubordinates(emp: Employee): void {
    if (!emp.directReports) {
      return;
    }
    // Loop through employee's direct report Ids
    for (const empId of emp.directReports) {
      this.employeeService.get(empId).subscribe((directReport) => {
        // Add employee to allSubordinates array
        this.allSubordinates.push(directReport);
        // Check if employee is a direct report
        if (this.employee.directReports && this.employee.directReports.includes(directReport.id)) {
          this.directReports.push(directReport);
        }

        // Recursively call function in order to get indirect reports
        this.getAllSubordinates(directReport);
      });
    }
  }
}
