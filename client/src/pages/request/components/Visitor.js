import React, { useEffect, useState } from 'react';

export const Visitor = ({ visitor, req_id }) => {
  const [company, setCompany] = useState('');
  const [badge, setBadge] = useState(null);
  useEffect(() => {
    if (visitor) {
      (async () => {
        const url = `http://localhost:5000/api/users/${visitor.user_id}/company`;
        const res = await fetch(url);
        if (!res.ok) {
          const error = await res.json();
          return console.log(error.message);
        }
        const result = await res.json();
        return setCompany(result.company_name);
      })();
      (async () => {
        const url = `http://localhost:5000/api/users/${visitor.user_id}/badge`;
        const res = await fetch(url);
        if (!res.ok) {
          const error = await res.json();
          return console.log(error.message);
        }
        const result = await res.json();
        if (result.request_id === req_id) return setBadge(result.badge_number);
      })();
    }
  }, [visitor, req_id]);
  return (
    <div className="visitor bounce">
      <h4 className={`status ${visitor.is_onsite ? 'in' : 'out'}`}>
        {visitor.is_onsite ? 'In' : 'Out'}
      </h4>
      <h3>{visitor.user_name}</h3>
      <h4>{company}</h4>
      {badge && <h5>{badge}</h5>}
    </div>
  );
};