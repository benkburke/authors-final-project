import 'reflect-metadata';
import { RouterGateway } from 'routing/router.gateway';
import { Router } from '../../routing/router';
import { AppTestHarness } from '../../test-tools/app-test-harness';
import { GetSuccessfulRegistrationStub } from '../../test-tools/get-successful-registration.stub';
import { NavigationPresenter } from './navigation.presenter';

let appTestHarness: AppTestHarness | null = null;
let navigationPresenter: NavigationPresenter | null = null;

describe('navigation', () => {
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
      expect(navigationPresenter!.viewModel.currentSelectedVisibleName).toBe('');
      expect(navigationPresenter!.viewModel.showBack).toBe(false);
      expect(navigationPresenter!.viewModel.menuItems).toEqual([]);
    });
  });

  // describe('login', () => {
  //   beforeEach(async () => {
  //     await appTestHarness!.setupLogin(GetSuccessfulRegistrationStub);
  //   });
  // });
});
