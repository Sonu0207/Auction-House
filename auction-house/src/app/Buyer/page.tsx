"use client";
import Image from "next/image";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import { get, post } from "../Api";
import { useState } from "react";
import NavigationBar from "../navigationBar";
import { table } from "console";
interface itemResponse { 
  itemId:number, 
  itemName:string,
  description:string, 
  price:number,
  publishDate:Date, 
  endDate:Date, 
  image:string, 
  frozen:boolean, 
  active:boolean, 
  archived:boolean, 
  fulfilled:boolean, 
  buyNow: boolean,

}

export default function Home() { 
  const router = useRouter();
  const [fundsAmount, setFundsAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableFunds, setAvailableFunds] = useState<number | null>(null);
  const [totalFunds, setTotalFunds] = useState<number | null>(null);
  const [searchError, setSearchError] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [purchasedItems, setPurchasedItems] = useState<itemResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  function reviewPurchases() {
    const payload = {
      buyerUsername: secureLocalStorage.getItem("username"),
      authKey: secureLocalStorage.getItem("authKey"),
    };
  
    post("/reviewPurchases", payload, (response:any) => {
      console.log(payload);
      console.log(response);
      if (response.statusCode === 200) {
        setupPurchasedItems(response)
        } else {
          console.log("Error:", response);
        }
    });
  }
  function setupPurchasedItems(response:any){
    let allShowsBox = document.getElementById("purchaseList");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    if (Array.isArray(response.body)) {
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    console.log(response.body.length)
    for(let i= 0; i<response.body.length; i++){
        console.log(i%4)
        if(i%4 == 0){
            allShowsBox?.appendChild(rowConstruct); 
            rowConstruct = document.createElement("div");
            rowConstruct.className = "item-row";
        }
        console.log(rowConstruct); 
        console.log(response.body[i])
        let newItem = generatePurchasedItem(response.body[i], "item")
        rowConstruct.appendChild(newItem);
        if(i == response.body.length-1){
          allShowsBox?.appendChild(rowConstruct); 
          rowConstruct = document.createElement("div");
          rowConstruct.className = "item-row";
      }
    }
  }
}

  function generatePurchasedItem(item:itemResponse, style:string){
    //name, price, description, publish, end 
    console.log("reached Generate Item")
    let itemDiv = document.createElement("div");
    let itemImage = document.createElement("img");
    itemImage.className = "itemImage";
    let src = "https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + item.image;
    itemImage.src = src;
    let itemName = document.createElement("label"); 
    itemName.textContent = item.itemName;
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $"+item.price;
    let itemDescript = document.createElement("label");
    itemDescript.textContent = item.description;
    let itemPublish = document.createElement("label");
    itemPublish.textContent = (("Publish Date: " + item.publishDate).split("T")[0]+ "   "+ ("" + item.publishDate).split("T")[1]).split(".")[0]
    let itemEnd = document.createElement("label");
    itemEnd.textContent = (("End Date: " + item.endDate).split("T")[0]+ "   "+ ("" + item.endDate).split("T")[1]).split(".")[0]
    itemDiv.className = style
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
    itemDiv.appendChild(document.createElement("br")); 
    console.log(itemDiv);
    return itemDiv;
  }


  function handleAddFunds(username: any, amount: number) {
    if (!username) {
      console.error("Username not found in storage.");
      return;
    }
    const payload = { "username": username, "amount": amount };
    post('/addFunds', payload, (response: { statusCode: any; body?: any; }) => {
      if (response.statusCode === 200) {
          console.log("Funds Added")
          setAvailableFunds(response.body[0].availableFunds);
          setTotalFunds(response.body[0].totalFunds);
          secureLocalStorage.setItem("availableFunds", Number(response.body[0].availableFunds))
          secureLocalStorage.setItem("totalFunds", Number(response.body[0].totalFunds))
        }else {
          console.log(`Error: ${response}`);
      }
    });
  }

  function reviewActiveBids(){
    const payload = {
      "buyerUsername": secureLocalStorage.getItem("username"),
      "authKey": secureLocalStorage.getItem("authKey")
    };
    post('/reviewActiveBids', payload, (response: { body: any; }) => {
      console.log(payload)
      console.log(response)
      let activeBidsTable = document.getElementById("activeBidsTable");
      if(activeBidsTable){
        activeBidsTable.innerHTML = ""
        let headers = document.createElement("tr");
        headers.innerHTML = `<tr>
              <th>Item Name</th>
              <th>Bid Amount</th>
              <th>Date</th>
            </tr>`;
        activeBidsTable.appendChild(headers);
        for(let i = 0; i < response.body.response.length; i++){
          let row = document.createElement("tr");
          row.innerHTML += `<tr>
              <td>${response.body.response[i].itemName}</td>
              <td>${response.body.response[i].bidAmount}</td>
              <td>${response.body.response[i].date}</td>
            </tr>`
          activeBidsTable.appendChild(row)
        }  
      }
    })
  }

  function closeAccountBuyer(buyerUsername: any) { 
    if (!buyerUsername) {
      console.error("Username not found in storage.");
      return;
    }
    const payload = { "username": buyerUsername };
    post('/closeBuyer', payload, (response: { statusCode: any; }) => {
      if (response.statusCode === 200) {
        router.push("/");
      } else {
        console.log(`Error: ${response.statusCode}`);
      }
    });
  }
  function download(item: itemResponse){
    console.log("I RAN")
    secureLocalStorage.setItem('itemID', item.itemId);
    secureLocalStorage.setItem('itemName', item.itemName);
    secureLocalStorage.setItem('description', item.description);
    secureLocalStorage.setItem('price', item.price);
    secureLocalStorage.setItem('publishDate', item.publishDate);
    secureLocalStorage.setItem('endDate', item.endDate);
    secureLocalStorage.setItem('image', item.image);
    secureLocalStorage.setItem('frozen', item.frozen);
    secureLocalStorage.setItem('active', item.active);
    secureLocalStorage.setItem('archived', item.archived);
    secureLocalStorage.setItem('fulfilled', item.fulfilled);
    secureLocalStorage.setItem('buyNow', item.buyNow);
    router.push("/ItemBuyerPage")
    
  }
  function setItemDisplay(){
    console.log("setupRAN")
    get('/getAllItems')
        .then(function (response:any) {
          console.log(response); 
            setupAllItems(response);
        })
        .catch(function (error:any) {
            console.log(error)
        })
  
  }

  function setupAllItems(response:any){
    let allShowsBox = document.getElementById("GeneralList");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    if (Array.isArray(response.body)) {
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    console.log(response.body.length)
    for(let i= 0; i<response.body.length; i++){
        console.log(i%4)
        if(i%4 == 0){
            allShowsBox?.appendChild(rowConstruct); 
            rowConstruct = document.createElement("div");
            rowConstruct.className = "item-row";
        }
        console.log(rowConstruct); 
        console.log(response.body[i])
        let newItem = generateItem(response.body[i], "item")
        rowConstruct.appendChild(newItem);
        if(i == response.body.length-1){
          allShowsBox?.appendChild(rowConstruct); 
          rowConstruct = document.createElement("div");
          rowConstruct.className = "item-row";
      }
    }
  }
}

  function generateItem(item:itemResponse, style:string){
    //name, price, description, publish, end 
    console.log("reached Generate Item")
    let itemDiv = document.createElement("div");
    let itemImage = document.createElement("img");
    itemImage.className = "itemImage";
    let src = "https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + item.image;
    itemImage.src = src;
    let itemName = document.createElement("label"); 
    itemName.textContent = item.itemName;
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $"+item.price;
    let itemDescript = document.createElement("label");
    itemDescript.textContent = item.description;
    let itemPublish = document.createElement("label");
    itemPublish.textContent = (("Publish Date: " + item.publishDate).split("T")[0]+ "   "+ ("" + item.publishDate).split("T")[1]).split(".")[0]
    let itemEnd = document.createElement("label");
    itemEnd.textContent = (("End Date: " + item.endDate).split("T")[0]+ "   "+ ("" + item.endDate).split("T")[1]).split(".")[0]
    itemDiv.className = style
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
    itemDiv.appendChild(document.createElement("br")); 
    console.log(itemDiv);
    return itemDiv;
  }

  function reviewRecentlySold(){
    const payload = {
      "buyerUsername": secureLocalStorage.getItem("username"),
      "authKey": secureLocalStorage.getItem("authKey")
    };
    console.log(payload)
    post('/retriveRecentlySold', payload, (response: any ) => {
      if (response.statusCode === 200) {
          setupSoldItems(response)
        }else {
          console.log(response);
      }
    })
  }

  function setupSoldItems(response:any){
    let allShowsBox = document.getElementById("RecentlySoldTable");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    console.log(response.body.response.length)
    for(let i= 0; i<response.body.response.length; i++){
        console.log(i%4)
        if(i%4 == 0){
            allShowsBox?.appendChild(rowConstruct); 
            rowConstruct = document.createElement("div");
            rowConstruct.className = "item-row";
        }
        console.log(rowConstruct); 
        console.log(response.body.response[i])
        let newItem = generateSoldItem(response.body.response[i], "item")
        rowConstruct.appendChild(newItem);
        if(i == response.body.response.length-1){
          allShowsBox?.appendChild(rowConstruct); 
          rowConstruct = document.createElement("div");
          rowConstruct.className = "item-row";
      }
    }
  }

  function generateSoldItem(item:itemResponse, style:string){
    //name, price, description, publish, end 
    console.log("reached Generate Item")
    let itemDiv = document.createElement("div");
    let itemImage = document.createElement("img");
    itemImage.className = "itemImage";
    let src = "https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + item.image;
    itemImage.src = src;
    let itemName = document.createElement("label"); 
    itemName.textContent = item.itemName;
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $"+item.price;
    let itemDescript = document.createElement("label");
    let itemPublish = document.createElement("label");
    itemPublish.textContent = (("Publish Date: " + item.publishDate).split("T")[0]+ "   "+ ("" + item.publishDate).split("T")[1]).split(".")[0]
    itemDescript.textContent = item.description;
    let itemSold = document.createElement("label");
    itemSold.textContent = (("Sold Date: " + item.publishDate).split("T")[0]+ "   "+ ("" + item.publishDate).split("T")[1]).split(".")[0]
    itemDiv.className = style
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
    itemDiv.appendChild(itemSold);
    itemDiv.appendChild(document.createElement("br")); 
    console.log(itemDiv);
    return itemDiv;
  }
  function handleSort(username:any, field:string, order:string){
    const payload = {
      "buyerUsername": secureLocalStorage.getItem("username"),
      "authKey": secureLocalStorage.getItem("authKey"),
      "sortBy" : field, 
      "order" : order
    };
    console.log(payload)
    post('/sortRecentSoldBuyer', payload, (response: { statusCode: any; body?: any; }) => {
      if (response.statusCode === 200) {
          console.log(response)
          setupSoldItems(response)
        }else {
          console.log(response);
      }
    });
  }

  function handleSearchRecentlySold(){
    const payload = {
      "buyerUsername": secureLocalStorage.getItem("username"),
      "authKey": secureLocalStorage.getItem("authKey"),
      "searchTerm": searchQuery
    }
    console.log(payload)
    post('/searchRecentlySoldBuyer', payload, (response: { statusCode: any; body?: any; }) => {
      if (response.statusCode === 200) {
          console.log(response)
          setSearchError("");
          setupSoldItems(response)
        }else {
          console.log(response);
          setSearchError("No items match the query");
      }
      console.log("Search Error")
      console.log(searchError)
    });
  }
  function closeModal() {
    setIsModalOpen(false);  // Close the modal
  }

  return (
    <div>
      <div className="header">
        <NavigationBar/>
      </div>
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        <div className="fundsDiv">
          <input 
          type="number" 
          value={fundsAmount} 
          onChange={(e) => { 
            const value = Math.max(0, Number(e.target.value)); // Ensure value is non-negative
            setFundsAmount(value);
          }} 
          placeholder="Enter amount to add" 
          className="border p-3 rounded text-black"
          />
        <button onClick={() => handleAddFunds(secureLocalStorage.getItem("username"), fundsAmount)}>Add Funds</button>
        </div>
        <button onClick={reviewPurchases}>Review Purchases</button>
        <label className="auctionReportLabel">Purchased Items : </label>
         <div id="purchaseList" className="item-container">      
        </div> 
        <div>
          <button onClick={() => reviewActiveBids()}>View Active Bids</button>
          <label className="auctionReportLabel">Active Bids : </label>
          <div id="activeBidsTable">
          </div>
        </div>
        
        <button onClick={() => reviewRecentlySold()}>View Recently Sold</button>
        
       
        <div>
            <div className="buyerSearchSortContainer">
            <label>Sort by:</label>
            <select
              id="sortSelector"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price">Price</option>
              <option value="publishDate">Publish Date</option>
              <option value="fulfilledDate">Sold Date</option>
            </select>

            <label>Order:</label>
            <select
              id="sortOrderSelector"
              onChange={(e) => setSortOrder(e.target.value)
              }
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
            <button className= "smallButton" onClick={() => handleSort(secureLocalStorage.getItem("username"), sortBy, sortOrder)}>Sort</button>
            </div>
            <div className="buyerSearchSortContainer">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search by name or description"
              className="p-2 border border-gray-300 rounded-md"
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className= "smallButton" onClick={() => handleSearchRecentlySold()}>Search</button>
            </div>
            <label>{searchError}</label>
            <label className="auctionReportLabel">Recently Sold Item : </label>
            <div id="RecentlySoldTable" className = "item-container">
            </div>
        </div>

        <button onClick={ () => setItemDisplay()}>Refresh Available Items</button>
        <label className="auctionReportLabel">Items to be Purchased : </label>
        <div id="GeneralList" className="item-container">      
        </div> 
        <button onClick={() => router.push("/")}>Logout</button>
        <button onClick={() => closeAccountBuyer(secureLocalStorage.getItem("username"))}>Close Account</button>
      </main>
    </div>
    </div>
  );
}
