import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { RouterRepository } from '../../routing/router.repo';
import { NavigationRepository } from './navigation.repo';

interface VM {
  showBack: boolean;
  currentSelectedVisibleName: string;
  currentSelectedBackTarget: {
    visible: boolean;
    id: null;
  };
  menuItems: { id: string; visibleName: string }[];
}

@injectable()
export class NavigationPresenter {
  @inject(NavigationRepository)
  navigationRepository: NavigationRepository;

  @inject(RouterRepository)
  routerRepository: RouterRepository;

  get viewModel() {
    const vm: VM = {
      showBack: false,
      currentSelectedVisibleName: '',
      currentSelectedBackTarget: { visible: false, id: null },
      menuItems: []
    };

    const currentNode = this.navigationRepository.currentNode;

    if (currentNode) {
      vm.currentSelectedVisibleName = this.visibleName(currentNode);
      vm.menuItems = currentNode.children.map((node) => {
        return { id: node.model.id, visibleName: node.model.text };
      });

      if (currentNode.parent) {
        vm.currentSelectedBackTarget = {
          visible: true,
          id: currentNode.parent.model.id
        };
        vm.showBack = true;
      }
    }

    return vm;
  }

  constructor() {
    makeAutoObservable(this);
  }

  visibleName = (node) => {
    return node.model.text + ' > ' + node.model.id;
  };

  back = () => {
    this.navigationRepository.back();
  };
}
