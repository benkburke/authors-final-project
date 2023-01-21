import { observer } from 'mobx-react';
import { AppPresenter } from './app.presenter';
import { useInjection } from './core/providers/injection';
import { LoginRegister } from './ui/authentication/login-register.component';
import { Home } from './ui/home/home.component';
import { Navigation } from './ui/navigation/navigation.component';

export const App = observer(() => {
  const presenter = useInjection(AppPresenter);

  const renderedComponents = [
    {
      id: 'homeLink',
      component: <Home key="homePage" />
    }
  ];

  return (
    <div className="container">
      {presenter.currentRoute.routeId === 'loginLink' ? (
        <>
          <LoginRegister />
        </>
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
