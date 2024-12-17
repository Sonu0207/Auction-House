"use client";

import secureLocalStorage from "react-secure-storage"; 
import { useRouter } from "next/navigation";
import {post} from "../Api";
import { useState } from "react";
import AddItem from "./addItem";
import EditItem from "./editItem"
import UnpublishItem from "./UnpublishItem"
import FulfillItem from "./FulfillItem"
import ArchiveItem from "./ArchiveItem"
import RemoveInactiveItem from "./RemoveInactiveItem"
import PublishItem from "./PublishItem"
import RequestUnfreeze from "./RequestUnfreeze"


import NavigationBar from "../navigationBar";
interface itemResponse { 
  itemId:number, 
  itemName:string,
  sellerUsername:string,
  buyerUsername:string,
  description:string, 
  price:number,
  publishDate:Date, 
  endDate:string, 
  image:string, 
  frozen:boolean, 
  active:boolean, 
  archive:boolean, 
  fullfilled:boolean, 
  buyNow: boolean,

}

export default function Home() {
  const router = useRouter(); 
  const [errorNoItems, setErrorNoItems] = useState(0);

  function closeAccountSeller(sellerUsername:any) { 
    let payload = {"username": sellerUsername}

    post('/closeSeller', payload, (response:any) => {
      console.log(payload)
      console.log(response)
            if(response.statusCode == 200) {
              router.push("/")
            }
            else{
                console.log(response)
            }
        })
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
    secureLocalStorage.setItem('archived', item.archive);
    secureLocalStorage.setItem('fulfilled', item.fullfilled);
    secureLocalStorage.setItem('buyNow', item.buyNow);
    router.push("/ItemSellerPage")
    
  }
  function setItemDisplay(sellerUsername: any){
    let payload = {"username": sellerUsername}
    post('/getSellersItems', payload, (response: { statusCode: any; body?: any; }) => {
      if (response.statusCode === 200) {      
        console.log("Seller Items")
        console.log(response); 
        setErrorNoItems(0);
        setupAllItems(response);
      }
      else{
        console.log(response);
        setErrorNoItems(1);
      }
    })
  }

  function setupAllItems(response:any){
    let allShowsBox = document.getElementById("GeneralList");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    console.log(response.body.response.length)
    for(let i= 0; i<response.body.response.length; i++){
        console.log("SetupItemsRan")
        console.log(i%4)
        if(i%4 == 0){
            allShowsBox?.appendChild(rowConstruct); 
            rowConstruct = document.createElement("div");
            rowConstruct.className = "item-row";
        }
        console.log(rowConstruct); 
        console.log(response.body.response[i])
        let newItem = generateItem(response.body.response[i], "item")
        rowConstruct.appendChild(newItem);
        if(i == response.body.response.length-1){
          allShowsBox?.appendChild(rowConstruct); 
          rowConstruct = document.createElement("div");
          rowConstruct.className = "item-row";
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
    let itemID = document.createElement("label"); 
    itemID.textContent = "ID: " + item.itemId; 
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $"+item.price;
    let itemDescript = document.createElement("label");
    itemDescript.textContent = "Description: " + item.description;
    let itemPublish = document.createElement("label");
    itemPublish.textContent = (("Publish Date: " + item.publishDate).split("T")[0]+ "   "+ ("" + item.publishDate).split("T")[1]).split(".")[0]
    let itemEnd = document.createElement("label");
    itemEnd.textContent = (("End Date: " + item.endDate).split("T")[0]+ "   "+ ("" + item.endDate).split("T")[1]).split(".")[0]
    let itemFrozen = document.createElement("label");
    itemFrozen.textContent = "Frozen:" + item.frozen;
    let itemActive = document.createElement("label");
    itemActive.textContent = "Active:" + item.active;
    let itemArchive = document.createElement("label");
    itemArchive.textContent = "Archived:" + item.archive;
    let itemFulfilled = document.createElement("label");
    itemFulfilled.textContent = "Fulfilled:" + item.fullfilled;
    let buyNowText = document.createElement("label");
    buyNowText.textContent = "Buy Now:" + item.buyNow;
    itemDiv.className = style
    itemDiv.onclick = () => download(item);
    itemDiv.appendChild(itemImage); 
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemID);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemDescript);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemPublish);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemEnd);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemFrozen);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemActive);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemArchive);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemFulfilled);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(buyNowText);
    itemDiv.appendChild(document.createElement("br")); 
    let today = new Date();
    console.log(item.buyerUsername)
    console.log(Number(today))
    console.log(false)
    if((Date.parse(item.endDate)<Number(today)) &&(item.buyerUsername== null)){
      let FailedText = document.createElement("label");
      FailedText.textContent = "Item has Failed";
      itemDiv.appendChild(FailedText);
    }else if((Date.parse(item.endDate)<Number(today)) &&(item.buyerUsername!= null)){
      let completed = document.createElement("label");
      completed.textContent = "Item is Complete";
      itemDiv.appendChild(completed);
    }
    console.log(itemDiv);
    return itemDiv;
  }
  
  return (
    <div>
      <div className="header">
        <NavigationBar/>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <label> This is the seller page </label>
          <div className="editItemButtonContainer">
            <AddItem/>
            <EditItem/>
            <PublishItem/>
            <UnpublishItem/>
            <FulfillItem/>
            <ArchiveItem/>
            <RemoveInactiveItem/>
            <RequestUnfreeze/>
          </div>
          <label>All Items: </label>
          {errorNoItems == 1 ? <label>Seller has no items</label>: null}
          <div id="GeneralList" className="item-container">
          </div> 
          <button onClick={ () => setItemDisplay(secureLocalStorage.getItem("username"))}>Refresh</button>
          <button onClick={() => router.push("/")}>Logout</button>
          <button onClick={() => closeAccountSeller(secureLocalStorage.getItem("username"))}>Close Account</button>

        </main>
      </div>
    </div>
  );
}
