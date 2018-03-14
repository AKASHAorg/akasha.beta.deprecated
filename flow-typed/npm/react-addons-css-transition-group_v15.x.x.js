// flow-typed signature: 0d13b023ac98337387ff8e5d2f144187
// flow-typed version: 72fd37b4b1/react-addons-css-transition-group_v15.x.x/flow_>=v0.53.x

declare module 'react-addons-css-transition-group' {
  declare type ReactCSSTransitionGroupNames = {
    enter?: string,
    enterActive?: string,
    leave?: string,
    leaveActive?: string,
    appear?: string,
    appearActive?: string
  };
  declare type Props = {
    transitionName: string | ReactCSSTransitionGroupNames,
    transitionAppear?: boolean,
    transitionEnter?: boolean,
    transitionLeave?: boolean,
    transitionAppearTimeout?: number,
    transitionEnterTimeout?: number,
    transitionLeaveTimeout?: number,
  };
  declare type DefaultProps = {
    transitionAppear: boolean,
    transitionEnter: boolean,
    transitionLeave: boolean,
  }
  declare class ReactCSSTransitionGroup extends React$Component<Props> {
    static defaultProps: DefaultProps;
  }
  declare module.exports: Class<ReactCSSTransitionGroup>;
}
