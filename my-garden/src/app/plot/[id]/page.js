"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { dexieDb } from "../../db.js";
import { useLiveQuery } from "dexie-react-hooks";
import styles from "../../style1.module.css";

export default function PlotPage({ params: { id } }) {
  return <PlotPageTemplate id={id} />;
}

function PlotPageTemplate(id) {
  const [state, setState] = useState(0);
  const data = useLiveQuery(() => dexieDb.plots.toArray());
  const router = useRouter();
  if (!data) return null;
  if (state === 0) {
    const plot = data.find((r) => r.id === Number(id.id));
    setState(plot);
  }
  return (
    <>
    <div className={styles.topBar}>
    <button
    className={styles.btn}
    onClick={() => {
      router.push("/");
    }}
  >
    Powrót do strony głównej
  </button>
    </div>
    <h1 className={styles.h1}>Działka "{state.title}"</h1>
      <p className={styles.p1}>Lokalizacja: {state.location}</p>
      <div className={styles.mainImg}>
        <img src={state.img} alt={state.title} />
      </div>
      <div className={styles.mainDiv}>
        <button
        className={styles.btn}
        >Dodaj lokalizację rośliny</button>
        <button
        className={styles.btn}
        >Edytuj bieżące rośliny</button>
      </div>
      
    </>
  );
}

function addPosition() {
    const startPosition = {
        x: 0,
        y: 0,
    }
    return (
        <>
        </>
    )
}