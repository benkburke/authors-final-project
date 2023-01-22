import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import TreeModel from 'tree-model';
import { Router } from '../../routing/router';
import { AuthenticationRepository } from '../authentication/authentication.repo';

@injectable()
export class NavigationRepository {
  @inject(AuthenticationRepository)
  authenticationRepository: AuthenticationRepository;

  @inject(Router)
  router: Router;

  get currentNode() {
    return this.getTree().all((node) => {
      return node.model.id === this.router.currentRoute.routeId;
    })[0];
  }

  constructor() {
    makeAutoObservable(this);
  }

  getTree() {
    const tree = new TreeModel();

    const root = tree.parse({
      id: 'homeLink',
      type: 'root',
      text: 'Home',
      children: []
    });

    return root;
  }

  back = () => {
    const currentNode = this.currentNode;
    this.router.goToId(currentNode.parent.model.id);
  };
}
