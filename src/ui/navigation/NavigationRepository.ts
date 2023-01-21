import { inject, injectable } from 'inversify';
import { action, computed, makeObservable } from 'mobx';
import TreeModel from 'tree-model';
import { AuthenticationRepository } from '../authentication/AuthenticationRepository';
import { Router } from '../../routing/Router';

@injectable()
export class NavigationRepository {
  @inject(AuthenticationRepository)
  authenticationRepository;

  @inject(Router)
  router;

  get currentNode() {
    var self = this;
    return this.getTree().all(function (node) {
      return node.model.id === self.router.currentRoute.routeId;
    })[0];
  }

  constructor() {
    makeObservable(this, {
      currentNode: computed,
      back: action
    });
  }

  getTree() {
    let tree = new TreeModel();

    let root = tree.parse({
      id: 'homeLink',
      type: 'root',
      text: 'Home',
      children: []
    });

    return root;
  }

  back = () => {
    let currentNode = this.currentNode;
    this.router.goToId(currentNode.parent.model.id);
  };
}
