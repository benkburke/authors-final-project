import { injectable } from 'inversify';
import Navigo, { NavigateOptions } from 'navigo';

@injectable()
export class RouterGateway {
  navigo: Navigo;

  registerRoutes = async (routeConfig: Record<string, unknown>) => {
    if (this.navigo) {
      return new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.navigo = new Navigo('/');
    this.navigo
      .on(routeConfig)
      .notFound(() => {
        this.goToId('notFound');
      })
      .resolve();

    return new Promise((resolve) => setTimeout(resolve, 0));
  };

  unload = () => {
    this.navigo.destroy();
  };

  goToId = async (name: string, data?: Record<string, unknown>, options?: NavigateOptions) => {
    this.navigo.navigateByName(name, data, options);
  };
}
