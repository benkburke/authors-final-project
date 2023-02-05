import { User } from 'domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { action, computed, makeObservable } from 'mobx';
import { NavigateOptions } from 'navigo';
import { MessagesRepository } from '../core/messages/messages.repo';
import { RouterRepository } from './router.repo';

@injectable()
export class Router {
  @inject(RouterRepository)
  routerRepository: RouterRepository;

  @inject(User)
  user: User;

  @inject(MessagesRepository)
  messagesRepository: MessagesRepository;

  get currentRoute() {
    return this.routerRepository.currentRoute;
  }

  constructor() {
    makeObservable(this, {
      currentRoute: computed,
      updateCurrentRoute: action
    });
  }

  updateCurrentRoute = async (
    newRouteId: string,
    data?: Record<string, unknown>,
    options?: NavigateOptions
  ) => {
    const oldRoute = this.routerRepository.findRoute(this.currentRoute.routeId);
    const newRoute = this.routerRepository.findRoute(newRouteId);
    const hasToken = !!this.user.token;
    const routeChanged = oldRoute.routeId !== newRoute.routeId;
    const protectedOrUnauthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === false) || newRoute.routeDef.path === '*';
    const publicOrAuthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === true) || newRoute.routeDef.isSecure === false;

    if (routeChanged) {
      if (this.routerRepository.onRouteChanged) {
        this.routerRepository.onRouteChanged();
      }

      if (protectedOrUnauthenticatedRoute) {
        this.routerRepository.goToId('loginLink');
      } else if (publicOrAuthenticatedRoute) {
        if (oldRoute.onLeave) {
          oldRoute.onLeave();
        }

        if (newRoute.onEnter) {
          newRoute.onEnter();
        }

        this.routerRepository.currentRoute.routeId = newRoute.routeId;
        this.routerRepository.currentRoute.routeDef = newRoute.routeDef;
        this.routerRepository.currentRoute.data = data;
        this.routerRepository.currentRoute.options = options;
      }
    }
  };

  registerRoutes = (onRouteChange: () => void) => {
    this.routerRepository.registerRoutes(this.updateCurrentRoute, onRouteChange);
  };

  goToId = async (routeId: string, data?: Record<string, unknown>, options?: NavigateOptions) => {
    this.routerRepository.goToId(routeId, data, options);
  };
}
