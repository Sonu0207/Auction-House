'use client'
import React, { useState } from 'react';
import ItemLabels from './addItemDiv';
import { post } from '../Api';
import secureLocalStorage from 'react-secure-storage';
const AddItem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [failed, setFailed] = useState(false);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [displayImage, setDisplayImage] = useState<string | undefined>(undefined);
    const [base64Image, setBase64Image] = useState<any>(undefined);
    const [name, setName] = useState();
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState();
    const [publishDate, setPublishDate] = useState(Date);
    const [endDate, setEndDate] = useState(Date);
    const [buyNow, setBuyNow] = useState(false);
    const toggleModal = () => {
        setDisplayImage(undefined)
        setBuyNow(false)
        setIsOpen(!isOpen);
    };

    function getImageInput(i: any) {
        let imgName = i.name
        let fileExt = imgName.split(".")[1]
        setImage(imgName)
        if(fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png" || fileExt === "JPG" ||fileExt === "PNG"){
          console.log(i)
          setDisplayImage(URL.createObjectURL(i))
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
      function getNameInput(name: any) {
        setName(name)
      }
      function getPriceInput(price: number) {
        setPrice(parseFloat(price.toFixed(2)))
      }
      function getDescriptionInput(desc: any) {
        setDescription(desc)
      }
      function getPublishDateInput(date: any) {
        setPublishDate(date)
      }
      function getEndDateInput(date: any) {
        setEndDate(date)
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
          })
      }
      function addItem(sellerUsername: any) {
        const imageID = Math.floor(Math.random() * 1000000000);
        addImage(sellerUsername , imageID)
        let payload = {"username": sellerUsername,
          "image": String(imageID) + ".jpg",
          "name": name,
          "desc": description,
          "price": price,
          "endDate": endDate,
          "buyNow" : buyNow
        }
        post('/addItem', payload, (response: any) => {
          console.log(payload)
          console.log(response)
          if(response.statusCode ==200){
            alert("Item has been created, refresh the item list")
            setIsOpen(!isOpen);
          }else{
            alert("Item has not been created, please try again")
          }
        })
      }
    return (
        <div>
            <button onClick={toggleModal}> Add New Item</button>

            {isOpen && (
                <div className="popUp">
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="inputDisplay">
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>Image :    </label>
                            <input
                            onChange={e => {let f = e.target.files;
                                if (f && f.length > 0){getImageInput(f[0])}}}
                            className="inputElement" type="file"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>Name :    </label>
                            <input
                            onChange={e => getNameInput(e.target.value)}
                            className="inputElement"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>Price :    </label>
                            <input
                            onChange={e => getPriceInput(Number(e.target.value))}
                            className="inputElement" 
                            type="number"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>Description :    </label>
                            <input
                            onChange={e => getDescriptionInput(e.target.value)}
                            className="inputElement"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>Buy Immediately :    </label>
                            <input type='checkbox'
                            onChange={e => getBuyNowBoolean()}
                            className="inputElement"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                          <div className='editItemButtonContainer'>
                            <label className='addItemLabel'>End Date :    </label>
                            <input
                            onChange={e => getEndDateInput(e.target.value)}
                            className="inputElement"
                            type="datetime-local"
                            style={{border: '2px solid black', height: '55px'}}>
                            </input>
                          </div>
                            <div>
                                <img className='itemImage' src={displayImage}></img>
                            </div>
                            <button onClick={() => addItem(secureLocalStorage.getItem("username"))}>Create Item</button>
                            <button onClick={toggleModal}>Cancel</button>
                            {failed ? <label>Unable to Create Item</label>: null}
                        </div>
                    </div>
                    
                </div>
                
            )
            }
        </div >
    );
};

export default AddItem;