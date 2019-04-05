import { SheetsRegistry } from "jss";
import { createGenerateClassName } from "@material-ui/core/styles";
import theme from "../templates/theme";

const createPageContext = () => {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  };
};

let pageContext;

const getPageContext = () => {
  const isBrowser = typeof window !== "undefined";
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!isBrowser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }
  return pageContext;
};

export default getPageContext;
