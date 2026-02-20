'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();
  const [data, setData] = useState({
    groom: "", bride: "", date: "", venue: "", message: ""
  });

  const handleChange = (e:any) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const submit = () => {
    localStorage.setItem("cardData", JSON.stringify(data));
    router.push("/preview");
  };

  return (
    <div className="bg-white text-black p-10 max-w-md mx-auto space-y-3 rounded-lg shadow-lg">
      <input name="groom" onChange={handleChange} placeholder="Groom Name" className="input"/>
      <input name="bride" onChange={handleChange} placeholder="Bride Name" className="input"/>
      <input name="date" onChange={handleChange} placeholder="Date" className="input"/>
      <input name="venue" onChange={handleChange} placeholder="Venue" className="input"/>
      <textarea name="message" onChange={handleChange} placeholder="Message" className="input"/>

      <button onClick={submit} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">
        Preview Card
      </button>

      <style jsx>{`
        .input{width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;background:white;color:black;}
      `}</style>
    </div>
  );
}
