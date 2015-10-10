import util from './lib/util';
import React from 'react/addons';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes.jsx';
import Router from 'react-router';
import mui from 'material-ui';

let ThemeManager = new mui.Styles.ThemeManager();
let {Colors} = mui.Styles;

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap, Can go away when react 1.0 release. Seehttps://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Router.run(routes, Router.HashLocation, (Root) => {
  let Main = React.createClass({
    componentWillMount() {
      ThemeManager.setPalette({
        accent1Color: Colors.cyan700,
        primary1Color: Colors.blueGrey500
      })
      ThemeManager.setComponentThemes({
        paper: {
          backgroundColor: Colors.blueGrey50,
        }
      });
    },
    getChildContext() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
    },
    childContextTypes: {
      muiTheme: React.PropTypes.object
    },
    render(){
      return <Root/>;
    }
  })
  React.render(<Main/>, document.body);
});
