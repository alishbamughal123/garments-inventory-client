import {
  useEffect,
  useState,
} from "react";
import {
  getMe,
} from "../services/auth.service";
import {
  AuthContext,
} from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [authReady, setAuthReady] =
    useState(
      () =>
        !localStorage.getItem(
          "token"
        )
    );

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };

  useEffect(() => {
    let isMounted = true;
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      return undefined;
    }

    (async () => {
      try {
        const response =
          await getMe();

        if (!isMounted) {
          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data
          )
        );
        setUser(response.data);
      } catch {
        if (!isMounted) {
          return;
        }

        localStorage.removeItem(
          "token"
        );
        localStorage.removeItem(
          "user"
        );
        setUser(null);
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
