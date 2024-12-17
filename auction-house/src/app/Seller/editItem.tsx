'use client'
import React, { useState } from 'react';
import {post} from "../Api"
import secureLocalStorage from 'react-secure-storage';
const EditItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [failed, setFailed] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [base64Image, setBase64Image] = useState<any>(undefined);
    const [sellerItemIds, setSellerItemIds] = useState([]);
    const [editItemId, setEditItemId] = useState(0);
    const [editImage, setEditImage] = useState<string | undefined>(undefined);
    const [displayEditImage, setDisplayEditImage] = useState<string | undefined>(undefined);
    const [editBase64Image, setEditBase64Image] = useState<string | undefined>(undefined);
    const [editName, setEditName] = useState();
    const [editPrice, setEditPrice] = useState(0);
    const [editDescription, setEditDescription] = useState();
    const [editPublishDate, setEditPublishDate] = useState(Date);
    const [editEndDate, setEditEndDate] = useState(Date);  
    const [buyNow, setBuyNow] = useState(false); 
    


    const toggleModal = () => {
        setDisplayEditImage(undefined)
        setBuyNow(false)
        setIsOpen(!isOpen);
    };

    function getEditItemId(id: number) {
        setEditItemId(id)
      }
      function getEditImageInput(i: any) {
        let imgName = i.name
        let fileExt = imgName.split(".")[1]
        setImage(imgName)
        if(fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png" || fileExt === "JPG" ||fileExt === "PNG"){
          console.log(i)
          setDisplayEditImage(URL.createObjectURL(i))
          return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(i);
        
            fileReader.onload = () => {
              setBase64Image(fileReader.result);
              resolve(fileReader.result);
            };
        
            fileReader.onerror = (error) => {
              reject(error);
            };
          });
        }
        else{
          setImage(undefined)
          setBase64Image(undefined)
        }
      }
      function getEditNameInput(name: any) {
        setEditName(name)
      }
      function getEditPriceInput(price: number) {
        setEditPrice(parseFloat(price.toFixed(2)))
      }
      function getEditDescriptionInput(desc: any) {
        setEditDescription(desc)
      }
      function getEditPublishDateInput(date: any) {
        setEditPublishDate(date)
      }
      function getEditEndDateInput(date: any) {
        setEditEndDate(date)
      }
    function getSellerItemIds(sellerUsername: any) {
        let payload = {"username": sellerUsername}
        let itemIds:any = []
        post('/getSellerItemIds', payload, (response: { body: any; }) => {
          console.log(payload)
          console.log(response)
          for(let i = 0; i < response["body"]["response"].length; i++){
            itemIds[i] = (response["body"]["response"][i]["itemId"])
          }
          setSellerItemIds(itemIds)
        })
      }
      function getBuyNowBoolean(){
        console.log(buyNow)
        setBuyNow(!buyNow)
        console.log(buyNow)
      }
    async function addImage(sellerUsername: any, imageID : any){
        //setBase64Image("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/av4lsYAAAAASUVORK5CYII=")
          console.log(base64Image.split(",")[1])
          let payloadUpload = {
            "username": sellerUsername,
            "imageName": image,
            "imageBase64": base64Image.split(",")[1], 
            "imageID": imageID
          }
          post('/noVPCUpload', payloadUpload, (response: { body: any; }) => {
            console.log(payloadUpload)
            console.log(response)
            console.log(response.body)
            console.log(response.body.imageID)
            console.log("Image ID:" + String(response.body.imageID) + ".jpg")
            setEditImage(String(response.body.imageID) + ".jpg")
          })
      }
    
    
      function editItem(sellerUsername: any, type:string, change:any) {
        if(type == "image"){
          const imageID = Math.floor(Math.random() * 1000000000);
          addImage(sellerUsername , imageID);
          change = String(imageID) + ".jpg";
        }
    
        let payload = {
          "username": sellerUsername,
          "itemId": editItemId,
          "updateType": type,
          "change":change
        }
    
        post('/editItem', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            alert("Item has been edited, refresh the item list")
            setIsOpen(!isOpen);
          }else{
            alert("Item has not been edited, please try again")
          }
        })
      }
    return (
        <div>
            <button onClick={toggleModal}> Edit an Item</button>

            {isOpen && (
                <div className="popUp">
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                        <select
                            onClick={e => getSellerItemIds(secureLocalStorage.getItem("username"))}
                            onChange={e => getEditItemId(Number(e.target.value))}
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
                        <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="inputDisplay">
                            <div className="editItemButtonContainer">
                                <input
                                    onChange={e => {let f = e.target.files;
                                    if (f && f.length > 0){getEditImageInput(f[0])}}}
                                    className="inputElement" type="file"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                className="inputElement"
                                onClick={() => editItem(secureLocalStorage.getItem("username"), "image","image")}>Edit Image
                                </button>
                            </div>
                            <div className="editItemButtonContainer">
                                <input
                                    onChange={e => getEditNameInput(e.target.value)}
                                    className="inputElement"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                    className="inputElement"
                                    onClick={() => editItem(secureLocalStorage.getItem("username"), "name", editName)}>Edit Name
                                </button>

                            </div>
                            <div className="editItemButtonContainer">
                                <input
                                    onChange={e => getEditPriceInput(Number(e.target.value))}
                                    className="inputElement" 
                                    type="number"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                    className="inputElement"
                                    onClick={() => editItem(secureLocalStorage.getItem("username"), "price", editPrice)}>Edit Price
                                </button>
                            
                            </div>
                            <div className="editItemButtonContainer">
                                <input
                                    onChange={e => getEditDescriptionInput(e.target.value)}
                                    className="inputElement"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                    className="inputElement"
                                    onClick={() => editItem(secureLocalStorage.getItem("username"), "desc", editDescription)}>Edit Description
                                </button>
                            
                            </div>
                            <div className="editItemButtonContainer">
                                <input
                                    type='checkBox'
                                    onChange={() => getBuyNowBoolean()}
                                    className="inputElement"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                    className="inputElement"
                                    onClick={() => editItem(secureLocalStorage.getItem("username"), "buyNow", buyNow)}>Change to Buy Now?
                                </button>
                            
                            </div>
                            <div className="editItemButtonContainer">
                                <input
                                    onChange={e => getEditEndDateInput(e.target.value)}
                                    className="inputElement"
                                    type="datetime-local"
                                    style={{border: '2px solid black', height: '55px'}}>
                                </input>
                                <button
                                    className="inputElement"
                                    onClick={() => editItem(secureLocalStorage.getItem("username"), "endDate", editEndDate)}>Edit End Date
                                </button>
                            </div>
                            <div>
                            <img className='itemImage' src={displayEditImage}></img>
                            </div>
                        </div>
                        
                        </div>
                        
                        {failed ? <label>Unable to Change Item</label>: null}
                        <button onClick={toggleModal} >Close</button>
                    </div>
                        
                        
                </div>
            )
            }
        </div >
    );
};

export default EditItem;