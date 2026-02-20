'use client';

import { useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";

export default function Preview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const d = localStorage.getItem("cardData");
    if (d) setData(JSON.parse(d));
  }, []);

  // 🔽 DOWNLOAD FUNCTION
  const download = () => {
    const card = document.getElementById("card");
    if (!card) return;

    htmlToImage.toPng(card).then((url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "wedding-card.png";
      a.click();
    });
  };

  if (!data) return null;

  return (
    <div className="flex flex-col items-center p-10">

      {/* CARD */}
      <div id="card" className="relative w-[600px] h-[900px] border-4 shadow-xl bg-white">
        <img src="/templates/RAm.jpeg" className="absolute w-full h-full" />

        <h1 className="absolute top-[300px] left-[180px] text-3xl text-red-700">
          {data.groom} & {data.bride}
        </h1>

        <p className="absolute top-[400px] left-[200px]">{data.date}</p>
        <p className="absolute top-[430px] left-[200px]">{data.venue}</p>
        <p className="absolute bottom-[200px] left-[150px] w-[300px] text-center">
          {data.message}
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button onClick={download} className="mt-6 bg-green-600 text-white px-6 py-2 rounded">
        Download Card
      </button>

    </div>
  );
}
