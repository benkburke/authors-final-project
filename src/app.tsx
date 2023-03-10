import { useInjection } from 'core/providers/injection';
import { useValidation } from 'core/providers/validation';
import { observer } from 'mobx-react';
import * as React from 'react';
import { LoginRegister } from 'ui/authentication/login-register.component';
import { Authors } from 'ui/authors/authors.component';
import { Books } from 'ui/books/books.component';
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
      id: 'appHomeLink',
      component: <Home key="appHomeLink" />
    },
    {
      id: 'appBooksLink',
      component: <Books key="appBooksLink" />
    },
    {
      id: 'appAuthorsLink',
      component: <Authors key="appAuthorsLink" />
    }
  ];

  return (
    <div className="container">
      {presenter.currentRoute.routeId === 'loginLink' ? (
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
