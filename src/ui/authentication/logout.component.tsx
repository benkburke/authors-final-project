import { observer } from 'mobx-react';
import { useInjection } from '../../core/providers/injection';
import { LoginRegisterPresenter } from './login-register.presenter';

export const Logout = observer(() => {
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
