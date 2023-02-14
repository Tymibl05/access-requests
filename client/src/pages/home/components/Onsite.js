import React from 'react';

export const Onsite = ({ onsite }) => {
  return (
    <div className="Onsite">
      <h2>Onsite</h2>
      <div className="visitors">
        {onsite &&
          onsite.map((vis) => (
            <div key={vis.user_name} value={vis.request._id} className="vis">
              <h4>{vis.user_name}</h4>
              <h5>{vis.company_name}</h5>
              <h6>{vis.request.name}</h6>
              <p>
                {vis.badge_number ? `Badge: ${vis.badge_number}` : 'Escort'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
