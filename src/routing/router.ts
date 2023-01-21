import { inject, injectable } from 'inversify';
import { makeObservable, computed, action } from 'mobx';
import { MessagesRepository } from '../core/messages/messages.repo';
import { RouterRepository } from './router.repo';
import { UserModel } from '../ui/authentication/user.model';
import { NavigateOptions } from 'navigo';

@injectable()
export class Router {
  @inject(RouterRepository)
  routerRepository: RouterRepository;

  @inject(UserModel)
  userModel: UserModel;

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

  updateCurrentRoute = async (newRouteId: string, params?: string, query?: Record<string, unknown>) => {
    const oldRoute = this.routerRepository.findRoute(this.currentRoute.routeId);
    const newRoute = this.routerRepository.findRoute(newRouteId);
    const hasToken = !!this.userModel.token;
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
        this.routerRepository.goToId('login');
      } else if (publicOrAuthenticatedRoute) {
        if (oldRoute.onLeave) {
          oldRoute.onLeave();
        }

        if (newRoute.onEnter) {
          newRoute.onEnter();
        }

        this.routerRepository.currentRoute.routeId = newRoute.routeId;
        this.routerRepository.currentRoute.routeDef = newRoute.routeDef;
        this.routerRepository.currentRoute.params = params;
        this.routerRepository.currentRoute.query = query;
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
