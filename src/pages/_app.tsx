import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { MuiThemeProvider, jssPreset } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext from "./theme";
import { create } from "jss";
import { ApolloProvider, withApollo } from "react-apollo";
import initApollo from "../services/apollo";
import apolloClient from "../components/ApolloClient/apollo-client";

class MyApp extends App<{ apolloClient: any }, {}> {
  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    const isBrowser = typeof window !== "undefined";

    const jss = create({
      ...jssPreset(),
      insertionPoint: process.browser
        ? document.getElementById("jss-insertion-point")
        : null
    });

    return (
      <Container>
        <Head>
          <title>My page</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          <JssProvider
            registry={getPageContext().sheetsRegistry}
            generateClassName={getPageContext().generateClassName}
            jss={jss}
          >
            <MuiThemeProvider
              theme={getPageContext().theme}
              sheetsManager={getPageContext().sheetsManager}
            >
              <CssBaseline />
              <Component pageContext={getPageContext()} {...pageProps} />
            </MuiThemeProvider>
          </JssProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default apolloClient(MyApp);
