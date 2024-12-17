'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';


const RemoveInactiveItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sellerItemIds, setSellerItemIds] = useState([]);
    const [removeInactiveItemId, setRemoveInactiveItemId] = useState(0);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    function getRemoveInactiveItemId(id: number) {
        setRemoveInactiveItemId(id)
      }

    function getSellerItemIds(sellerUsername: any) {
        let payload = {"username": sellerUsername, "authKey": secureLocalStorage.getItem("authKey")}
        let itemIds:any = []
        post('/getRemoveEligibleItemIds', payload, (response: { body: any; }) => {
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response["body"]["response"].length; i++){
            itemIds[i] = (response["body"]["response"][i]["itemId"])
          }
          setSellerItemIds(itemIds)
        })
      }
    
      function removeInactiveItem(sellerUsername: any) {
        let payload = {"username": sellerUsername, "authKey": secureLocalStorage.getItem("authKey"), 
          "itemId": removeInactiveItemId
        }
        post('/removeInactiveItem', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            alert("Item has been removed, refresh the item list")
            setIsOpen(!isOpen);
          }else{
            alert("Item has not been removed, please try again")
          }
        })
      }
      
    return (
        <div>
            <button onClick={toggleModal}> Remove Inactive Item</button>

            {isOpen && (
                 <div className="popUp">
                 <div style={{display: "flex", flexDirection: "column"}}>
                 <div className = "popUpDisplay">
                     <div style={{display: "flex", flexDirection: "row"}}>
                     <select
                         onClick={e => getSellerItemIds(secureLocalStorage.getItem("username"))}
                         onChange={e => getRemoveInactiveItemId(Number(e.target.value))}
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
                     <button onClick={() => removeInactiveItem(secureLocalStorage.getItem("username"))}>Remove Inactive Item</button>
                     <button onClick={toggleModal} >Close</button>
                     </div>
                     </div>
                     </div>
                )
            }
        </div >
    );
};

export default RemoveInactiveItem;