// @flow
import React, { Component } from "react";
import Route from "react-router-dom/Route";
import { Authentication, Setup, Registration, SynchronizationContainer } from "../../containers";
import { NewIdentityInterests, ProfileComplete, SetupHeader, SetupHeaderSplit } from "../";

/*::
  type ComponentProps = {
      web3Enabled: boolean
  };
 */

class SetupPages extends Component /*::<ComponentProps>*/ {
    render () {
        const { web3Enabled } = this.props;
        return (
            <div className="setup-pages">
                <div className="setup-pages__header">
                    <Route path="/" component={SetupHeaderSplit} />
                    <Route path="/setup/synchronization" component={SetupHeaderSplit} />
                </div>
                <div className="setup-pages__content">
                    <Route path="/" component={Setup} />
                    <Route path="/setup/synchronization" component={SynchronizationContainer} />
                </div>
            </div>
        );
    }
}

// const SetupPages = (props) => {
//     const {  } = props;
//     return (
//       <div className="setup-pages">
//         <div className="setup-pages__header">
//           <Route path="/" component={SetupHeaderSplit} />
//           <Route path="/setup/synchronization" component={SetupHeaderSplit} />
//           {/* <Route path="/setup/authenticate" component={SetupHeader} /> */}
//           {/* <Route path="/setup/new-identity" component={SetupHeader} /> */}
//           {/* <Route path="/setup/new-identity-interests" component={SetupHeader} /> */}
//           {/* <Route path="/setup/profile-complete" component={SetupHeader} /> */}
//         </div>
//         <div className="setup-pages__content">
//           <Route path="/" component={ConfigurationContainer} />
//           <Route path="/setup/synchronization" component={SynchronizationContainer} />
//           {/* <Route path="/setup/authenticate" component={AuthContainer} /> */}
//           {/* <Route path="/setup/new-identity" component={NewIdentityContainer} /> */}
//           {/* <Route path="/setup/new-identity-interests" component={NewIdentityInterests} /> */}
//           {/* <Route path="/setup/profile-complete" component={ProfileComplete} /> */}
//         </div>
//       </div>
//     );
// }

export default SetupPages;
