import { useInjection } from 'core/providers/injection';
import { useValidation } from 'core/providers/validation';
import { observer } from 'mobx-react';
import * as React from 'react';
import { LoginRegister } from 'ui/authentication/login-register.component';
import { Home } from 'ui/home/home.component';
import { Navigation } from 'ui/navigation/navigation.component';
import { AppPresenter } from './app.presenter';

export const App = observer(() => {
  const presenter = useInjection(AppPresenter);
  const { updateClientValidationMessages } = useValidation();

  React.useEffect(() => {
    presenter.load(onRouteChange);
  }, []);

  const onRouteChange = () => {
    updateClientValidationMessages([]);
  };

  const renderedComponents = [
    {
      id: 'appHome',
      component: <Home key="appHome" />
    }
  ];

  return (
    <div className="container">
      {presenter.currentRoute.routeId === 'login' ? (
        <LoginRegister />
      ) : (
        <div className="w3-row">
          <div className="w3-col s4 w3-center">
            <Navigation />
          </div>
          <div className="w3-col s8 w3-left">
            {renderedComponents.map((current) => {
              return presenter.currentRoute.routeId === current.id && current.component;
            })}
          </div>
        </div>
      )}
    </div>
  );
});
