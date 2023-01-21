import { Container } from 'inversify';
import { HttpGateway } from './core/http.gateway';
import { MessagesRepository } from './core/messages/messages.repo';
import { RouterGateway } from './routing/router.gateway';
import { RouterRepository } from './routing/router.repo';
import { UserModel } from './ui/authentication/user.model';
import { NavigationRepository } from './ui/navigation/navigation.repo';

export class IOC {
  container: Container;

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Transient'
    });
  }

  buildBaseTemplate = () => {
    this.container.bind(MessagesRepository).to(MessagesRepository).inSingletonScope();
    this.container.bind(RouterRepository).to(RouterRepository).inSingletonScope();
    this.container.bind(NavigationRepository).to(NavigationRepository).inSingletonScope();
    this.container.bind(UserModel).to(UserModel).inSingletonScope();

    return this.container;
  };

  buildAppTemplate = () => {
    this.container.bind(HttpGateway).to(HttpGateway).inSingletonScope();
    this.container.bind(RouterGateway).to(RouterGateway).inSingletonScope();
  };
}

export const container = new IOC().buildBaseTemplate();
