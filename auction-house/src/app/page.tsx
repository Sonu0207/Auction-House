"use client"
import Image from "next/image";
import Link from "next/link";
import "./globals.css"
import logo from "../../assets/AuctionHouseLogo.png"
import secureLocalStorage from "react-secure-storage";
import { useState } from "react";
import { encrypt, decrypt } from "./encrypt";
import { post } from "./Api";
import { useRouter } from "next/navigation";
import NavigationBar from "./navigationBar";
export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [accountCreated, setAccountCreated] = useState(false)
  const [accountFailed, setAccountFailed] = useState(false)
  const [invalidLogin, setInvalidLogin] = useState(false)
  const [badAuth, setBadAuth] = useState(false)
  const router = useRouter()
  
    // Function to handle creating a buyer or seller account
    function handleCreateAccount() {
      const selectElement = document.getElementById("typeSelect") as HTMLSelectElement;
      const optionValue = selectElement?.value;
      const codedPasscode = encryptPasscode();
      const payload = { username,password: { iv: codedPasscode.iv, encryptedData: codedPasscode.encryptedData }};
      if (optionValue === "buyer") {
        post('/createBuyer', payload, (response: any) => {
          console.log(response);
          if (response.statusCode === 201) {
            console.log("Account created successfully.");
            alert("Buyer account has been created")
            //router.push("/Buyer");
          } else {
            console.log("Error:", response.body.message);
            alert("Buyer account has not been created, please try again with a new username")
          }
        });
      } else if (optionValue === "seller") {
        post('/createSeller', payload, (response: any) => {
          console.log(response);  // Log the response body
          if (response.statusCode === 201) {
            console.log("Account created successfully.");
            alert("Seller account has been created")
            //router.push("/Seller");
          } else {
            console.log("Error:", response.body.message);
            alert("Seller account has not been created, please try again with a new username")
          }
        });
      }
    }


  function handleLogin() { 
    secureLocalStorage.clear()
    secureLocalStorage.setItem("username", username);
    secureLocalStorage.setItem("password", password);
    console.log(secureLocalStorage.getItem("username"))
    let codedPasscode = encryptPasscode()
    let selectElement = (document.getElementById("typeSelect")) as HTMLSelectElement;
    let selection = selectElement.selectedIndex;
    let optionValue = selectElement.options[selection].value;
    console.log(optionValue)

    let payload = { username: username, password: codedPasscode, userType: optionValue }
    post('/login', payload, (response: any) => { 
        console.log(response);
        if (response.statusCode == 200) {
          secureLocalStorage.setItem("authKey", response.body.authKey)
          if (response.body.userType == "seller") {
            secureLocalStorage.setItem("revenue", response.body.revenue);
            router.push('/Seller')
          } else if (response.body.userType == "buyer") {
            secureLocalStorage.setItem("totalFunds", response.body.totalFunds);
            secureLocalStorage.setItem("availableFunds", response.body.availableFunds);
            router.push('/Buyer')
          } else {
            secureLocalStorage.setItem('houseFunds', response.body.revenue)
            router.push('/Admin')
          }
        } else {
          console.log("Bad Auth")
          alert("Account could not be logged in, please try again")
        }
    })
  }

  function encryptPasscode() {
    console.log(password)
    let encrypted = encrypt(password);
    console.log(encrypted);
    console.log(decrypt(encrypted))
    return encrypted;
  }

  function selectUser() {
    let selectElement = (document.getElementById("typeSelect")) as HTMLSelectElement;
    let selection = selectElement.selectedIndex;
    let optionValue = selectElement.options[selection].value;
    console.log(optionValue)
  }

  function customerPage() {
    router.push("/Customer");
  }

  function mockLoginSeller() {
    secureLocalStorage.setItem("username", "seller");
    secureLocalStorage.setItem("password", "1234");
    secureLocalStorage.setItem("authKey", "1");
    router.push("/Seller");
  }

  function mockLoginBuyer() {
    secureLocalStorage.setItem("username", "buyer");
    secureLocalStorage.setItem("password", "1234");
    secureLocalStorage.setItem("authKey", "1");
    router.push("/Buyer");
  }

  function mockLoginAdmin() {
    secureLocalStorage.setItem("username", "Admin");
    secureLocalStorage.setItem("password", "1234");
    secureLocalStorage.setItem("authKey", "12345");
    router.push("/Admin");
  }



  return (
    <div>
      <div className="header">
        <NavigationBar/>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <img className="titleScreenLogo" src={logo.src}></img>
          <div className="container">
            <select id="typeSelect" className="typeSelect" name="Select Login" onChange={selectUser}>
              <option value="">Please Select a User Type</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
            <br />
            <label>Username:</label>
            <input id = "user" type="text" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}></input>
            <label>Password:</label>
            <input id = "pass" type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}></input>
            {accountCreated ? <label>Account Created please Login</label> : null}
            {accountFailed ? <label>Account Failed To create</label> : null}
            {invalidLogin ? <label>Failed To Login</label> : null}
            <button onClick={handleLogin}>Login</button>
            {/* New Create Account Button */}
            <button onClick={handleCreateAccount}>Create Account</button>
          </div>
          <button onClick={customerPage}>Continue As Customer</button>
          <button onClick={mockLoginSeller}>Seller Page Link</button>
          <button onClick={mockLoginBuyer}>Buyer Page Link</button>
          <button onClick={mockLoginAdmin}>Admin Page Link</button>
        </main>
      </div>
    </div>
  );
}
