"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {post} from "../Api"
import secureLocalStorage from "react-secure-storage";
import NavigationBar from "../navigationBar";

export default function Home() {
  const router  = useRouter();
  const [bidAmount, setBidAmount] = useState(0);
  const [bidMessage, setBidMessage] = useState("");
  const [availableFunds, setAvailableFunds] = useState(secureLocalStorage.getItem("availableFunds"));

  function displayBids(){
      let payload = {
        "itemId": secureLocalStorage.getItem("itemID"),
        "username": secureLocalStorage.getItem("username"),
        "authKey": secureLocalStorage.getItem("authKey")
      }
      post('/getItemBids', payload, (response: any) => {
        console.log(payload)
        console.log(response)
        if(response.statusCode ==200){
        setupBidsList(response.body)
      }else{
        alert("Could't Retruve Bids")
      }
      })
  }
  function setupBidsList(bidItem:any){
    let allShowsBox = document.getElementById("bids");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    console.log(bidItem.length)
    if(bidItem.length == 0){
      let label1 = document.createElement('label');
      label1.className = "subtitleLabels"
      label1.textContent = " No Bids Available"
      allShowsBox?.append(label1)
      allShowsBox?.append(document.createElement('br'))
      allShowsBox?.append(document.createElement('br'))
    }
    for(let i= 0; i<bidItem.length; i++){
      let container = document.createElement('div')
      let label = document.createElement('label');
      let label2 = document.createElement('label');
      let label3 = document.createElement('label');
      let label4 = document.createElement('label');
      let label5 = document.createElement('label');
      label.className = "subtitleLabels"
      label2.className = "subtitleLabels"
      label3.className = "subtitleLabels"
      label4.className = "subtitleLabels"
      label5.className = "subtitleLabels"
      label2.textContent = " Bid Amount : " + bidItem[i].bidAmount
      label4.textContent = " Buyer Name : " + bidItem[i].buyerUsername
      label5.textContent = " Date of Bid : " + (("Publish Date: " + bidItem[i].date).split("T")[0]+ "   "+ ("" + bidItem[i].date).split("T")[1]).split(".")[0]
      
      container?.append(label2)
      container?.append(document.createElement('br'))
      container?.append(label4)
      container?.append(document.createElement('br'))
      container?.append(label5)
      allShowsBox?.append(container)
      allShowsBox?.append(document.createElement('br'))
        
    }
  }
  function getBidAmount(amount: number) {
    setBidAmount(parseFloat(amount.toFixed(2)))
  }

  function buyItemNow(){
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username": secureLocalStorage.getItem("username"), "price": secureLocalStorage.getItem("price"), "itemId": secureLocalStorage.getItem("itemID")}
    console.log(payload)
    post('/buyItemNow', payload, (response: any) => {
      console.log(payload)
      console.log(response)
      if(response.statusCode ==200){
        console.log('Success')
        post('/retrieveAvailableFunds', payload, (response: { body: any; }) => {
          console.log(payload);
          console.log(response.body.response[0].availableFunds);
          console.log("RETRIEVING AVAILABLE FUNDS")
          console.log(response)
          setAvailableFunds(response.body.response[0].availableFunds)
          secureLocalStorage.setItem("availableFunds", response.body.response[0].availableFunds)
          console.log("Available funds: " + Number(response.body.response[0].availableFunds).toString())
          console.log("AVAILABLE FUNDS RETRIEVED")
        })
        alert("Item has been bought")
        secureLocalStorage.setItem("availableFunds", Number(availableFunds));
        backToBuyerPage()
      
      }else{
        console.log('Failed')
        alert("Failed to buy the item now")
      }
      
    })
  }
  
  function backToBuyerPage(){
    router.push('/Buyer')
    secureLocalStorage.setItem("availableFunds", Number(availableFunds));
    console.log(secureLocalStorage.getItem("availableFunds"))
  }

  function placeBid(){
    let payload = {
      "itemId": secureLocalStorage.getItem("itemID"),
      "bidAmount": bidAmount,
      "buyerUsername": secureLocalStorage.getItem("username"),
      "authKey": secureLocalStorage.getItem("authKey")
    }
    post('/placeBid', payload, (response: any) => {
      console.log("PLACING BID")
      console.log(payload)
      console.log(response)
      if(response.statusCode ==200){
      //setBidMessage(response.body.response)
      console.log("BID PLACED")
      post('/retrieveAvailableFunds', payload, (response: { body: any; }) => {
        console.log(payload);
        console.log(response.body.response[0].availableFunds);
        console.log("RETRIEVING AVAILABLE FUNDS")
        console.log(response)
        setAvailableFunds(response.body.response[0].availableFunds)
        secureLocalStorage.setItem("availableFunds", response.body.response[0].availableFunds)
        console.log("Available funds: " + Number(response.body.response[0].availableFunds).toString())
        console.log("AVAILABLE FUNDS RETRIEVED")
      })
      alert("Bid Was Successfully Placed")
      backToBuyerPage()
    }else{
      alert("Bid was not Placed")
    }
    })
  }

  return (
    <div>
      <div className="header">
        <NavigationBar/>
      </div>
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <button onClick={() => backToBuyerPage()}>Back to Buyer</button>
      <div className="itemPageContainer">
        <div className="itemIndiv">
            <img className = "itemImage" src={"https://clipsauctionphotos.s3.us-east-1.amazonaws.com/" + secureLocalStorage.getItem("image")}></img>
            <label>{"Name: " + secureLocalStorage.getItem("itemName")}</label><br/>
            <label>{"Price: " + secureLocalStorage.getItem("price")+ "$"}</label><br/>
            <label>{"Description: " + secureLocalStorage.getItem("description")}</label><br/>
            <label>{(("Publish Date: " + secureLocalStorage.getItem("publishDate")).split("T")[0]+ "   "+ ("" + secureLocalStorage.getItem("publishDate")).split("T")[1]).split(".")[0]}</label><br/>
            <label>{(("End Date: " + secureLocalStorage.getItem("endDate")).split("T")[0]+ "   "+ ("" + secureLocalStorage.getItem("endDate")).split("T")[1]).split(".")[0]}</label><br/>
        </div> 
        {secureLocalStorage.getItem("buyNow") == 0 ?
        
          <div className="bidInDiv">
              <button onClick={displayBids}>Refresh Bids</button>
              <label className="subtitleLabels">Bids:</label>
              <div id="bids">

              </div>
          </div>
        : null}
          
      </div>
        
        {secureLocalStorage.getItem("buyNow") == 1 ?<button onClick={() => buyItemNow()}>Buy Now</button>: null}
        {secureLocalStorage.getItem("buyNow") == 0 ?<input
        onChange={e => getBidAmount(Number(e.target.value))}
        className="inputElement" 
        placeholder="Bid Amount"
        type="number"
        style={{border: '2px solid black', height: '55px'}}>
        </input>: null}
        {secureLocalStorage.getItem("buyNow") == 0 ?<label>{bidMessage}</label>: null}
        {secureLocalStorage.getItem("buyNow") == 0 ?<button onClick={() => placeBid()}>Place Bid</button>: null}
      </main>
    </div>
    </div>
  );
}