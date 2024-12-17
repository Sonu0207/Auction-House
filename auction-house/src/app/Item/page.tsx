"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

export default function Home() {
  const router  = useRouter()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <button onClick={() => router.back()}>Back to Customer Page</button>
        <div className="itemIndiv">
            <img className = "itemImage" src={"https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + secureLocalStorage.getItem("image")}></img>
            <label>{"Name: " + secureLocalStorage.getItem("itemName")}</label><br/>
            <label>{"Price: " + secureLocalStorage.getItem("price")+ "$"}</label><br/>
            <label>{"Description: " + secureLocalStorage.getItem("description")}</label><br/>
            <label>{(("Publish Date: " + secureLocalStorage.getItem("publishDate")).split("T")[0]+ "   "+ ("" + secureLocalStorage.getItem("publishDate")).split("T")[1]).split(".")[0]}</label><br/>
            <label>{(("End Date: " + secureLocalStorage.getItem("endDate")).split("T")[0]+ "   "+ ("" + secureLocalStorage.getItem("endDate")).split("T")[1]).split(".")[0]}</label><br/>
          </div> 
      </main>
    </div>
  );
}