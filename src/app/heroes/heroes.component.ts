import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // heroes = HEROES;
  heroes: Hero[] = [];
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // }

  // selectedHero?: Hero;
  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

//   The parameter simultaneously defines a private heroService property and identifies it as a HeroService injection site.
// When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of HeroService.
  constructor(private heroService: HeroService, private messageService: MessageService) {}

  // Reserve the constructor for minimal initialization such as wiring constructor parameters to properties. The constructor shouldn't do anything. It certainly shouldn't call a function that makes HTTP requests to a remote server as a real data service would.

  ngOnInit(): void {
    this.getHeroes();
  }

  // retrieve the heroes from the service
    // The HeroService.getHeroes() method has a synchronous signature, which implies that the HeroService can fetch heroes synchronously. The HeroesComponent consumes the getHeroes() result as if heroes could be fetched synchronously.

  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }
  getHeroes(): void {
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }
//     This approach won't work in a real application that uses asynchronous calls. It works now because your service synchronously returns mock heroes.
// If getHeroes() can't return immediately with hero data, it shouldn't be synchronous, because that would block the browser as it waits to return data.

// In this tutorial, HeroService.getHeroes() returns an Observable so that it can use the Angular HttpClient.get method to fetch the heroes and have HttpClient.get() return an Observable.

// In response to a click event, call the component's click handler, add(), and then clear the input field so that it's ready for another name.
add(name: string): void {
  name = name.trim();
  if (!name) { return; }
  this.heroService.addHero({ name } as Hero)
    .subscribe(hero => {
      this.heroes.push(hero);
    });
}

delete(hero: Hero): void {
  this.heroes = this.heroes.filter(h => h !== hero);
  this.heroService.deleteHero(hero.id).subscribe();
}
}
