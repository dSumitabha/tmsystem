import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the UserContext
const AssignUserContext = createContext();

// 2. Custom hook to access the UserContext
export const useUserContext = () => {
  return useContext(AssignUserContext);
};

// 3. UserProvider component to wrap the app and provide the context value
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 4. Return the context provider and pass the state value to all children
  return (
    <AssignUserContext.Provider value={{ users, isLoading, error }}>
      {children}
    </AssignUserContext.Provider>
  );
};
