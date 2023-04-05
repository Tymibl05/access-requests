import React, { useState, useEffect } from "react";
import { useStore } from "../../Context";
import { Onsite } from "./components/Onsite";
import { Active } from "./components/Active";
import { Pending } from "./components/Pending";

import "./home.scss";

export const Home = () => {
  const {
    state: { user },
  } = useStore();
  const [requests, setRequests] = useState(null);
  const [onsite, setOnsite] = useState(null);
  const [filtered, setFiltered] = useState({
    active: null,
    pending: null,
  });

  const getRequests = async () => {
    const url = `http://localhost:5000/api/requests/by-company/${user.company_id}`;
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      console.log(error.message);
      return;
    }
    const result = await res.json();
    return result;
  }; // getActive + getPending

  const getOnsite = async () => {
    const url = "http://localhost:5000/api/users/onsite";
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      console.log(error.message);
      return;
    }
    const result = await res.json();
    return result;
  };
  useEffect(() => {
    (async () => {
      setRequests(await getRequests());
      setOnsite(await getOnsite());
    })();
  }, []);
  useEffect(() => {
    const filterReqs = () => {
      if (!requests) return;
      const active = requests.filter((req) => req.status === "active");
      const pending = requests.filter((req) => req.status === "pending");
      const newFiltered = { active: active, pending: pending };
      setFiltered(newFiltered);
    };
    filterReqs();
  }, [requests]);

  return (
    <div id="Home">
      <div className={`container ${user.is_client ? "client" : "not_client"}`}>
        {user.is_client && <Onsite onsite={onsite} />}
        <Active active={filtered.active} />
        <Pending pending={filtered.pending} />
      </div>
    </div>
  );
};
