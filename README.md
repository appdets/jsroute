**JSRoute** is a tiny, lightweight, and simple Hash Router made with Pure Vanilla JavaScript for modern browsers. JSRoute is mainly targeted for Lazy WordPress plugin developers. Unlike React or Vue, JSRoute can work with existing DOM without any components. 

# Install
**Using NPM**
 
```bash
npm i -D jsroute
```

**Using CDN**

```html
<script src="https://unpkg.com/jsroute/jsroute.min.js"></script>
```

**Manual download**

- [x] [Download from GIT](https://github.com/appdets/jsroute/archive/refs/heads/master.zip) and extract the zip
- [x] Copy `jsroute.min.js` to your working directory
- [x] Link the `jsroute.min.js` file to your HTML

<br/>
<br/> 

# Use Router


**In HTML**

```html
<a href="#"> Home </a>
<a href="#about"> About </a>
<a href="#profile"> Profile </a>

<div data-content="/">Home page</div>
<div data-content="/about">About page</div>
<div data-content="/profile">Profile page</div>
```

**In JavaScript (ES6)**

```js
import JSRoute from "jsroute"

window.JSRoute = JSRoute //recommended 

JSRoute.init()
```

**In JavaScript (CDN)**

```js
const JSRoute = window.JSRoute

JSRoute.init()
```

NOTE: Load JavaScript at footer, NOT as defered or async

<br/>
<br/>

# Advanced

## Configuration

```js
const routes = {
    // path : title (to update dom title), path supports regular expression
    "/" :                       { title: "Home page" },
    "/about" :                  { title: "About page" },
    "/contact" :                { title: "Contact page" }, 
    "/profile/[a-zA-Z0-9]" :    { title: "User Profile" },
}

const configs = {
    default: "/",                       // default route after loaded the page
    componentAttribute: "data-content", // the selector attribute of screens
    fallback: "fallback",               // fallback screen value [data-content='fallback']
    shownDisplay: "inherit",            // style.display = 'inherit'
    hiddenDisplay: "none",              // style.display = 'none'
    routes                              
}

// init configuration by passing through `use` method
JSRoute.use(configs).init()
```

## Handle Route

You can easily set route programmatically 

```js
// Use anywhere
JSRoute.route('about')
// immediately changes path to #/about
```

## Custom Events 

JSRoute has three custom event you can use with your app

`JSRoute.init`

Triggers when Router is initialized

```js
document.addEventListener("JSRoute.init", (e) => {
    const route = e.detail.route
    
    console.log(route)
})
```

`JSRoute.change`

Triggers when Router is updated

```js
document.addEventListener("JSRoute.change", (e) => {
    const route = e.detail.route
    
    console.log(route)
})
```

`JSRoute.error`

Triggers when a wrong path is requested

```js
document.addEventListener("JSRoute.error", (e) => {
    const route = e.detail.route
    
    console.log(route)
})
```

## Debug Router 

Enable logs on every action happening on the Router

```js
JSRoute.debug(true).init()
```