import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function UsernameInput({ value = "", onChange, placeholder = "Enter username", playerNumber }) {
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    playerNumber !== void 0 && /* @__PURE__ */ jsxs("span", { children: [
      "Player #",
      playerNumber,
      ": "
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        className: "username-input",
        value: inputValue,
        onChange: handleChange,
        placeholder
      }
    )
  ] });
}
function TeamPlayerInputs({ teamNumber }) {
  const [usernames, setUsernames] = useState(Array(5).fill(""));
  const handleUsernameChange = (index, value) => {
    const updated = [...usernames];
    updated[index] = value;
    setUsernames(updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "team-player-inputs", children: [
    /* @__PURE__ */ jsxs("h2", { children: [
      "Team #",
      teamNumber
    ] }),
    Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(
      UsernameInput,
      {
        playerNumber: i + 1,
        value: usernames[i],
        onChange: (value) => handleUsernameChange(i, value)
      },
      i
    ))
  ] });
}
function HomePage() {
  return /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsx("header", { children: /* @__PURE__ */ jsxs("div", { className: "header", children: [
      /* @__PURE__ */ jsx("h1", { children: "Summoner Showdown" }),
      /* @__PURE__ */ jsxs("h3", { children: [
        "By ",
        /* @__PURE__ */ jsx("a", { href: "https://github.com/angelala3252", children: "angelala3252" }),
        " and ",
        /* @__PURE__ */ jsx("a", { href: "https://github.com/ilanivek", children: "ilanivek" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "body-container", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Welcome to Summoner Showdown, a League of Legends match predictor based off of ELO of each summoner in a match!",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("br", {}),
        "To get started, please input the in-game usernames of all summoners:"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "input-container", children: [
        /* @__PURE__ */ jsx(TeamPlayerInputs, { teamNumber: 1 }),
        /* @__PURE__ */ jsx(TeamPlayerInputs, { teamNumber: 2 })
      ] })
    ] })
  ] }) });
}
function meta({}) {
  return [{
    title: "Summoner Showdown"
  }, {
    name: "description",
    content: "Welcome to Summoner Showdown!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(HomePage, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DrPHaCgo.js", "imports": ["/assets/chunk-C37GKA54-DbvhLxwn.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Cl2J5IS7.js", "imports": ["/assets/chunk-C37GKA54-DbvhLxwn.js"], "css": ["/assets/root-QLPvu8kQ.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CGw76RDK.js", "imports": ["/assets/chunk-C37GKA54-DbvhLxwn.js"], "css": ["/assets/home-Bj3crLW7.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-1f3da3c6.js", "version": "1f3da3c6", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
