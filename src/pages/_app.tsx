import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { MuiThemeProvider, jssPreset } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { JssProvider } from "react-jss";
import getPageContext from "../services/style-context";
import { create } from "jss";
import { ApolloProvider } from "react-apollo";
import ApplicationTemplate from "../templates/application-template";
import WithApollo from "../components/ApolloClient";

declare global {
  namespace NodeJS {
    interface Process {
      browser?: boolean;
    }

    interface Global {
      fetch?: any;
    }
  }
}

class MyApp extends App<{ apolloClient: any }, {}> {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const isBrowser = typeof window !== "undefined";
    const pageContext = getPageContext();

    const jss = create({
      ...jssPreset(),
      insertionPoint: isBrowser
        ? document.getElementById("jss-insertion-point")
        : null
    });

    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>My page</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={pageContext.sheetsRegistry}
            generateClassName={pageContext.generateClassName}
            jss={jss}
          >
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={pageContext.theme}
              sheetsManager={pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
              <ApplicationTemplate>
                <Component pageContext={pageContext} {...pageProps} />
              </ApplicationTemplate>
            </MuiThemeProvider>
          </JssProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default WithApollo(MyApp);
