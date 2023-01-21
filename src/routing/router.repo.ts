import { inject, injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import { NavigateOptions } from 'navigo';
import { RouterGateway } from './router.gateway';

interface Route {
  routeId: string | null;
  routeDef: {
    path: string | null;
    isSecure: boolean;
  };
  params?: string | null;
  query?: Record<string, unknown> | null;
  onEnter?: () => void;
  onLeave?: () => void;
}

@injectable()
export class RouterRepository {
  currentRoute: Route = {
    routeId: null,
    routeDef: {
      path: null,
      isSecure: false
    },
    params: null,
    query: null
  };

  @inject(RouterGateway)
  routerGateway: RouterGateway;

  onRouteChanged: (() => void) | null = null;

  routes: Route[] = [
    {
      routeId: 'login',
      routeDef: {
        path: '/login',
        isSecure: false
      }
    },
    {
      routeId: 'appHome',
      routeDef: {
        path: '/app/home',
        isSecure: true
      }
    },
    {
      routeId: 'notFound',
      routeDef: {
        path: '/not-found',
        isSecure: false
      }
    },
    {
      routeId: 'default',
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
    updateCurrentRoute: (newRouteId: string, params: string, query: Record<string, unknown>) => void,
    onRouteChanged: () => void
  ) => {
    const routeConfig = {};

    this.onRouteChanged = onRouteChanged;

    this.routes.forEach((routeArg) => {
      const route = this.findRoute(routeArg.routeId);
      const path = route.routeDef.path ?? '';

      routeConfig[path] = {
        as: routeArg.routeId,
        uses: (match: { params: string; query: Record<string, unknown> }) => {
          updateCurrentRoute(route.routeId ?? '', match.params, match.query);
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
