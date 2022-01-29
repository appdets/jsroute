// "use strict";

class Router {
  states = {
    routes: {},
    componentAttribute: "data-content",
    fallback: "fallback",
    shownDisplay: "inherit",
    hiddenDisplay: "none",
    middleware: () => {},
  };

  development = true;

  log = (...args) => {
    if (this.development) {
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
    this.routeUpdated();
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
      this.log("route matched", route);
      if ("title" in route && route.title) this.setDocumentTitle(route.title);
      this.showCurrentScreen(route);
    } else {
      this.log("route not matched", route);
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
    } else if (!route.registered) {
      currentScreen = document.querySelector(this.makeSelector(this.states.fallback))
      if (currentScreen) {
         this.hideScreens();
         currentScreen.style.display = this.states.shownDisplay;
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

  use(routes) {
    this.states.routes = routes;
    return this;
  }

  route(path) {
    path = this.trim(path.toString())
    window.location.hash = path
  }
  
}

export default new Router();
