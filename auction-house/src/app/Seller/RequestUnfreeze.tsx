'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';


const RequestUnfreeze = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sellerItemIds, setSellerFrozenItemIds] = useState([]);
    const [unfreezeItemId, setUnfreezeItemId] = useState(0);
    const [responseMessage, setResponseMessage] = useState<string>('');  //Response Message
    const [isResponseOpen, setIsResponseOpen] = useState<boolean>(false);  //Control Visibility of Popup 


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleResponse = () => {
        setIsResponseOpen(!isResponseOpen);
    };

      function getFrozenItemId(id: number) {
        setUnfreezeItemId(id)
      }

      function requestUnfreezeItem(sellerUsername: any) {
        let payload = {"sellerUsername": sellerUsername, "itemId": unfreezeItemId}
        post('/requestUnfreezeItems', payload, (response: { body: any; }) => { 
          console.log(payload);
          console.log(response);
          // Store Response Message
          const responseMessage = response.body?.response || 'An error occurred';
          setResponseMessage(responseMessage);
          toggleResponse();
        })
      }
    
      function getSellerFrozenItemIds(sellerUsername: any) {
        let payload = {"username": sellerUsername}
        let itemIds:any = []
        post('/retrieveFrozenItems', payload, (response: { body: any; }) => { 
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response["body"]["response"].length; i++){
            itemIds[i] = (response["body"]["response"][i]["itemId"])
          }
          setSellerFrozenItemIds(itemIds)
        })
      }
      
    return (
        <div>
            <button onClick={toggleModal}> Request Unfreeze Item</button>

            {isOpen && (
                 <div className="popUp">
                 <div style={{display: "flex", flexDirection: "column"}}>
                 <div className = "popUpDisplay">
                     <div style={{display: "flex", flexDirection: "row"}}>
                     <select
                         onClick={e => getSellerFrozenItemIds(secureLocalStorage.getItem("username"))}
                         onChange={e => getFrozenItemId(Number(e.target.value))}
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
                     <button onClick={() => requestUnfreezeItem(secureLocalStorage.getItem("username"))}>Request Unfreeze Item</button>
                     <button onClick={toggleModal} >Close</button>
                     </div>
                     </div>
                     </div>
                )}
           {isResponseOpen && (
            <div className="popUp">
            <div style={{display: "flex", flexDirection: "column"}}>
            <div className = "popUpDisplay">
                <div style={{display: "flex", flexDirection: "row"}}>
                <p>{responseMessage}</p>
                </div>
                <button onClick={toggleResponse}>Close</button>
                </div>
                </div>
                </div>
           )}
        </div >
    );
};

export default RequestUnfreeze;