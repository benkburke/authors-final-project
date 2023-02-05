import { inject, injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import { NavigateOptions } from 'navigo';
import { BooksRepository } from 'ui/books/books.repo';
import { RouterGateway } from './router.gateway';

interface Route {
  routeId: string | null;
  routeDef: {
    path: string | null;
    isSecure: boolean;
  };
  data?: Record<string, unknown> | null;
  options?: NavigateOptions | null;
  onEnter?: () => void;
  onLeave?: () => void;
}

@injectable()
export class RouterRepository {
  currentRoute: Route = {
    data: null,
    options: null,
    routeId: null,
    routeDef: {
      path: null,
      isSecure: false
    }
  };

  @inject(RouterGateway)
  routerGateway: RouterGateway;

  @inject(BooksRepository)
  booksRepository: BooksRepository;

  onRouteChanged: (() => void) | null = null;

  routes: Route[] = [
    {
      routeId: 'loginLink',
      routeDef: {
        path: '/login',
        isSecure: false
      }
    },
    {
      routeId: 'appHomeLink',
      routeDef: {
        path: '/app/home',
        isSecure: true
      }
    },
    {
      routeId: 'appBooksLink',
      routeDef: {
        path: '/app/books',
        isSecure: true
      },
      onEnter: () => {
        this.booksRepository.load();
      },
      onLeave: () => {
        this.booksRepository.reset();
      }
    },
    {
      routeId: 'appBooksAddLink',
      routeDef: {
        path: '/app/books/add',
        isSecure: true
      }
    },
    {
      routeId: 'appAuthorsLink',
      routeDef: {
        path: '/app/authors',
        isSecure: true
      }
    },
    {
      routeId: 'appAuthorsPolicyLink',
      routeDef: {
        path: '/app/authors/policy',
        isSecure: false
      }
    },
    {
      routeId: 'appAuthorsMapLink',
      routeDef: {
        path: '/app/authors/map',
        isSecure: false
      }
    },
    {
      routeId: 'notFoundLink',
      routeDef: {
        path: '/not-found',
        isSecure: false
      }
    },
    {
      routeId: 'defaultLink',
      routeDef: {
        path: '*',
        isSecure: false
      },
      onEnter: () => {
        return;
      },
      onLeave: () => {
        return;
      }
    }
  ];

  constructor() {
    makeObservable(this, {
      currentRoute: observable
    });
  }

  registerRoutes = (
    updateCurrentRoute: (
      newRouteId: string,
      data?: Record<string, unknown>,
      options?: NavigateOptions
    ) => void,
    onRouteChanged: () => void
  ) => {
    const routeConfig = {};

    this.onRouteChanged = onRouteChanged;

    this.routes.forEach((routeArg) => {
      const route = this.findRoute(routeArg.routeId);
      const path = route.routeDef.path ?? '';

      routeConfig[path] = {
        as: routeArg.routeId,
        uses: (match: { data?: Record<string, unknown>; options?: NavigateOptions }) => {
          updateCurrentRoute(route.routeId ?? '', match.data, match.options);
        }
      };
    });

    this.routerGateway.registerRoutes(routeConfig);
  };

  findRoute(routeId: string | null) {
    const route = this.routes.find((route) => {
      return route.routeId === routeId;
    });

    return (
      route || {
        routeId: 'loadingSpinner',
        routeDef: { path: '', isSecure: false },
        onEnter: () => {
          return;
        },
        onLeave: () => {
          return;
        }
      }
    );
  }

  goToId = async (routeId: string, data?: Record<string, unknown>, options?: NavigateOptions) => {
    this.routerGateway.goToId(routeId, data, options);
  };
}
