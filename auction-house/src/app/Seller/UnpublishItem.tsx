'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';


const UnpublishItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sellerItemIds, setSellerItemIds] = useState([]);
    const [unpublishItemId, setunpublishItemId] = useState(0);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    function getUnpublishItemId(id: number) {
        setunpublishItemId(id)
      }

    function getSellerItemIds(sellerUsername: any) {
        let payload = {"username": sellerUsername, "authKey": secureLocalStorage.getItem("authKey")}
        let itemIds:any = []
        post('/getUnpublishEligibleItemIds', payload, (response: { body: any; }) => {
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response["body"]["response"].length; i++){
            itemIds[i] = (response["body"]["response"][i]["itemId"])
          }
          setSellerItemIds(itemIds)
        })
      }
    
      function unpublishItem(sellerUsername: any) {
        let payload = {"username": sellerUsername, "authKey": secureLocalStorage.getItem("authKey"), 
          "itemId": unpublishItemId
        }
        post('/unpublishItem', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            alert("Item has been unpublished, refresh the item list")
            setIsOpen(!isOpen);
          }else{
            alert("Item has not been unpublished, please try again")
          }
        })
      }
      
    return (
        <div>
            <button onClick={toggleModal}> Unpublish Item</button>

            {isOpen && (
                 <div className="popUp">
                 <div style={{display: "flex", flexDirection: "column"}}>
                 <div className = "popUpDisplay">
                     <div style={{display: "flex", flexDirection: "row"}}>
                     <select
                         onClick={e => getSellerItemIds(secureLocalStorage.getItem("username"))}
                         onChange={e => getUnpublishItemId(Number(e.target.value))}
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
                     <button onClick={() => unpublishItem(secureLocalStorage.getItem("username"))}>Unpublish Item</button>
                     <button onClick={toggleModal} >Close</button>
                     </div>
                     </div>
                     </div>
                )
            }
        </div >
    );
};

export default UnpublishItem;