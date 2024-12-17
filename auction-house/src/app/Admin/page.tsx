"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { get, post } from "../Api";
import NavigationBar from "../navigationBar";
import { useState } from "react";
import { setGlobal } from "next/dist/trace";
interface itemResponse { 
  itemId:number, 
  itemName:string,
  sellerUsername:string,
  buyerUsername:string,
  description:string, 
  price:number,
  publishDate:Date, 
  endDate:Date, 
  image:string, 
  frozen:boolean, 
  active:boolean, 
  archive:boolean, 
  fullfilled:boolean, 
  buyNow: boolean,

}

interface bidResponse{
    bidId: number,
    bidAmount: number,
    itemId: number,
    buyerUsername: string,
    date: Date,
}

export default function Home() {
  const [totalSellerFunds, setTotalSellerFunds] = useState("Total Funds of All Sellers : ")
  const [totalBuyerFunds, setTotalBuyerFunds] = useState("Total Funds of All Buyers : ")
  const [totalBuyerAFunds, setTotalBuyerAFunds] = useState("Total Available Funds of All Buyers : ")
  const [totalTransactions, setTotalTransactions] = useState("Total Number of Transactions: ")
  const [totalTransactionsFunds, setTotalTransactionsFunds] = useState("Total Fund within Transactions: ")
  const [diffFunds, setDiffFunds] = useState("Difference of Buyer Funds :")
  const [topSeller, setTopSeller] = useState("Top Seller : ")
  const [topBuyer, setTopBuyer] = useState("Top Buyer : ")
  const [popItem, setPopItem] = useState("Most Popular Item: ")
  const [eItem, setEItem] = useState("Most Expensive Item: ")
  const [bids, setAllBids] =useState([])
  const [items, setAllItems] =useState([])
  const [toggleClientData, setToggleClientData] =useState(false)


  const router = useRouter();
  
  function buyerData(Id:string){
    console.log(bids);
    console.log(items);
    let bidList = bids.filter((bid:bidResponse)=> bid.buyerUsername == Id);
    console.log(bidList)
    let ItemIds = bidList.map((bid:bidResponse) => bid.itemId);
    console.log(ItemIds)
    let itemList = items.filter((item:itemResponse)=> ItemIds.includes(item.itemId));
    console.log(itemList)
   
    setupAllItems(itemList);
    setupBidsList(bidList);
  }
  function sellerData(Id:string){
    console.log(bids);
    console.log(items);
    let itemList = items.filter((item:itemResponse) => item.sellerUsername == Id) 
    console.log(itemList)
    let ItemIds = itemList.map((item:itemResponse) => item.itemId)
    console.log(ItemIds)
    setupAllItems(itemList)
    let bidList = bids.filter((bid:bidResponse)=> ItemIds.includes(bid.itemId))
    console.log(bidList)
    setupBidsList(bidList)
  }
  function unfreezeItem(itemId : number) {
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username"), "itemId" : itemId}
    console.log("setupRAN")
    post('/unfreezeItem', payload, (response: { statusCode: any; body?: any; }) => {
      console.log(response)
      if (response.statusCode === 200) {
        alert("Item : " + itemId + " has been unfrozen")
        let button = document.getElementById(itemId + ":button");
        if(button){
          button.textContent = "Freeze";
          button.onclick = () => freezeItem(itemId)
        }
        }else {
          console.log(`Error: ${response}`);
      }
    });
  
  }
  function freezeItem(itemId : number) {
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username"), "itemId" : itemId}
    console.log("setupRAN")
    post('/freezeItem', payload, (response: { statusCode: any; body?: any; }) => {
      console.log(response)
      if (response.statusCode === 200) {
        alert("Item : " + itemId + " has been frozen")
        let button = document.getElementById(itemId + ":button");
        if(button){
          button.textContent = "UnFreeze";
          button.onclick = () => unfreezeItem(itemId)
        }
        }else {
          console.log(`Error: ${response}`);
      }
    });
  }
  function handleRequest(itemId : number, requestId : number) {
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username"), "itemId" : itemId, "requestId": requestId}
    console.log("handleunFreezeRequest")
    post('/handleunFreezeRequest', payload, (response: { statusCode: any; body?: any; }) => {
      console.log(response)
      if (response.statusCode === 200) {
        alert("Item : " + itemId + " has been unfrozen")
        setUpRequests()
        }else {
          console.log(`Error: ${response}`);
          alert("Item was not unfrozen")
      }
    });
  }
  function setUpRequests(){
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username")}
    console.log(payload)
    post('/adminGetRequests', payload, (response: { statusCode: any; body?: any; }) => {
      if (response.statusCode === 200) {
        setupRequests(response)
        }else {
          console.log(response);
      }
    });
  
  }

  function setupRequests(response:any){
    let requestBox = document.getElementById("requests");
    if (requestBox) {
      requestBox.innerHTML = "";
    }
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "request-row";
    console.log(response.body.length)
    for(let i= 0; i<response.body.length; i++){
        rowConstruct = document.createElement("div");
        rowConstruct.className = "request-row";
        let newItem = generateRequest(response.body[i])
        rowConstruct.appendChild(newItem);
        requestBox?.appendChild(rowConstruct); 
          
  
    }
  }

  function generateRequest(item:any){
    //name, price, description, publish, end 
    console.log("reached Generate Item")
    let itemDiv = document.createElement("div");
    let Text = document.createElement("label"); 
    Text.textContent = "RequestId : " + item.requestId + " : Item : " + item.itemId + " has been requested to be Unfrozen on "+ item.submitDate;
    let button  = document.createElement("button")
    button.textContent = "Fulfill Request"
    button.onclick = () => handleRequest(item.itemId, item.requestId)
    button.className = "fulfill"
    itemDiv.className = "request"
    itemDiv.appendChild(Text);
    itemDiv.appendChild(button);
    console.log(itemDiv);
    return itemDiv;
  }
  function setAuctionReport(){
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username")}
    console.log(payload)
    post('/getAuctionReport', payload, (response: any) => {
      if (response.statusCode === 200) {
        setupAllItems(response.items);
        setupBuyerList(response);
        setupSellerList(response)
        setupBidsList(response.bidItem)
        setAllBids(response.bidItem)
        setAllItems(response.items)
        }else {
          console.log(response);
      }
    });
  
  }
  function setupBidsList(bidItem:any){
    let allShowsBox = document.getElementById("bids");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let label1 = document.createElement('label');
      label1.className = "subtitleLabels"
      label1.textContent = "Bids :"
      allShowsBox?.append(label1)
      allShowsBox?.append(document.createElement('br'))
      allShowsBox?.append(document.createElement('br'))
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
      label.textContent = "Bid Id : " +bidItem[i].bidId
      label2.textContent = " Bid Amount : " + bidItem[i].bidAmount
      label3.textContent = " Item Id : " + bidItem[i].itemId
      label4.textContent = " Buyer Name : " + bidItem[i].buyerUsername
      label5.textContent = " Date of Bid : " + (("Publish Date: " + bidItem[i].date).split("T")[0]+ "   "+ ("" + bidItem[i].date).split("T")[1]).split(".")[0]
      
      
      container?.append(label)
      container?.append(document.createElement('br'))
      container?.append(label2)
      container?.append(document.createElement('br'))
      container?.append(label3)
      container?.append(document.createElement('br'))
      container?.append(label4)
      container?.append(document.createElement('br'))
      container?.append(label5)
      allShowsBox?.append(container)
      allShowsBox?.append(document.createElement('br'))
        
    }
  }
  function setupSellerList(response:any){
    let allShowsBox = document.getElementById("Sellers");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let label1 = document.createElement('label');
      label1.className = "subtitleLabels"
      label1.textContent = "Seller :"
      allShowsBox?.append(label1)
      allShowsBox?.append(document.createElement('br'))
      allShowsBox?.append(document.createElement('br'))
    console.log(response.sellerItem.length)
    for(let i= 0; i<response.buyerItem.length; i++){
      let container = document.createElement('div')
      container.onclick = () => sellerData(response.sellerItem[i].username);
      let label = document.createElement('label');
      let label2 = document.createElement('label');
      label.className = "subtitleLabels"
      label2.className = "subtitleLabels"
      label.textContent = "Username : " + response.sellerItem[i].username 
      label2.textContent = " Revenue : " + response.sellerItem[i].revenue
      
      container?.append(label)
      container?.append(document.createElement('br'))
      container?.append(label2)
      allShowsBox?.append(container)
      allShowsBox?.append(document.createElement('br'))
        
    }
  }
  function setupBuyerList(response:any){
    let allShowsBox = document.getElementById("Buyers");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let label1 = document.createElement('label');
      label1.className = "subtitleLabels"
      label1.textContent = "Buyers :"
      allShowsBox?.append(label1)
      allShowsBox?.append(document.createElement('br'))
      allShowsBox?.append(document.createElement('br'))
    console.log(response.buyerItem.length)
    for(let i= 0; i<response.buyerItem.length; i++){
      let container = document.createElement('div')
      container.onclick = () => buyerData(response.buyerItem[i].username);
      let label = document.createElement('label');
      let label2 = document.createElement('label');
      let label3 = document.createElement('label');
      label.className = "subtitleLabels"
      label2.className = "subtitleLabels"
      label3.className = "subtitleLabels"
      label.textContent = "Username : " + response.buyerItem[i].username 
      label2.textContent = " TotalFunds : " + response.buyerItem[i].totalFunds
      label3.textContent = "Available Funds : " + response.buyerItem[i].availableFunds
      container?.append(label)
      container?.append(document.createElement('br'))
      container?.append(label2)
      container?.append(document.createElement('br'))
      container?.append(label3)
      allShowsBox?.append(container)
      allShowsBox?.append(document.createElement('br'))
        
    }
  }
  function setupAllItems(items:any){
    let allShowsBox = document.getElementById("allItems");
    if (allShowsBox) {
      allShowsBox.innerHTML = "";
    }
    let rowConstruct = document.createElement("div");
    rowConstruct.className = "item-row";
    if(items.length == 0){
      let label1 = document.createElement('label');
      label1.className = "subtitleLabels"
      label1.textContent = "No Items Available"
      allShowsBox?.append(label1)
      allShowsBox?.append(document.createElement('br'))
      allShowsBox?.append(document.createElement('br'))
    }
    console.log(items.length)
    for(let i= 0; i<items.length; i++){
        console.log(i%4)
        if(i%4 == 0){
            allShowsBox?.appendChild(rowConstruct); 
            rowConstruct = document.createElement("div");
            rowConstruct.className = "item-row";
        }
        console.log(rowConstruct); 
        console.log(items[i])
        let newItem = generateItem(items[i], "item")
        rowConstruct.appendChild(newItem);
        if(i == items.length-1){
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
    let itemId = document.createElement("label"); 
    itemId.textContent = "ID :" + item.itemId;
    let itemName = document.createElement("label"); 
    itemName.textContent = item.itemName;
    let sellerName = document.createElement("label"); 
    sellerName.textContent = "Seller : " + item.sellerUsername;
    let buyerName = document.createElement("label"); 
    buyerName.textContent = "Buyer : " +item.buyerUsername;
    let itemPrice = document.createElement("label");
    itemPrice.textContent = "Price: $"+item.price;
    let itemDescript = document.createElement("label");
    itemDescript.textContent = item.description;
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
    let button  = document.createElement("button")
    button.setAttribute("id", item.itemId + ":button")
    if(item.frozen){
      button.textContent = "UnFreeze"
      button.onclick = () => unfreezeItem(item.itemId)
    }
    if(!item.frozen){
      button.textContent = "Freeze"
      button.onclick = () => freezeItem(item.itemId)
    }
    itemDiv.className = style
    itemDiv.appendChild(itemImage); 
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemId);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(sellerName);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(buyerName);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemDescript);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemPublish);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemEnd);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemActive);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemArchive);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(itemFulfilled);
    itemDiv.appendChild(document.createElement("br")); 
    itemDiv.appendChild(buyNowText);
    itemDiv.appendChild(document.createElement("br"));
    if(!item.fullfilled){
      itemDiv.appendChild(button);
      itemDiv.appendChild(document.createElement("br")); 
    }
    
    console.log(itemDiv);
    return itemDiv;
  }

  function setForensicReport(){
    let payload = {"authKey": secureLocalStorage.getItem("authKey"), "username" : secureLocalStorage.getItem("username")}
    console.log(payload)
    post('/getForensicReport', payload, (response: any) => {
      if (response.statusCode === 200) {
        setTotalBuyerAFunds("Total Available Funds of All Buyers : " + response.buyerFunds[0].aSum)
        setTotalBuyerFunds("Total Funds of All Buyers : " + response.buyerFunds[0].tSum)
        setDiffFunds("Difference of Buyer Funds :" + (response.buyerFunds[0].tSum -response.buyerFunds[0].aSum))
        setTotalSellerFunds("Total Funds of All Sellers : " + response.sellerFunds[0].sum)
        setTotalTransactions("Total Number of Transactions: " + response.numTrans[0].num)
        setTotalTransactionsFunds("Total Fund within Transactions: " + response.fundsTrans[0].SUM)

        setTopSeller("Top Seller : " + "Username : " + response.topSeller[0].username + " | Revenue : "+ response.topSeller[0].revenue)
        setTopBuyer("Top Buyer : " + "Username: " + response.topBuyer[0].buyerUsername + " | Number of Items : "+ response.topBuyer[0].numItems)
        setPopItem("Most Popular Item: " + "ItemId : " + response.pItem[0].itemID+ " | numItems : "+ response.pItem[0].numItems)
        setEItem("Most Expensive Item: " + "ItemId : " + response.eItem[0].itemId+ " | Price : "+ response.eItem[0].price)
        }else {
          console.log(response);
      }
    });
  
  }

  return (
    <div>
      <div className="header">
        <NavigationBar/>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="financeContainer">
          <div className="financeData">
            <button onClick={ () => setForensicReport()}>Refresh Financial Forensic Report</button>
            <label className="subtitleLabels">{totalSellerFunds}</label>
            <label className="subtitleLabels">{totalBuyerFunds}</label>
            <label className="subtitleLabels">{totalBuyerAFunds}</label>
            <label className="subtitleLabels">{diffFunds}</label>
            <label className="subtitleLabels">{totalTransactions}</label>
            <label className="subtitleLabels">{totalTransactionsFunds}</label>
            <label className="subtitleLabels">{topBuyer}</label>
            <label className="subtitleLabels">{topSeller}</label>
            <label className="subtitleLabels">{popItem}</label>
            <label className="subtitleLabels">{eItem}</label>

          </div>
          <div>
            <button onClick={ () => setUpRequests()}>Refresh Requests</button>
            <div id = "requests" className="request-div"></div>
          </div>
        </div>
        <label className="auctionReportLabel">Auction Reports</label>
        <button onClick={ () => setAuctionReport()}>Refresh Auction Report</button>
        <div className="reportContainer">
          <div id="Sellers" className="sellerContainer">
            <label className="subtitleLabels">Seller :</label>
          </div>
          <div id="bids" className="bidContainer">
          <label className="subtitleLabels">Bids :</label>
          </div>
          <div id="Buyers" className="buyerContainer">
          <label className="subtitleLabels">Buyers :</label>
          </div>
        </div>
        <button onClick={ () => setAuctionReport()}>Refresh to See Everything</button>
        
          <div id = "allItems" className="item-container"></div>
        </main>
      </div>
    </div>
  );
}
