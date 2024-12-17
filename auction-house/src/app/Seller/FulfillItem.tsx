'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';


const FulfillItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sellerItemIds, setSellerItemIds] = useState([]);
    const [fulfillItemId, setFulfillItemId] = useState(0);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    function getFulfillItemId(id: number) {
        setFulfillItemId(id)
      }
      function getNewRevenue() {
        let payload = {"username": secureLocalStorage.getItem('username'),
          "authKey": secureLocalStorage.getItem("authKey")
        }
        post('/getRevenue', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            secureLocalStorage.setItem('revenue', response.body[0].revenue)
          }else{
            alert("Revenue was not updated")
          }
        })
      }
    function getSellerItemIds(sellerUsername: any) {
        let payload = {"sellerUsername": sellerUsername, "authKey": secureLocalStorage.getItem("authKey")}
        let itemIds:any = []
        post('/getFulfillEligibleItemIds', payload, (response: { body: any; }) => {
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response.body.response.length; i++){
            itemIds[i] = (response.body.response[i].itemId)
          }
          setSellerItemIds(itemIds)
        })
      }
    
    function fulfillItem(sellerUsername: any) {
      let payload = {
        "sellerUsername": sellerUsername,
        "authKey": secureLocalStorage.getItem("authKey"),
        "itemId": fulfillItemId
      }
      post('/testerFunction', payload, (response:any) => {
        console.log(payload)
        console.log(response)
        if(response.statusCode ==200){
          alert("Item has been fulfilled, refresh the item list")
          getNewRevenue()
          setIsOpen(!isOpen);
        }else{
          alert("Item has not been fulfilled, please try again")
        }
      })
    }
      
    return (
        <div>
            <button onClick={toggleModal}> Fulfill Item</button>

            {isOpen && (
                 <div className="popUp">
                 <div style={{display: "flex", flexDirection: "column"}}>
                 <div className = "popUpDisplay">
                     <div style={{display: "flex", flexDirection: "row"}}>
                     <select
                         onClick={e => getSellerItemIds(secureLocalStorage.getItem("username"))}
                         onChange={e => getFulfillItemId(Number(e.target.value))}
                         className="inputElement"
                         style={{border: '2px solid black', height: '55px'}}>
                         <option> Select an Item Id</option>
                         {sellerItemIds.map((id) => (
                             <option key={id} value={id}>
                             {id}
                             </option>
                         ))}
                         </select>
                     </div>
                     <button onClick={() => fulfillItem(secureLocalStorage.getItem("username"))}>Fulfill Item</button>
                     <button onClick={toggleModal} >Close</button>
                     </div>
                     </div>
                     </div>
                )
            }
        </div >
    );
};

export default FulfillItem;