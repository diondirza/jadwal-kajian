import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import { CodeSplit } from 'code-split-component';
import NotFoundPage from './pages/not-found';
import { safeConfigGet } from '../utils/config';

import './app.scss';

const App = () => (
  <div>
    <Helmet
      htmlAttributes={safeConfigGet(['htmlPage', 'htmlAttributes'])}
      titleTemplate={safeConfigGet(['htmlPage', 'titleTemplate'])}
      defaultTitle={safeConfigGet(['htmlPage', 'defaultTitle'])}
      meta={safeConfigGet(['htmlPage', 'meta'])}
      link={safeConfigGet(['htmlPage', 'links'])}
      script={safeConfigGet(['htmlPage', 'scripts'])}
    />
    <div className="content">
      <Switch>
        <Route
          exact
          path="/"
          render={routerProps =>
            <CodeSplit chunkName="main" modules={{ HomePage: require('./pages/home') }}>
              { ({ HomePage }) => HomePage && <HomePage {...routerProps} /> }
            </CodeSplit>
          }
        />

        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </div>
);

export default App;
