every route`s component is a redux container and it is found at the base of the route path

example:

`<Route component={MyComponent} />`

'MyComponent' is a redux container and it can be found
at `./app/routes/MyComponent/MyComponent.js`

---- or ----

`
<Route component={MyComponent}>
   <Route component={MySubrouteComponent} />
</Route>
`

In this case MySubRouteComponent is a redux container and
i\`s located at `./app/routes/MyComponent/routes/MySubrouteComponent/MySubrouteComponet.js`;

