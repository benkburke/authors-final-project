import { observer } from 'mobx-react';
import { useInjection } from '../../core/providers/Injection';
import { LoginRegisterPresenter } from './LoginRegisterPresenter';

export const Logout = observer((props) => {
  const presenter = useInjection(LoginRegisterPresenter);

  return (
    <div
      onClick={() => {
        presenter.logOut();
      }}
      className="navigation-item"
      style={{ backgroundColor: '#5BCA06' }}
    >
      <span>☯ Logout</span>
    </div>
  );
});
