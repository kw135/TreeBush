import { createContext,useEffect, useState } from "react";


export  const DbContext = () => {
    const [db, setDb] = useState();

  useEffect(() => {
    const openRequest = window.indexedDB.open("my_garden_db", 1);
    openRequest.addEventListener("error", () =>
      console.error("Database failed to open")
    );

    openRequest.addEventListener("success", () => {
      console.log("Database opened successfully");
      setDb(openRequest);
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
}
