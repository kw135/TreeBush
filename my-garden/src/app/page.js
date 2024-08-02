"use client";

import { useEffect, useState, useContext } from "react";
import styles from "./style1.module.css";
import { useRouter } from "next/navigation";
import { DbContextProvider, useDb } from "./dbContext.js";

export default function MainPage() {
  return (
    <DbContextProvider>
      <MainPageTemplate />
    </DbContextProvider>
  );
}

const MainPageTemplate = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const db = useDb();

  useEffect(() => {
    if (!db) {
      return;
    }
    const request = db
      .transaction(["my_garden_os"], "readwrite")
      .objectStore("my_garden_os");
    console.log(request);
    const getAll = request.getAll();
    getAll.onsuccess = () => {
      console.log("Data fetched successfully", getAll);
      setData(getAll.result);
      setLoading(false);
    };
    getAll.onerror = () => {
      console.error("Error fetching data from db");
      setLoading(false);
    };
  }, [db]);
  console.log(data);
  return (
    <>
      <h1>Twoje działki</h1>
      <ul className={styles.ulStyle}>
        {data.map((p) => (
          <Plot
            key={p.id}
            title={p.title}
            img={p.img}
            location={p.location}
            id={p.id}
          />
        ))}
        <AddPlot />
      </ul>
    </>
  );
};

function Plot({ title, location, img, id }) {
  const router = useRouter();
  const db = useDb();

  const goToPlot = (id) => {
    router.push(`/plot/${id}`);
  };

  function removePlot(id) {
    console.log('ud', id);
    if (!db) {
      return;
    }
    const transaction = db.transaction(["my_garden_os"], "readwrite");
    const objectStore = transaction.objectStore("my_garden_os");
    const request = objectStore.delete(id);
  }

  return (
    <li className={styles.plotStyle}>
      <h2 className={styles.plotH2}>{title}</h2>
      <img src={img} alt={title} className={styles.plotImg} />
      <p className={styles.plotLocation}>{location}</p>
      <div>
        <button
          onClick={() => {
            goToPlot(id);
          }}
        >
          Wybierz
        </button>
        <button
          onClick={() => {
            removePlot(id);
          }}
        >
          Usuń
        </button>
      </div>
    </li>
  );
}

function AddPlot() {
  const [plots, setPlots] = useState([]);
  const db = useDb();

  const addPlot = (plot) => setPlots((p) => [...p, plot]);

  return (
    <form
      onSubmit={(e) => {
        if (!db) {
          return;
        }
        e.preventDefault();
        const data = new FormData(e.target);
        const image = data.getAll("files")[0];
        const title = data.get("title");
        const location = data.get("location");
        console.log("image", image);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          const newPlot = {
            title: title,
            location: location,
            img: base64Image,
          };
          addPlot(newPlot);
          console.log("newPlot", newPlot);
          db.transaction(["my_garden_os"], "readwrite")
            .objectStore("my_garden_os")
            .add(newPlot);
          e.target.reset();
        };
        reader.readAsDataURL(image);
      }}
    >
      <div className={styles.addPlot}>
        <h2 className={styles.plotH2}>dodaj nową działkę</h2>
        <input
          name="title"
          type="text"
          placeholder="title"
        />
        <input
          name="location"
          type="text"
          placeholder="location"
        />
        <input name="files" type="file" id="uploadImage" />
        <button type="submit">Add plot</button>
      </div>
    </form>
  );
}
