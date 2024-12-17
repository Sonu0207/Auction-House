'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';


const PublishItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sellerItemIds, setSellerPublishItemIds] = useState([]);
    const [publishItemId, setPublishItemId] = useState(0);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

      function getPublishItemId(id: number) {
        setPublishItemId(id)
      }
      function publishItem(sellerUsername: any) {
        let payload = {"username": sellerUsername,
          "itemId": publishItemId
        }
        post('/publishItem', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            alert("Item has been published, refresh the item list")
            setIsOpen(!isOpen);
          }else{
            alert("Item has not been published, please try again")
          }
        })
      }
    
      function getSellerPublishItemIds(sellerUsername: any) {
        let payload = {"username": sellerUsername}
        let itemIds:any = []
        post('/getItemsToBePublished', payload, (response: { body: any; }) => {
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response["body"]["response"].length; i++){
            itemIds[i] = (response["body"]["response"][i]["itemId"])
          }
          setSellerPublishItemIds(itemIds)
        })
      }
      
    return (
        <div>
            <button onClick={toggleModal}> Publish Item</button>

            {isOpen && (
                 <div className="popUp">
                 <div style={{display: "flex", flexDirection: "column"}}>
                 <div className = "popUpDisplay">
                     <div style={{display: "flex", flexDirection: "row"}}>
                     <select
                         onClick={e => getSellerPublishItemIds(secureLocalStorage.getItem("username"))}
                         onChange={e => getPublishItemId(Number(e.target.value))}
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
                     <button onClick={() => publishItem(secureLocalStorage.getItem("username"))}>Publish Item</button>
                     <button onClick={toggleModal} >Close</button>
                     </div>
                     </div>
                     </div>
                )
            }
        </div >
    );
};

export default PublishItem;