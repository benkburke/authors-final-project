import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import TreeModel from 'tree-model';
import { Router } from '../../routing/router';

@injectable()
export class NavigationRepository {
  @inject(Router)
  router: Router;

  constructor() {
    makeAutoObservable(this);
  }

  get currentNode() {
    return this.getTree().all((node) => {
      return node.model.id === this.router.currentRoute.routeId;
    })[0];
  }

  getTree() {
    const tree = new TreeModel();

    const root = tree.parse({
      id: 'appHomeLink',
      type: 'root',
      text: 'Home',
      children: [
        {
          id: 'appBooksLink',
          type: 'link',
          text: 'Books'
        },
        {
          id: 'appAuthorsLink',
          type: 'link',
          text: 'Authors',
          children: [
            {
              id: 'appAuthorsPolicyLink',
              type: 'link',
              text: 'Author Policy'
            },
            {
              id: 'appAuthorsMapLink',
              type: 'link',
              text: 'View Map'
            }
          ]
        }
      ]
    });

    return root;
  }

  back = () => {
    const currentNode = this.currentNode;
    this.router.goToId(currentNode.parent.model.id);
  };
}
