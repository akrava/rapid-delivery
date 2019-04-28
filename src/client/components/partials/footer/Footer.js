import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
        <footer className="footer">
            <div className="container py-4">
                <div className="col mx-auto text-center">
                    <p className="credits">
                        Questions, related to the site, you can ask the author:<br/>
                        <strong>Webmster:</strong> Arkadiy Krava 
                        (<a target="_blank" rel="noopener noreferrer" id="github-link" href="https://github.com/akrava">akrava</a> 
                        )<br/>
                        {/* <a classNam="link-style" href="/developer/v1">REST API documentation</a> */}
                    </p>
                    <span className="text-monospace">All rights reserved, Rapid delivery (c) 2018</span>
                </div>
            </div>
        </footer>
    );
  }
}


export default Footer;