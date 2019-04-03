# LillyTrialguide

A lightly opinionated framework for React/Express applications within the Lilly ecosystem.

---

- [Usage](#usage)
- [Getting Started](#getting-started)
  - [Creating a Page](#creating-a-page)
  - [Using a Page Template](#using-a-page-template)
    - [Application Template](#application-template)
- [Material UI Theme](#material-ui-theme)
- [Environment Variables](#environment-variables)
  - [Build-time Variables](#build-time-variables)
  - [Runtime Variables](#runtime-variables)
  - [Adding Temporary Environment Variables In Your Shell](#adding-temporary-environment-variables-in-your-shell)
    - [Windows (cmd.exe)](#windows-cmdexe)
    - [Linux, macOS (Bash)](#linux-macos-bash)
  - [Adding Environment Variables In `.env`](#adding-environment-variables-in-env)
    - [What other `.env` files are can be used?](#what-other-env-files-are-can-be-used)

---

## Usage

1. Clone this repository on your machine (`git clone git@github.com:EliLillyCo/MDIT_LTG.git your-app-name`)
1. Run `yarn install` to install dependencies
1. Copy `.env.sample` to `.env`
1. Start the app with `yarn start`

## Getting Started

### Creating a Page

Page components are React components that represent a view or state of the application. A Page component is usually associated with a route and a template ([see below](#using-a-page-template)).

In `src/Pages/`, create `Start.js`:

```jsx
import React from "react";
import { Typography } from "@material-ui/core";

export default function Start(props) {
  return (
    <div>
      <Typography variant="body1">Getting Started</Typography>
    </div>
  );
}
```

Next, open `src/App.js`, import `src/Pages/Start`, and add a new route to the page:

```jsx
import Start from './Pages/Start';

...

const App = () => (
  <Switch>
    <Route exact path="/start" component={Start} />
    <Route exact path="/" component={Home} />
  </Switch>
);
```

Now run `yarn start` and visit `http://localhost:3000/start` and you should see
"Getting Started" on the page.

### Using a Page Template

Since most pages share a common layout, a Page component can be wrapped in a
higher-order template component so the layout can exist in once place.

In `src/Template/`, create `GettingStartedTemplate.js`:

```jsx
import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import React, { Component } from "react";

export default function GettingStartedTemplate(WrappedPage) {
  return class extends Component {
    render() {
      return (
        <React.Fragment>
          <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6">Using LIDC React Starter</Typography>
            </Toolbar>
          </AppBar>
          <Grid container>
            <Grid container item xs={12} justify="center">
              <WrappedPage {...this.props} />
            </Grid>
          </Grid>
        </React.Fragment>
      );
    }
  };
}
```

Next, open `src/Pages/Start.js` and wrap it with the new template:

```jsx
import React from "react";
import { Typography } from "@material-ui/core";
import GettingStartedTemplate from "../Templates/GettingStartedTemplate";

function Start(props) {
  return (
    <div>
      <Typography variant="body1">Getting Started</Typography>
    </div>
  );
}

export default GettingStartedTemplate(Start);
```

Now refresh `http://localhost:3000/start` and the page will exist within the
template we created earlier.

#### Application Template

The LIDC React Starter repository includes a default template at
`src/Templates/ApplicationTemplate.js`. This template might work for all pages
within an application, but this template convention exists to handle cases where
one ore more pages breaks away from the common layout.

## Material UI Theme

Material UI enables theming by passing a theme object to a MuiThemeProvider
component. Theming allows customization of colors, fonts, sizes, padding etc.

To begin modifying the theme, edit the file at `src/muiTheme.js`.

See the [official documentation](https://material-ui.com/customization/themes/) for more details on how to override default styles and components.

## Environment Variables

### Build-time Variables

**The following environment variables are embedded during the build time.**

- `process.env.RAZZLE_PUBLIC_DIR`: Path to the public directory.
- `process.env.RAZZLE_ASSETS_MANIFEST`: Path to a file containing compiled asset outputs
- `process.env.REACT_BUNDLE_PATH`: Relative path to where React will be bundled during development. Unless you are modifying the output path of your webpack config, you can safely ignore this. This path is used by `react-error-overlay` and webpack to power up the fancy runtime error iframe. For example, if you are using common chunks and an extra entry to create a vendor bundle with stuff like react, react-dom, react-router, etc. called `vendor.js`, and you've changed webpack's output to `[name].js` in development, you'd want to set this environment variable to `/static/js/vendor.js`. If you do not make this change, nothing bad will happen, you will simply not get the cool error overlay when there are runtime errors. You'll just see them in the console. Note: This does not impact production bundling.
- `process.env.VERBOSE`: default is false, setting this to true will not clear the console when you make edits in development (useful for debugging).
- `process.env.PORT`: default is `3000`, unless changed
- `process.env.HOST`: default is `0.0.0.0`
- `process.env.NODE_ENV`: `'development'` or `'production'`
- `process.env.BUILD_TARGET`: either `'client'` or `'server'`
- `process.env.PUBLIC_PATH`: Only in used in `razzle build`. You can alter the `webpack.config.output.publicPath` of the client assets (bundle, css, and images). This is useful if you plan to serve your assets from a CDN. Make sure to _include_ a trailing slash (e.g. `PUBLIC_PATH=https://cdn.example.com/`). If you are using React and altering the public path, make sure to also [include the `crossorigin` attribute](https://reactjs.org/docs/cdn-links.html#why-the-crossorigin-attribute) on your `<script>` tag in `src/server.js`.
- `process.env.CLIENT_PUBLIC_PATH`: The `NODE_ENV=development` build's `BUILD_TARGET=client` has a different `PUBLIC_PATH` than `BUILD_TARGET=server`. Default is `http://${process.env.HOST}:${process.env.PORT + 1}/`

You can create your own custom build-time environment variables. They must start
with `RAZZLE_`. Any other variables except the ones listed above will be ignored to avoid accidentally exposing a private key on the machine that could have the same name. Changing any environment variables will require you to restart the development server if it is running.

These environment variables will be defined for you on `process.env`. For example, having an environment variable named `RAZZLE_SECRET_CODE` will be exposed in your JS as `process.env.RAZZLE_SECRET_CODE`.

### Runtime Variables

Using the dotenv package, or by defining variables in your shell (see below), you can get access to runtime environment variables. This is useful for services like Heroku which dynamically set `process.env.PORT` for example. Be careful when referencing runtime variables in isomorphic code as they will be `undefined` in the browser, but defined when running in Node. This can lead to weird behavior. If you need to make runtime variables available to the browser, it is up to you to deliver them. You can stringify them and place them on `window`...

```js
// config.js
export const runtimeConfig =
  typeof window !== "undefined"
    ? {
        // client
        myThing: window.env.myThing,
        anotherThing: window.env.anotherThing
      }
    : {
        // server
        myThing: process.env.MY_THING,
        anotherThing: process.env.ANOTHER_THING
      };
```

Now we set `window.env` as `runtimeConfig` when we go to render the HTML.

```js
import App from "./App";
import React from "react";
import express from "express";
import { renderToString } from "react-dom/server";
import serialize from "serialize-javascript"; // Safer stringify, prevents XSS attacks
import { runtimeConfig } from "./config";
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {
    const markup = renderToString(<App />);
    res.send(
      // prettier-ignore
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>window.env = ${serialize(runtimeConfig)};</script>
        <script src="${assets.client.js}" defer crossorigin></script>
    </body>
</html>`
    );
  });

export default server;
```

### Adding Temporary Environment Variables In Your Shell

Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the
life of the shell session.

#### Windows (cmd.exe)

```cmd
set RAZZLE_SECRET_CODE=abcdef&&npm start
```

(Note: the lack of whitespace is intentional.)

#### Linux, macOS (Bash)

```bash
RAZZLE_SECRET_CODE=abcdef npm start
```

### Adding Environment Variables In `.env`

To define permanent environment variables, create a file called .env in the root of your project:

```
RAZZLE_SECRET_CODE=abcdef
```

#### What other `.env` files are can be used?

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.<br>
Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

> Note: If you are defining environment variables for development, your CI and/or hosting platform will most likely need
> these defined as well. Consult their documentation how to do this. For example, see the documentation for [Travis CI](https://docs.travis-ci.com/user/environment-variables/) or [Heroku](https://devcenter.heroku.com/articles/config-vars).
