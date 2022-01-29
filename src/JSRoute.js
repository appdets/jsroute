"use strict";

class JSRoute {
  states = {
    default: "/",
    routes: {},
    componentAttribute: "data-content",
    fallback: "fallback",
    shownDisplay: "inherit",
    hiddenDisplay: "none",
  };

  debug = false;

  log = (...args) => {
    if (this.debug) {
      console.log(
        "%c" + "Router",
        "background: olive; color: white; padding: 2px 4px; font-size: 9px;",
        ...args
      );
    }
  };

  getRoutes = () => {
    return this.states.routes || {};
  };

  init = () => {
    this.hideScreens();
    this.registerEvents();
    window.location.hash = this.states.default
    this.routeUpdated();
    Object.freeze(this.states);
    document.dispatchEvent(new CustomEvent("JSRoute.init", { detail: {route: this.currentRoute}}));
  };

  hideScreens() {
    let screens = document.querySelectorAll(
      "[" + this.states.componentAttribute + "]"
    );
    if (screens) {
      screens.forEach((screen) => {
        screen.style.display = this.states.hiddenDisplay;
      });
      this.log("Hidden all screens", screens);
    }
  }

  setRoute = (path) => {
    let route = this.getRoute(path);
    if (route) {
      this.log("Route matched", route);
      if ("title" in route && route.title) this.setDocumentTitle(route.title);
      this.showCurrentScreen(route);
    } else {
      this.log("Route not matched", route);
    }
  };

  registerEvents = () => {
    window.addEventListener("hashchange", this.routeUpdated);
  };

  routeUpdated = (event) => {
    this.log("Current route", this.getCurrentHash());
    this.setRoute(this.getCurrentHash());
  };

  makeSelector = (path) => {
    return "[" + this.states.componentAttribute + "='" + path + "']";
  };

  showCurrentScreen = (route) => {
    let currentScreen = null;

    if ("selector" in route && route.selector) {
      currentScreen = document.querySelector(route.selector);
    }

    if (!currentScreen) {
      currentScreen = document.querySelector(
        this.makeSelector(this.trim(route.path))
      );
    }

    if (!currentScreen) {
      currentScreen = document.querySelector(
        this.makeSelector(this.format(route.path))
      );
    }

    if (currentScreen) {
      this.hideScreens();
      currentScreen.style.display = this.states.shownDisplay;
      document.dispatchEvent(
        new CustomEvent("JSRoute.change", { detail: {route} })
      );
    } else {
      currentScreen = document.querySelector(
        this.makeSelector(this.states.fallback)
      );
      if (currentScreen) {
        this.hideScreens();
        currentScreen.style.display = this.states.shownDisplay;
        document.dispatchEvent(
          new CustomEvent("JSRoute.error", { detail: {route} })
        );
      }
    }

    this.log(route);
  };

  getRoute = (path) => {
    let routes = Object.keys(this.getRoutes()).map((route) => this.trim(route));

    if (routes) {
      let foundRoute = routes.find((route) => {
        let regex = new RegExp(route);
        return regex.test(path) || regex === route;
      });

      let route =
        this.states.routes[this.trim(foundRoute)] ||
        this.states.routes[this.format(foundRoute)];

      if (route) {
        return {
          path: this.trim(path),
          registered: route != false,
          title: route.title,
          selector: route.selector || null,
        };
      }
    }

    return {
      path: this.trim(path),
      registered: false,
      title: null,
      selector: null,
    };
  };

  getCurrentHash = () => {
    let hash = window.location.hash;
    if (hash) {
      hash = hash.toString().replace("#", "");
      return this.trim(hash);
    }
    return "/";
  };

  currentRoute = () => {
    return this.getRoute(this.getCurrentHash());
  };

  format = (path) => {
    if (!path) return "/";
    if (!path.startsWith("/")) path = "/" + path;
    if (path.endsWith("/")) path = path.slice(-1);
    return path || "/";
  };

  trim = (path) => {
    if (!path) return "/";
    if (path.startsWith("/")) path = path.slice(1);
    if (path.endsWith("/")) path = path.slice(-1);
    return path || "/";
  };

  setDocumentTitle = (title) => {
    let dom = document.querySelector("title");
    if (dom) {
      dom.innerHTML = title;
    }
  };

  use = (states) => {
    states = Object.assign(this.states, states);
    this.log(states);
    this.states = states;
    return this;
  };

  route = (path) => {
    path = this.trim(path.toString());
    window.location.hash = path;
    return this;
  };

  debug = (debug = true) => {
    this.debug = debug;
    return this;
  };
}

export default new JSRoute();
