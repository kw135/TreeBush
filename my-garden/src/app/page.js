"use client";

import { useState } from "react";
import styles from "./style1.module.css";
let db;
const openRequest = window.indexedDB.open("my_garden_db", 1);
openRequest.addEventListener("error", () =>
  console.error("Database failed to open"),
);

openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");
  db = openRequest.result;
});

openRequest.addEventListener("upgradeneeded", (e) => {
  db = e.target.result;

  const objectStore = db.createObjectStore("my_garden_os", {
    keyPath: "id",
    autoIncrement: true,
  });

  objectStore.createIndex("title", "title", { unique: false });
  objectStore.createIndex("body", "body", { unique: false });

  console.log("Database setup complete");
});
let isDbOpened = false;
let isWindowLoaded = false;
openRequest.addEventListener("success", () => {
  isDbOpened = true;
  db = openRequest.result;
  if (isWindowLoaded) {
    loadInitialStateFromDb();
  }
});
window.addEventListener("load", () => {
  isWindowLoaded = true;
  if (isDbOpened) {
    loadInitialStateFromDb();
  }
});
let plots = [];
function loadInitialStateFromDb() {
  const objectStore = db.transaction("my_garden_os", "readonly").objectStore("my_garden_os");
  const request = objectStore.getAll();
  request.onsuccess = () => {
    loadPlot(request.result)
  };
}
const loadPlot = (state) => {
  return new Promise((resolve) => {
    plots = state;
    resolve(plots);
  })
}
export default function MainPage() {
  const initialState = loadPlot()
  return console.log(initialState)
  return (
    <>
      <h1>Twoje działki</h1>
      <ul className={styles.ulStyle}>
        {initialState.map((p) => (
          <Plot key={p.id} title={p.title} img={p.img} location={p.location} />
        ))}
        <AddPlot />
      </ul>
    </>
  );
}

function Plot({ title, location, img }) {
  return (
    <li className={styles.plotStyle}>
      <h2 className={styles.plotH2}>{title}</h2>
      <img src={img} alt={title} className={styles.plotImg} />
      <p className={styles.plotLocation}>{location}</p>
      <button>Wybierz</button>
    </li>
  );
}

function AddPlot() {
  const [title1, setTitle1] = useState("");
  const [location1, setLocation1] = useState("");

  const [plots, setPlots] = useState([])

  const addPlot = (plot) => setPlots((p) => [...p, plot]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const data = new FormData(e.target);
      const image = data.getAll("files")[0]
      const title = data.get("title");
      const location = data.get("location");

      console.log('image', image);

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result;
        // TODO add plot to indexed db
        const newPlot = {
          id: plots.length,
          title: title,
          location: location,
          img: base64Image,
        }
        addPlot(newPlot);
        db.transaction("my_garden_os", "readwrite").objectStore("my_garden_os").add(newPlot);
        setLocation1("")
        setTitle1("")
        e.target.reset()
      }
      reader.readAsDataURL(image)

    }}>
      <div className={styles.addPlot}>
        <h2 className={styles.plotH2}>dodaj nową działkę</h2>
        <input name="title" type="text" placeholder="title" value={title1} onChange={e => setTitle1(e.target.value)}/>
        <input name="location" type="text" placeholder="location" value={location1} onChange={e => setLocation1(e.target.value)}/>
        <input name="files" type="file" id="uploadImage" />
        <button type="submit">
          Add plot
        </button>
      </div>
    </form>
  );
}
