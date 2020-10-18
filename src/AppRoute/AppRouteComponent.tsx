import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Props, State } from "./AppRouteModel";
import {} from "./AppRouteHelper";
import { routes } from "./AppRouteConstant";

export default class AppRoute extends React.Component<Props, State> {
  render() {
    return (
      <div className="d-flex flex-column h-100 overflow-hidden">
        <Router>
          <div className="d-flex flex-row">
            <Switch>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={(props) =>
                    route.sidebar ? <route.sidebar {...props} /> : null
                  }
                />
              ))}
            </Switch>
          </div>
          <div className="d-flex flex-row flex-fill overflow-auto">
            <Switch>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={(props) =>
                    route.main ? <route.main {...props} /> : null
                  }
                />
              ))}
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
