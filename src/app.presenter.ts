import { MessagesRepository } from 'core/messages/messages.repo';
import { inject, injectable } from 'inversify';
import { computed, makeObservable } from 'mobx';
import { Router } from 'routing/router';

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
