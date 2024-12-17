"use client"
import Image from "next/image";
import Link from "next/link";
import "./globals.css"
import logo from "../../assets/AuctionHouseLogo.png"
import secureLocalStorage from "react-secure-storage";
import { useState } from "react";
import { encrypt, decrypt } from "./encrypt";
import { post } from "./Api";
import { usePathname, useRouter } from "next/navigation";


export default function NavigationBar() {
    const router = useRouter()
    const currentPathname = usePathname(); // Get current route
    const [sellerPage, setSellerPage] = useState(currentPathname == "/Seller/");
    const [buyerPage, setBuyerPage] = useState(currentPathname == "/Buyer/");
    const [itemBuyerPage, setItemBuyerPage] = useState(currentPathname == "/ItemBuyerPage/");
    const [customerPage, setCustomerPage] = useState(currentPathname == "/Customer/");
    const [adminPage, setAdminPage] = useState(currentPathname == "/Admin/");
    const [loginPage, setLoginPage] = useState(currentPathname == "/");


    return (
        <div className="navContainer">
            <div className="navItems">
                {sellerPage ? 
                    <div className="navItems">
                        <label className="welcomeLabel">Welcome to the Auction House</label>
                        <div className="accountContainer">
                            <label className="">{"Account Name : " + secureLocalStorage.getItem("username")}</label>
                            <label className="">{"Revenue : " + secureLocalStorage.getItem("revenue")}</label>
                            
                        </div>
                        <button className = "logoutButton"onClick={() => router.push("/")}>Logout</button>
                    </div>
                    
                : null}
                {buyerPage ? 
                    <div className="navItems">
                        <label className="welcomeLabel">Welcome to the Auction House</label>
                        <label className="">{"Account Name : " + secureLocalStorage.getItem("username")}</label>
                        <div className="accountContainer">
                            <label className="">{"Available Funds : " + secureLocalStorage.getItem("availableFunds")}</label>
                            <label className="">{"Total Funds : " + secureLocalStorage.getItem("totalFunds")}</label>
                        </div>
                        <button className = "logoutButton"onClick={() => router.push("/")}>Logout</button>
                     </div>
                : null}
                {itemBuyerPage ? 
                    <div className="navItems">
                        <label className="welcomeLabel">Welcome </label>
                        <label className="">{"Account Name : " + secureLocalStorage.getItem("username")}</label>
                        <div className="accountContainer">
                            <label className="">{"Available Funds : " + secureLocalStorage.getItem("availableFunds")}</label>
                            <label className="">{"Total Funds : " + secureLocalStorage.getItem("totalFunds")}</label>
                        </div>
                        <button className = "logoutButton"onClick={() => router.push("/")}>Logout</button>
                     </div>
                : null}
                {customerPage ? 
                    <div className="navItems">
                        <label className="welcomeLabel">Welcome to the Auction House</label>
                        <button className = "logoutButton"onClick={() => router.push("/")}>Login</button>
                    </div> 
                : null}
                {adminPage  ?
                    <div className="navItems">
                    <label className="welcomeLabel">Welcome to the Auction House</label>
                    <div className="accountContainer">
                            <label className="">{"Account Name : " + secureLocalStorage.getItem("username")}</label>
                            <label className="">{"Revenue : " + secureLocalStorage.getItem("houseFunds")}</label>
                            
                        </div>
                    <button className = "logoutButton"onClick={() => router.push("/")}>Logout</button>
                 </div>
                : null}
                {loginPage  ?
                    <label className="welcomeLabel">Welcome to the Auction House</label> 
                : null}
            </div>
        </div>
    );
}