### Layout components
- should be composable (i.e. must use `children / children(passedProps)` prop in render)
- must receive `containerClassName` and/or `className` props
- must NOT be connected to store
- must NOT fire actions
- must have a reduced number of import statements / dependencies
- must be a functional component whenever possible (aka no state )

Note: We may implement React Portals in the future!

Example (class component):

```js
class DashboardPageLayout extends Component {
    state = {
        simpleToggler: false
    }
    onClick = () => this.setState({ simpleToggler: !this.state.simpleToggler })
    render () {
        // guard against improper use of children (in this case should be a function)
        if (typeof this.props.children !== 'function') {
            return logger.info('[DashboardPageLayout.js] children must be a function!');
            // we can use `info` for dev => we may suppress this messages in production
        }
        return (
            <div className={`dashboard-page-root ${this.props.containerClassName}`}>
                <div className={`dashboard-page-inner ${this.props.className}`}>
                    <SidebarLayout onClick={this.onClick} />
                    <div>{this.props.children()}</div>
                </div>
            </div>
        );
    }
}
```
