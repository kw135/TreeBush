import { createContext, useEffect, useState, useContext } from "react";

const DbContext = createContext({ db: undefined });

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error("useDb must be used within a DbContextProvider");
  }
  return context.db;
};
export const DbContextProvider = ({ children }) => {
  const [db, setDb] = useState(undefined);

  useEffect(() => {
    const openRequest = window.indexedDB.open("my_garden_db", 1);
    openRequest.addEventListener("error", () =>
      console.error("Database failed to open")
    );

    openRequest.addEventListener("success", () => {
      console.log("Database opened successfully");
      setDb(openRequest.result);
    });

    openRequest.addEventListener("upgradeneeded", (e) => {
      setDb(e.target.result);

      const objectStore = db.createObjectStore("my_garden_os", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("title", "title", { unique: false });
      objectStore.createIndex("body", "body", { unique: false });

      console.log("Database setup complete");
    });
  }, []);

  return <DbContext.Provider value={{ db }}>{children}</DbContext.Provider>;
};
