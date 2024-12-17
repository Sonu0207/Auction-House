"use client";
import Image from "next/image";
import { get, post } from "../Api";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import NavigationBar from "../navigationBar";
import { useState, useEffect } from "react";

interface itemResponse {
  itemID: number;
  itemName: string;
  description: string;
  price: number;
  publishDate: Date;
  endDate: Date;
  image: string;
  frozen: boolean;
  active: boolean;
  archived: boolean;
  fulfilled: boolean;
}

export default function Home() {
  const [clientRender, setClientRender] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("itemName");
  const [sortOrder, setSortOrder] = useState("ascending");
  const router = useRouter();

  useEffect(() => {
    setClientRender(true);
    setItemDisplay();
  }, []);

  function download(item: itemResponse) {
    console.log("I RAN");
    secureLocalStorage.setItem("itemID", item.itemID);
    secureLocalStorage.setItem("itemName", item.itemName);
    secureLocalStorage.setItem("description", item.description);
    secureLocalStorage.setItem("price", item.price);
    secureLocalStorage.setItem("publishDate", item.publishDate);
    secureLocalStorage.setItem("endDate", item.endDate);
    secureLocalStorage.setItem("image", item.image);
    secureLocalStorage.setItem("frozen", item.frozen);
    secureLocalStorage.setItem("active", item.active);
    secureLocalStorage.setItem("archived", item.archived);
    secureLocalStorage.setItem("fulfilled", item.fulfilled);
    router.push("/Item");
  }
  function runOrder(sortOrder: string){
    setSortOrder(sortOrder)
    setItemDisplay(sortBy, sortOrder)
  }
  function runSort(sortBy: string){
    setSortBy(sortBy)
    setItemDisplay(sortBy,sortOrder)
  }
  function setItemDisplay(sortBy:string = "itemName", sortOrder:string ="ascending") {
    console.log("Fetching items with sortBy:", sortBy, "and orderBy:", sortOrder);
    post('/sortItemCustomer', { sortBy: sortBy, order: sortOrder }, (response: any) => {
      if (response.statusCode === 200) {
        setupAllItems(response.body);
      } else {
        console.log("Error:", response);
      }
    });
  }

  function searchItems(searchQuery: string) {
    if (!searchQuery.trim()) {
      setItemDisplay();
      return;
    }
    let payload = { searchQuery: searchQuery };
    post('/searchItemCustomer', payload, (response: any) => {
      console.log(payload);
      console.log(response);
      if (response.statusCode === 200) {
        setupAllItems(response.body);
      } else {
        console.log(response);
      }
    });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchQuery(query);
    searchItems(query);
  }

  function setupAllItems(items: itemResponse[]) {
    let allShowsBox = document.getElementById("GeneralList");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    for (let i = 0; i < items.length; i++) {
      if (i % 4 === 0) {
        allShowsBox?.appendChild(rowConstruct);
        rowConstruct = document.createElement("div");
        rowConstruct.className = "item-row";
      }
      let newItem = generateItem(items[i], "item");
      rowConstruct.appendChild(newItem);
      if (i === items.length - 1) {
        allShowsBox?.appendChild(rowConstruct);
      }
    }
  }

  function generateItem(item: itemResponse, style: string) {
    let itemDiv = document.createElement("div");
    let itemImage = document.createElement("img");
    itemImage.className = "itemImage";
    itemImage.src =
      "https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + item.image;
    let itemName = document.createElement("label");
    itemName.textContent = item.itemName;
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $" + item.price;
    let itemDescript = document.createElement("label");
    itemDescript.textContent = item.description;
    let itemPublish = document.createElement("label");
    itemPublish.textContent = "Publish-Date:" + item.publishDate;
    let itemEnd = document.createElement("label");
    itemEnd.textContent = "End-Date:" + item.endDate;
    itemDiv.className = style;
    itemDiv.onclick = () => download(item);
    itemDiv.appendChild(itemImage);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(itemDescript);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(itemPublish);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(itemEnd);
    return itemDiv;
  }

  return (
    <div>
      <div className="header">
        <NavigationBar />
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <button onClick={() => router.push("/")}>Back to Login</button>

          <div className="flex justify-end w-full items-center gap-4">
            <label>Sort by:</label>
            <select
              id="sortSelector"
              onChange={(e) => runSort(e.target.value)}
            >
              <option value="itemName">Name</option>
              <option value="price">Price</option>
              <option value="publishDate">Publish Date</option>
              <option value="endDate">End Date</option>
            </select>

            <label>Order:</label>
            <select
              id="sortOrderSelector"
              onChange={(e) =>
                runOrder(e.target.value)
              }
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
          <div className="flex gap-4 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or description"
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <label>All Items: </label>
          <div id="GeneralList" className="item-container"></div>
        </main>
      </div>
    </div>
  );
}