import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from "./Header";
import Aside from "./Aside";

const padded = {
    "margin-left": "256px"
};

export default class Layout extends React.Component {
    render() {
    return (
    <MuiThemeProvider>
        <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
            <Header/>
            <Aside/>
            <main class="mdl-layout__content mdl-color--grey-100" style={padded}>
                <div class="mdl-grid demo-content">
                    <div class="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid main-container">
                        {this.props.children}
                    </div>
                </div>
            </main>
        </div>
    </MuiThemeProvider>
    );
  }
}
