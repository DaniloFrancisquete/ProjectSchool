import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '@app/services/coures.service';
import { Category, Course } from '@app/shared/models/course';
import { catchError, debounceTime, EMPTY, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {

  public courseList: Course[] = [];
  private courseService = inject(CoursesService);
  private fb = inject(FormBuilder);
  public snackbar = inject (MatSnackBar);
  public categoryValue = Object.values(Category);
  public form!: FormGroup;
  public courseData!: Observable<any>

  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;

  private validation(): void {
    this.form = this.fb.group({
      category: [''],
      search: [''],
    });
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.validation();
    this.form.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((value) => {
      if (value) {
        this.getCourses(
          this.currentPage,
          this.pageSize,
          this.f.category.value ?? '',
          this.f.search.value ?? ''
        );
      }
    });
    this.getCourses(1, 5, '', '');
  }



  public doSearch(): void {
    console.log('Categoria:', this.f.category.value, 'Search:', this.f.search.value); // Verificar os valores
    this.getCourses(
      this.currentPage,
      this.pageSize,
      this.f.category.value ?? '',
      this.f.search.value ?? ''
    );
  }

  public getCourses(
    currentPage: number,
    pageSize: number,
    category: string,
    search: string
  ): void {
    console.log('Chamada API com parâmetros:', { currentPage, pageSize, category, search });
    this.courseData = this.courseService
      .get(currentPage, pageSize, category, search)
      .pipe(
      tap((response: HttpResponse<any>) => {
        console.log('Resposta da API:', response.body); // Verificar a resposta
        this.courseList = response.body as Course[];
        let totalCount = response.headers.get('X-Total-Count');
        this.totalCount = totalCount ? Number(totalCount) : 0;
      }),
      catchError((err: string) => {
        this.snackbar.open(err,' Close', {
          duration: 5000
        });
        return EMPTY;
      })
    )
  }

  public handlePageEvent(e: PageEvent): void {
    this.currentPage = (e.pageIndex + 1);
    this.pageSize = e.pageSize;
    this.getCourses(
      this.currentPage,
      this.pageSize,
      this.f.category.value ?? '',
      this.f.search.value ?? ''
    );
  }
}
