import { Container } from 'inversify';
import { MessagesRepository } from './Core/Messages/MessagesRepository';
import { RouterRepository } from './Routing/RouterRepository';
import { UserModel } from './ui/authentication/UserModel';
import { NavigationRepository } from './ui/navigation/NavigationRepository';
import { Types } from './core/Types';
import { HttpGateway } from './core/HttpGateway';
import { RouterGateway } from './routing/RouterGateway';

export class IOC {
  container;

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
    this.container.bind(Types.IDataGateway).to(HttpGateway).inSingletonScope();
    this.container.bind(Types.IRouterGateway).to(RouterGateway).inSingletonScope();
  };
}

export const container = new IOC().buildBaseTemplate();
