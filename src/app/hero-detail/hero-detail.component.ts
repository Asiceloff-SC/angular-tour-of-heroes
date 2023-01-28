import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  // The hero property must be an Input property, annotated with the @Input() decorator, because the external HeroesComponent binds to it like this.
  // <app-hero-detail [hero]="selectedHero"></app-hero-detail>
  @Input() hero?: Hero;

  constructor(
    private route: ActivatedRoute, //holds information about the route to this instance of the HeroDetailComponent. This component is interested in the route's parameters extracted from the URL. The "id" parameter is the id of the hero
    private heroService: HeroService, //hero data from the remote server and this component uses it to get the hero-to-display.
    private location: Location //Angular service for interacting with the browser. This service lets you navigate back to the previous view.
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

//   The route.snapshot is a static image of the route information shortly after the component was created.
// The paramMap is a dictionary of route parameter values extracted from the URL. The "id" key returns the id of the hero to fetch.
// Route parameters are always strings. The JavaScript Number function converts the string to a number, which is what a hero id should be.
getHero(): void {
  const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  this.heroService.getHero(id)
    .subscribe(hero => this.hero = hero);
}

  goBack(): void {
    this.location.back();
  }

  // persists hero name changes using the hero service updateHero() method and then navigates back to the previous view.
  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

}
