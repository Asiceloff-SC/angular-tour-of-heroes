import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs'; //simulates getting data from the server with the RxJS of() function.
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// The HeroService could get hero data from anywhere such as a web service, local storage, or a mock data source.

// To make sure that the HeroService can provide this service, register it with the injector. The injector is the object that chooses and injects the provider where the application requires it.
@Injectable({
  providedIn: 'root'

  // When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an application by removing the service if it isn't used.
})
export class HeroService {

  //Define the heroesUrl of the form :base/:collectionName with the address of the heroes resource on the server. Here base is the resource to which requests are made, and collectionName is the heroes data object in the in-memory-data-service.ts.
  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // The heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined in the HeroService. Add the following to the HeroService class.

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  // getHeroes(): Hero[] {
  //   return HEROES;
  //}

  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES); //of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.

  //   // Edit the getHeroes() method to send a message when the heroes are fetched.

  //   this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }

  // Convert that method to use HttpClient as follows:
  /** GET heroes from the server */
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
      //The catchError() operator intercepts an Observable that failed. The operator then passes the error to the error handling function.

      /*The following handleError() method reports the error and then returns an innocuous result so that the application keeps working.*/

      /*
      Tap into the Observable
      The HeroService methods taps into the flow of observable values  and send a message, using the log() method, to the message area  at the bottom of the page.

      The RxJS tap() operator enables this ability by looking at the observable values, doing something with those values, andpassing them along. The tap() call back doesn't access the values themselves.
      */
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      this.messageService.add(`HeroService: ${message}`);
    }


  //You've swapped of() for http.get() and the application keeps working without any other changes because both functions return an Observable<Hero[]>.

  // getHero(id: number): Observable<Hero> {
  //   // For now, assume that a hero with the specified `id` always exists.
  //   // Error handling will be added in the next step of the tutorial.
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  //   //The backtick ( ` ) characters define a JavaScript template literal for embedding the id.
  // }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
getHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;
  return this.http.get<Hero>(url).pipe(
    tap(_ => this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
  );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions). pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
  );

//   The HThe HttpClient.put() method takes three parameters:

    // The URL
    // The data to update, which is the modified hero in this case
    // Options
}

/** POST: add a new hero to the server */
addHero(hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}

/** DELETE: delete the hero from the server */
deleteHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}

  /* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}

}

/*
HTTOCLIENT METHODS RETURN ONE VALUE
All HttpClient methods return an RxJS Observable of something.

HTTP is a request/response protocol. You make a request, it returns a single response.

In general, an observable can return more than one value over time. An observable from HttpClient always emits a single value and then completes, never to emit again.

This particular call to HttpClient.get() returns an Observable<Hero[]>, which is an observable of hero arrays. In practice, it only returns a single hero array.
*/

/*
HttpClient.get() returns response data
HttpClient.get() returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> , adds TypeScript capabilities, which reduce errors during compile time.

The server's data API determines the shape of the JSON data. The Tour of Heroes data API returns the hero data as an array.

Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with the RxJS map() operator.
*/
