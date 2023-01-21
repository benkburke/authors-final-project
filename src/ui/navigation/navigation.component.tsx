import { observer } from 'mobx-react';
import { useInjection } from '../../core/providers/injection';
import { Router } from '../../routing/router';
import { Logout } from '../authentication/logout.component';
import { NavigationPresenter } from './navigation.presenter';

export const Navigation = observer((props) => {
  const presenter = useInjection(NavigationPresenter);
  const router = useInjection(Router);

  return (
    <div className="navigation-container">
      <div className="navigation-item-header" style={{ backgroundColor: '#5BCA06' }}>
        {presenter.viewModel.currentSelectedVisibleName}
      </div>
      {presenter.viewModel.menuItems.map((menuItem, i) => {
        return (
          <div
            key={i}
            className="navigation-item"
            style={{
              backgroundColor: '#3DE7CF'
            }}
            onClick={() => {
              router.goToId(menuItem.id);
            }}
          >
            {menuItem.visibleName}
          </div>
        );
      })}
      {presenter.viewModel.showBack && (
        <div
          className="navigation-item"
          onClick={() => {
            presenter.back();
          }}
          style={{ backgroundColor: '#2e91fc' }}
        >
          <span>⬅ </span>Back
        </div>
      )}
      <Logout />
    </div>
  );
});
