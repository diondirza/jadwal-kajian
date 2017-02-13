
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { CodeSplitProvider, createRenderContext } from 'code-split-component';
import Helmet from 'react-helmet';
import generateHTML from './generateHTML';
import App from '../../../shared/app';
import config from '../../../../config';

/**
 * An express middleware that is capabable of service our React application,
 * supporting server side rendering of the application.
 */
function reactApplicationMiddleware(request, response) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config.disableSSR) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR');
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = generateHTML({
      nonce,
    });
    response.status(200).send(html);
    return;
  }

  // First create a context for <ServerRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  // We also create a context for our <CodeSplitProvider> which will allow us
  // to query which chunks/modules were used during the render process.
  const codeSplitContext = createRenderContext();

  // Create our React application and render it into a string.
  const reactAppString = renderToString(
    <CodeSplitProvider context={codeSplitContext}>
      <StaticRouter location={request.url} context={reactRouterContext}>
        <App />
      </StaticRouter>
    </CodeSplitProvider>,
  );

  // Generate the html response.
  const html = generateHTML({
    reactAppString,
    nonce,
    helmet: Helmet.rewind(),
    codeSplitState: codeSplitContext.getState(),
  });

  // Check if the render result contains a redirect, if so we need to set
  // the specific status and redirect header and end the response.
  if (reactRouterContext.url) {
    response.writeHead(302, { Location: reactRouterContext.url });
    response.end();
    return;
  }

  response.status(200).send(html);
}

export default (reactApplicationMiddleware);
