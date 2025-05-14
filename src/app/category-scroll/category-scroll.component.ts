import { Component, ElementRef, QueryList, ViewChild, ViewChildren, AfterViewInit, inject, signal, effect, viewChild, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Provider {
  name: string;
  image: string;
}

interface CategoryData {
  name: string;
  providers: Provider[];
}

@Component({
  selector: 'app-category-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-scroll.component.html',
  styleUrls: ['./category-scroll.component.css']
})
export class CategoryScrollComponent implements AfterViewInit {
  
  activeCategory = signal<string>('Sports');
  
  
  categoryContainer = viewChild.required<ElementRef>('categoryContainer');
  dataContainer = viewChild.required<ElementRef>('dataContainer');
  
  
  categorySections = viewChildren<ElementRef>('categorySection');
  categoryButtons = viewChildren<ElementRef>('categoryButton');

 
  categories = [
    'Sports', 'Dance', 'Music', 'Art', 'Fitness', 'Technology', 
    'Cooking', 'Photography', 'Education', 'Health', 'Business', 'Travel'
  ];

  data: CategoryData[] = [
    { 
      name: 'Sports', 
      providers: [
        { name: 'Sports Pro 1', image: 'assets/sports1.jpg' },
        { name: 'Sports Pro 2', image: 'assets/sports2.jpg' },
        { name: 'Sports Pro 3', image: 'assets/sports3.jpg' },
        { name: 'Sports Pro 4', image: 'assets/sports4.jpg' },
      ],
    },
    { 
      name: 'Dance', 
      providers: [
        { name: 'Dance Pro 1', image: 'assets/dance1.jpg' },
        { name: 'Dance Pro 2', image: 'assets/dance2.jpg' },
        { name: 'Dance Pro 3', image: 'assets/dance3.jpg' },
      ],
    },
    { 
      name: 'Music', 
      providers: [
        { name: 'Music Pro 1', image: 'assets/music1.jpg' },
        { name: 'Music Pro 2', image: 'assets/music2.jpg' },
      ],
    },
    { 
      name: 'Art', 
      providers: [
        { name: 'Art Pro 1', image: 'assets/art1.jpg' },
        { name: 'Art Pro 2', image: 'assets/art2.jpg' },
        { name: 'Art Pro 3', image: 'assets/art3.jpg' },
      ],
    },
    { 
      name: 'Fitness', 
      providers: [
        { name: 'Fitness Pro 1', image: 'assets/fitness1.jpg' },
        { name: 'Fitness Pro 2', image: 'assets/fitness2.jpg' },
      ],
    },
    { 
      name: 'Technology', 
      providers: [
        { name: 'Tech Pro 1', image: 'assets/tech1.jpg' },
        { name: 'Tech Pro 2', image: 'assets/tech2.jpg' },
        { name: 'Tech Pro 3', image: 'assets/tech3.jpg' },
      ],
    },
    { 
      name: 'Cooking', 
      providers: [
        { name: 'Cooking Pro 1', image: 'assets/cooking1.jpg' },
        { name: 'Cooking Pro 2', image: 'assets/cooking2.jpg' },
      ],
    },
    { 
      name: 'Photography', 
      providers: [
        { name: 'Photo Pro 1', image: 'assets/photo1.jpg' },
        { name: 'Photo Pro 2', image: 'assets/photo2.jpg' },
      ],
    },
    { 
      name: 'Education', 
      providers: [
        { name: 'Education Pro 1', image: 'assets/education1.jpg' },
        { name: 'Education Pro 2', image: 'assets/education2.jpg' },
      ],
    },
    { 
      name: 'Health', 
      providers: [
        { name: 'Health Pro 1', image: 'assets/health1.jpg' },
        { name: 'Health Pro 2', image: 'assets/health2.jpg' },
      ],
    },
    { 
      name: 'Business', 
      providers: [
        { name: 'Business Pro 1', image: 'assets/business1.jpg' },
        { name: 'Business Pro 2', image: 'assets/business2.jpg' },
      ],
    },
    { 
      name: 'Travel', 
      providers: [
        { name: 'Travel Pro 1', image: 'assets/travel1.jpg' },
        { name: 'Travel Pro 2', image: 'assets/travel2.jpg' },
      ],
    },
  ];
  
  private isScrolling = false;
  private scrollTimeout: any;

  constructor() {
    
    effect(() => {
      const category = this.activeCategory();
      this.scrollCategoryIntoView(category);
    });
  }

  ngAfterViewInit() {
    
    this.dataContainer().nativeElement.addEventListener('scroll', this.onDataScroll.bind(this));
  }

  onDataScroll() {
    if (this.isScrolling) return;
    
   
    clearTimeout(this.scrollTimeout);
    
    
    const containerTop = this.dataContainer().nativeElement.scrollTop;
    const containerHeight = this.dataContainer().nativeElement.clientHeight;
    const containerBottom = containerTop + containerHeight;
    
    let bestVisibleRatio = 0;
    let bestCategory = this.activeCategory();
    
    this.categorySections().forEach(sectionRef => {
      const section = sectionRef.nativeElement;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      
      const visibleTop = Math.max(sectionTop, containerTop);
      const visibleBottom = Math.min(sectionBottom, containerBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      
      const visibilityRatio = visibleHeight / sectionHeight;
      
      if (visibilityRatio > bestVisibleRatio) {
        bestVisibleRatio = visibilityRatio;
        bestCategory = section.getAttribute('data-category');
      }
    });
    
   
    if (bestCategory !== this.activeCategory()) {
      this.activeCategory.set(bestCategory);
    }
    
    
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 50);
  }

  selectCategory(category: string) {
    this.activeCategory.set(category);
    
  
    const categoryIndex = this.categories.indexOf(category);
    if (categoryIndex !== -1) {
      const sectionElement = this.categorySections()[categoryIndex]?.nativeElement;
      
      if (sectionElement) {
        this.isScrolling = true;
        
        this.dataContainer().nativeElement.scrollTo({
          top: sectionElement.offsetTop,
          behavior: 'smooth'
        });
        
        
        setTimeout(() => {
          this.isScrolling = false;
        }, 500);
      }
    }
  }

  scrollCategoryIntoView(category: string) {
    
    const categoryIndex = this.categories.indexOf(category);
    if (categoryIndex !== -1) {
      const buttonElement = this.categoryButtons()[categoryIndex]?.nativeElement;
      
      if (buttonElement) {
        const container = this.categoryContainer().nativeElement;
        const containerWidth = container.clientWidth;
        const buttonLeft = buttonElement.offsetLeft;
        const buttonWidth = buttonElement.offsetWidth;
        
        
        const scrollLeft = container.scrollLeft;
        const scrollRight = scrollLeft + containerWidth;
        
      
        if (buttonLeft < scrollLeft || buttonLeft + buttonWidth > scrollRight) {
          
          const targetScrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          
          container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }
}