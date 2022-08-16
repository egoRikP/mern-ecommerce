import React from 'react';
import {Link} from 'react-router-dom';
import routes from '../constants/routes';

const Error = () => {
  return (
    <div>
      <h2 style={{textAlign: 'center'}}>
        This Page Not Found! Return to main page:
        <div><Link to={routes.mainPage}>Shop</Link></div>
      </h2>
    </div>
  );
};

export default Error;