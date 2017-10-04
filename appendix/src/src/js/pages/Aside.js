import React from "react";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import FontIcon from 'material-ui/FontIcon';
import {NavLink} from "react-router-dom";
import {Snackbar} from "material-ui";

const iconStyles = {
    'vertical-align': 'middle',
    'margin-right': '24px'
};

export default class Aside extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zIndex: 0
        };
    }

    render() {
        return (
            <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
                <header className="demo-drawer-header">
                    <div className="demo-avatar-dropdown">
                        <span>VisMed</span>
                    </div>
                </header>
                <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
                    <NavLink to="/cases" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons"
                        role="presentation">assignment</i>Cases</NavLink>
                    <NavLink to="/patients" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons"
                        role="presentation">face</i>Patients</NavLink>
                    <NavLink to="/studies" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons"
                        role="presentation">book</i>Studies</NavLink>
                    <NavLink to="/statistics" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons" role="presentation">timeline</i>Stats</NavLink>
                    <NavLink to="/informations" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons" role="presentation">info</i>Informations</NavLink>
                    <NavLink to="/admin" activeClassName="mdl-navigation__link--current"
                             className="mdl-navigation__link"><i
                        className="mdl-color-text--blue-grey-400 material-icons"
                        role="presentation">build</i>Admin</NavLink>
                </nav>
            </div>
        );
    }
}
