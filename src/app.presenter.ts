import { inject, injectable } from 'inversify';
import { makeObservable, computed } from 'mobx';
import { MessagesRepository } from './core/messages/MessagesRepository';
import { Router } from './routing/Router';

@injectable()
export class AppPresenter {
  @inject(Router)
  router: Router;

  @inject(MessagesRepository)
  messagesRepository: MessagesRepository;

  get currentRoute() {
    return this.router.currentRoute;
  }

  constructor() {
    makeObservable(this, {
      currentRoute: computed
    });
  }

  load = (onRouteChange: () => void) => {
    const onRouteChangeWrapper = () => {
      this.messagesRepository.appMessages = [];
      onRouteChange();
    };
    this.router.registerRoutes(onRouteChangeWrapper);
  };
}
