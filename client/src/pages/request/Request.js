import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../Context';
import { formatDate, formatTime, formatWindow } from '../../utils';
import { Visitor } from './components/Visitor';
import './request.scss';

export const Request = () => {
  const {
    state: { user },
  } = useStore();
  const { req_id } = useParams();
  const [selected, setSelected] = useState([]);

  const [request, setRequest] = useState(null);
  useEffect(() => {
    if (req_id) {
      (async () => {
        const url = `/api/requests/by-id/${req_id}`;
        const res = await fetch(url);
        if (!res.ok) {
          const error = await res.json();
          return alert(error.message);
        }
        const result = await res.json();
        return setRequest(result);
      })();
    }
  }, [req_id]);

  const [badges, setBadges] = useState([]);
  const getBadges = async () => {
    const url = '/api/badges/available';
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      return console.log(error.message);
    }
    const result = await res.json();
    return result;
  };
  useEffect(() => {
    (async () => {
      const badges = await getBadges();
      setBadges(badges);
    })();
  }, []);

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    (async () => {
      const url = `/api/logs/by-request/${req_id}`;
      const res = await fetch(url);
      if (!res.ok) {
        const error = await res.json();
        return alert(error.message);
      }
      const result = await res.json();
      return setLogs(result);
    })();
  }, [req_id]);

  const updateStatus = async (e) => {
    if (!request) return;

    const status =
      e.target.value === 'approve'
        ? 'active'
        : e.target.value === 'deny' && 'cancelled';

    const url = `/api/requests/${request._id}/update-status`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status }),
    });
    if (!res.ok) {
      const error = await res.json();
      return alert(error.message);
    }
    const result = await res.json();
    console.log(result.message);
    setRequest({ ...request, status: status });
    setLogs([result.log, ...logs]);
    return;
  };

  const updateAccess = (e) => {
    if (
      new Date(request.window.start).toISOString() < new Date().toISOString() ||
      new Date().toISOString() > new Date(request.window.end).toISOString()
    )
      if (!request || request.status !== 'active' || selected.length === 0)
        //alert('Cannot update access outside request window!');

        return;
    for (let i = selected.length - 1; i > 0; i--) {
      if (selected[i].is_onsite !== selected[i - 1].is_onsite)
        return alert('Input error');
    }
    const is_onsite = selected[0].is_onsite;
    if (e.target.value === 'in' && is_onsite)
      return alert(`${selected[0].user_name} is ALREADY checked in.`);
    if (e.target.value === 'out' && !is_onsite)
      return alert(`${selected[0].user_name} is NOT checked in.`);
    // this only checks if they're checked in for this request NOT another one
    //** server check implemented to resolve this */

    const url = `/api/requests/${request._id}/update-access`;
    selected.forEach(async (sel) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor: {
            _id: sel.user_id,
            name: sel.user_name,
            is_onsite: !sel.is_onsite,
            badge_id: sel.badge ? sel.badge._id : null,
            badge_num: sel.badge ? sel.badge.number : null,
          },
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        return alert(error.message);
      }
      const result = await res.json();
      setLogs([result.log, ...logs]);
      setRequest(result.updatedRequest);

      // const updateReq = request;
      // updateReq.visitors.forEach((vis) => {
      //   if (vis.user_id === sel.user_id) vis.is_onsite = !vis.is_onsite;
      // });
      // setRequest({ ...updateReq });
    });
    return setSelected([]);
  };

  return (
    <div id="Request">
      {request && (
        <div
          className={`container ${user.is_client ? 'client' : 'not_client'}`}
        >
          <div className="Info">
            <h2>{request.name}</h2>
            <h3 className={`status ${request.status}`}>
              {request.status.toUpperCase()}
            </h3>
            <h3 className="window">
              {formatWindow(request.window.start, request.window.end)}
            </h3>
            <h4>Description: </h4>
            <h5>{request.description}</h5>
            {user.is_client && request.status === 'pending' && (
              <div className="actions">
                <button
                  className="approve"
                  value="approve"
                  onClick={updateStatus}
                >
                  Approve
                </button>
                <button className="deny" value="deny" onClick={updateStatus}>
                  Deny
                </button>
              </div>
            )}
          </div>
          <div className="Visitors">
            <div className="header">
              <h2>Visitors</h2>
              {user.is_client && request.status === 'active' && (
                <div className={`selected ${selected.length > 0 && 'true'}`}>
                  {selected.length} Selected
                </div>
              )}
              {user.is_client && request.status === 'active' && (
                <div className="actions">
                  <button value="in" onClick={updateAccess}>
                    Check In
                  </button>
                  <button value="out" onClick={updateAccess}>
                    Check Out
                  </button>
                </div>
              )}
            </div>
            <div className="cards">
              {request.visitors.map((vis) => (
                <Visitor
                  key={vis.user_id}
                  visitor={vis}
                  req_id={request._id}
                  req_status={request.status}
                  selected={selected}
                  setSelected={setSelected}
                  badges={badges}
                  setBadges={setBadges}
                />
              ))}
            </div>
          </div>
          <div className="Logs">
            <h2>Activity Log</h2>
            {logs.map((log) => (
              <div key={log._id} className="message">
                <b>
                  {`${formatDate(log.timestamp)} ${formatTime(log.timestamp)}`}{' '}
                  :{' '}
                </b>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
