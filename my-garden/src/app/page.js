"use client";
import { useEffect, useState, useContext } from "react";
import styles from "./style1.module.css";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDb } from "./db";

export default function MainPage() {
  return (
      <MainPageTemplate />
  );
}

const MainPageTemplate = () => {
  const data = useLiveQuery(() => dexieDb.plots.toArray());
  return (
    <>
      <h1 className={styles.h1}>Twoje działki</h1>
      <ul className={styles.ulStyle}>
        {data?.map((p) => (
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

  const goToPlot = (id) => {
    router.push(`/plot/${id}`);
  };
    
  function removePlot(id) {
    if (!dexieDb) {
      return;
    }
    dexieDb.plots.delete(id)
  }

  return (
    <li className={styles.plotStyle}>
      <h2 className={styles.plotH2}>{title}</h2>
      <img src={img} alt={title} className={styles.plotImg} />
      <p className={styles.plotLocation}>{location}</p>
      <div className={styles.divBtn}>
        <button
        className = {styles.btn}
          onClick={() => {
            goToPlot(id);
          }}
        >
          Wybierz
        </button>
        <button
          className = {styles.btn}
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
  return (
    <form
      onSubmit={(e) => {
        if (!dexieDb) {
          return;
        }
        e.preventDefault();
        const data = new FormData(e.target);
        const image = data.getAll("files")[0];
        const title = data.get("title");
        const location = data.get("location");

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          const newPlot = {
            title: title,
            location: location,
            img: base64Image,
          };
          dexieDb.plots.add(newPlot)
          e.target.reset();
        };
        reader.readAsDataURL(image);
      }}
    >
      <li className={styles.addPlot}>
        <h2 className={styles.plotH2}>dodaj nową działkę</h2>
        <input
          name="title"
          type="text"
          placeholder="Podaj nazwę działki"
          className={styles.textInp}
        />
        <input
          name="location"
          type="text"
          placeholder="Podaj lokalizację działki"
          className={styles.textInp}
        />
        <label for="uploadImage" className={styles.fileSelector}>
          Wybierz zdjęcie
        </label>
        <input name="files" type="file" id="uploadImage" className={styles.fileSelector1}/>
        <button type="submit" className={styles.btn}>Dodaj działkę</button>
      </li>
    </form>
  );
}
