import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';

import { SharedModule } from '@app/shared/shared.module';
import { SupportMaterialModule } from '@app/shared/materials/support-mat.module';


@NgModule({
  declarations: [
    StudentsComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SupportMaterialModule,
    SharedModule
  ]
})
export class StudentsModule { }
