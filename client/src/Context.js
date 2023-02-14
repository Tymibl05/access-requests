import { createContext, useContext, useState } from 'react';

const Store = createContext();

export const useStore = () => {
  return useContext(Store);
};

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null, // store in local storage with logic to auto logout after a certain amount of time
    badges: null,
  });

  const getBadges = async () => {
    const url = 'http://localhost:5000/api/badges';
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      return console.log(error.message);
    }
    const result = await res.json();
    return result;
  };
  const getOnsite = async () => {
    const url = 'http://localhost:5000/api/users/onsite';
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      return console.log(error.message);
    }
    const result = await res.json();
    return result;
  }

  const dispatch = {
    signin: async (res) => {
      const { user } = res;
      const badges = user.is_client ? await getBadges() : null;
      setState({
        user: user,
        badges: badges,
      });
    },
  };

  // const context = useMemo(() => state, [state]);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
