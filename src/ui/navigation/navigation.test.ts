import 'reflect-metadata';
import { AppTestHarness } from 'test-tools/app-test-harness';
import { GetSuccessfulRegistrationStub } from 'test-tools/stubs/get-successful-registration.stub';
import { NavigationPresenter } from './navigation.presenter';

let appTestHarness: AppTestHarness | null = null;
let navigationPresenter: NavigationPresenter | null = null;

describe('navigation', () => {
  let setupMoveDownOne = () => {
    let selectedMenuItem: string | null = null;
    selectedMenuItem = navigationPresenter!.viewModel.menuItems[1].id;
    appTestHarness!.router.goToId(selectedMenuItem);
  };

  let setupMoveDownTwo = () => {
    setupMoveDownOne();
    setupMoveDownOne();
  };

  beforeEach(async () => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();
    appTestHarness.bootStrap(() => {});

    navigationPresenter = appTestHarness.container.get(NavigationPresenter);
  });

  it('should init appTestHarness', () => {
    expect(appTestHarness).toBeInstanceOf(AppTestHarness);
  });

  describe('before login', () => {
    it('anchor default state', () => {
      if (!navigationPresenter) {
        return;
      }

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('');
      expect(navigationPresenter.viewModel.showBack).toBe(false);
      expect(navigationPresenter.viewModel.menuItems).toEqual([]);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await appTestHarness!.setupLogin(GetSuccessfulRegistrationStub);
    });

    it('should navigate down the navigation tree', async () => {
      if (!navigationPresenter || !appTestHarness) {
        return;
      }

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > appHomeLink');
      expect(navigationPresenter.viewModel.showBack).toBe(false);
      expect(navigationPresenter.viewModel.menuItems[0]).toEqual({
        id: 'appBooksLink',
        visibleName: 'Books'
      });
      expect(navigationPresenter.viewModel.menuItems[1]).toEqual({
        id: 'appAuthorsLink',
        visibleName: 'Authors'
      });
      expect(navigationPresenter.viewModel.currentSelectedBackTarget).toEqual({ visible: false, id: null });

      setupMoveDownOne();
      expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
        'appAuthorsLink',
        undefined,
        undefined
      );
      // check menu
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > appAuthorsLink');
      expect(navigationPresenter.viewModel.showBack).toBe(true);
      expect(navigationPresenter.viewModel.menuItems[0]).toEqual({
        id: 'appAuthorsPolicyLink',
        visibleName: 'Author Policy'
      });
      expect(navigationPresenter.viewModel.currentSelectedBackTarget).toEqual({
        visible: true,
        id: 'appHomeLink'
      });
      setupMoveDownOne();
      expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
        'appAuthorsMapLink',
        undefined,
        undefined
      );

      // check menu
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('View Map > appAuthorsMapLink');
      expect(navigationPresenter.viewModel.showBack).toBe(true);
      expect(navigationPresenter.viewModel.menuItems).toEqual([]);
      expect(navigationPresenter.viewModel.currentSelectedBackTarget).toEqual({
        visible: true,
        id: 'appAuthorsLink'
      });
    });

    it('should move back twice', () => {
      if (!navigationPresenter) {
        return;
      }

      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > appHomeLink');
      setupMoveDownTwo();
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('View Map > appAuthorsMapLink');
      navigationPresenter!.back();
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Authors > appAuthorsLink');
      navigationPresenter!.back();
      expect(navigationPresenter.viewModel.currentSelectedVisibleName).toBe('Home > appHomeLink');
    });
  });
});
