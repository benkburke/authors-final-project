import { RouterGateway } from 'routing/router.gateway';
import { Router } from '../../routing/router';
import { RouterRepository } from '../../routing/router.repo';
import { AppTestHarness } from '../../test-tools/app-test-harness';

let appTestHarness: AppTestHarness | null = null;
let router: Router | null = null;
let routerRepository: RouterRepository | null = null;
let routerGateway: RouterGateway | null = null;
let onRouteChange: (() => void) | null = null;

describe('init', () => {
  beforeEach(() => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();

    router = appTestHarness.container.get(Router);
    routerRepository = appTestHarness.container.get(RouterRepository);
    routerGateway = appTestHarness.container.get(RouterGateway);
    onRouteChange = () => {};
  });

  it('should be an null route', () => {
    expect(routerRepository!.currentRoute.routeId).toBe(null);
  });

  describe('bootstrap', () => {
    beforeEach(() => {
      appTestHarness!.bootStrap(onRouteChange);
    });

    it('should start at null route', () => {
      expect(routerRepository!.currentRoute.routeId).toBe(null);
    });

    describe('routing', () => {
      it('should block wildcard *(default) routes when not logged in', () => {
        router!.goToId('default');

        expect(routerGateway!.goToId).toHaveBeenLastCalledWith('loginLink');
      });

      it('should block secure routes when not logged in', () => {
        router!.goToId('homeLink');

        expect(routerGateway!.goToId).toHaveBeenLastCalledWith('loginLink');
      });

      it('should allow public route when not logged in', () => {
        router!.goToId('authorPolicyLink');

        expect(routerGateway!.goToId).toHaveBeenLastCalledWith('authorPolicyLink');
      });
    });
  });
});
