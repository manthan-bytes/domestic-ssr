import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetaTag } from '@core/interfaces/meta-tags.interface';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  private siteDescription = 'description';
  private siteKeywords = 'keywords';
  private facebookUrlMeta = 'og:url';
  private facebookTitleMeta = 'og:title';
  private facebookDescriptionMeta = 'og:description';
  private facebookImageMeta = 'og:image';
  private facebookSecureImageMeta = 'og:image:secure_url';
  private twitterTitleMeta = 'twitter:text:title';
  private twitterImageMeta = 'twitter:image';
  private description: string;

  constructor(private title: Title, private metaService: Meta) {}

  setTitle(title: string) {
    this.title.setTitle(title);
  }

  setSocialMediaTags(url: string, image: string, title?: string, description?: string): void {
    /* TODO: make service prerender and image configurable */
    url = `http://service.prerender.io/${url}`;
    image = image || 'https://www.runragnar.com/images/logo-shop.png';
    title = title || this.title.getTitle();
    description = description || this.description;
    const tags = [
      new MetaTag(this.facebookUrlMeta, url, true),
      new MetaTag(this.facebookTitleMeta, title, true),
      new MetaTag(this.facebookDescriptionMeta, description, true),
      new MetaTag(this.facebookImageMeta, image, true),
      new MetaTag(this.facebookSecureImageMeta, image, true),
      new MetaTag(this.twitterTitleMeta, title, false),
      new MetaTag(this.twitterImageMeta, image, false),
    ];
    this.setTags(tags);
  }

  setSiteMetaTags(description: string, keywords: string) {
    this.description = description;
    const tags = [new MetaTag(this.siteDescription, description, false), new MetaTag(this.siteKeywords, keywords, false)];
    this.setTags(tags);
  }

  setGenricMetaTags(data: {
    title: string;
    description: string;
    keywords: string;
    properties: { ogImageUrl: string; ogImage: string };
  }): void {
    this.title.setTitle(data.title || 'Ragnar');

    if (data.description) {
      this.metaService.updateTag({ name: 'description', content: data.description });
    } else {
      this.metaService.removeTag('name="description"');
    }

    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    } else {
      this.metaService.removeTag('name="keywords"');
    }

    const properties = data.properties || { ogImage: '', ogImageUrl: '' };

    if (properties.ogImageUrl) {
      this.metaService.updateTag({ property: 'og:image:url', content: properties.ogImageUrl });
    } else {
      this.metaService.removeTag('property="og:image:url"');
    }

    if (properties.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: properties.ogImage });
    } else {
      this.metaService.removeTag('property="og:image"');
    }
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach((siteTag) => {
      if (siteTag.isFacebook) {
        this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
      } else {
        this.metaService.updateTag({ name: siteTag.name, content: siteTag.value });
      }
    });
  }
}
