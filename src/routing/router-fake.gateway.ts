import { injectable } from 'inversify';
import Navigo from 'navigo';

@injectable()
export class FakeRouterGateway {
  navigo: Navigo;

  registerRoutes = async (routeConfig) => {};

  unload = () => {};

  goToId = async (routeId) => {};
}
