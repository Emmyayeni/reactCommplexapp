import React from 'react';
import Page from './Page'
import {Link} from 'react-router-dom'

const Notfound = () => {
    return (
        <Page title="Not Found">
        <div className="text-center">
          <h2> Whoops, we cannot find that page.</h2>
          <p> You can always visit the <Link to="/">home page</Link></p>
        </div>
      </Page>

    );
}

export default Notfound;
