import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogMovieComponent } from './catalog-movie.component';

describe('CatalogMovieComponent', () => {
  let component: CatalogMovieComponent;
  let fixture: ComponentFixture<CatalogMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
