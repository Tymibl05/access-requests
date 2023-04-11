import React from 'react';
import { Link } from 'react-router-dom';

export const Onsite = ({ onsite }) => {
  return (
    <div className="Onsite">
      <div className="header">
        <h2>Onsite</h2>
      </div>
      <div className="visitors">
        {onsite &&
          onsite.map((vis) => (
            <Link
              to={`/request/${vis.request._id}`}
              key={vis.visitor.user_name}
            >
              <div
                key={vis.visitor.user_name}
                value={vis.request._id}
                className="vis"
              >
                <h4>{vis.visitor.user_name}</h4>
                <h5>{vis.visitor.company_name}</h5>
                <h6>{vis.request.name}</h6>
                <p>
                  {vis.badge_number ? `Badge: ${vis.badge_number}` : 'Escort'}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
