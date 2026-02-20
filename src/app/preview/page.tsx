"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function WeddingTemplate1() {
  const params = useSearchParams();

  const bride = params.get("bride") || "राधिका";
  const groom = params.get("groom") || "रोशन";
  const date = params.get("date") || "12 दिसम्बर 2024";
  const venue = params.get("venue") || "वाराणसी";

  return (
    <div id="card" className="card-wrapper">

      {/* CARD BORDER */}
      <div className="card-border">

        {/* TOP GANESH */}
        <div className="ganesh">
          <Image src="/templates/1/assets/ganesh.png" alt="Ganesh" width={120} height={120} />
        </div>

        {/* HEADING */}
        <h1 className="card-title">॥ श्री गणेशाय नमः ॥</h1>
        <h2 className="card-subtitle">शुभ विवाह निमंत्रण</h2>

        {/* MIDDLE NAMES */}
        <div className="couple-section">
          <div className="bride">
            <Image src="/templates/1/assets/bride.png" alt="Bride" width={120} height={180} />
            <h3>{bride}</h3>
          </div>

          <div className="groom">
            <Image src="/templates/1/assets/groom.png" alt="Groom" width={120} height={180} />
            <h3>{groom}</h3>
          </div>
        </div>

        {/* DATE & VENUE */}
        <div className="details">
          <p>शुभ विवाह तिथि: <b>{date}</b></p>
          <p>स्थान: <b>{venue}</b></p>
        </div>

        {/* BLESSING TEXT */}
        <p className="blessing">
          आप सपरिवार पधार कर वर-वधू को आशीर्वाद प्रदान करें
        </p>

        {/* FOOTER */}
        <div className="footer-text">
          <p>स्नेहाकांक्षी</p>
          <p>समस्त परिवार</p>
        </div>

      </div>
    </div>
  );
}
