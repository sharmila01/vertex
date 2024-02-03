import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta, private titleService: Title) { }

  generateTags(config) {
    config = { 
      title: 'Vertex', 
      description: 'Vertex Market', 
      image: '',
      slug: '',
      ...config
    }

    this.meta.updateTag({ property: 'og:title', content: this.titleService.getTitle()});
    this.meta.updateTag({ property: 'og:description', content: config.description });
  }

}
