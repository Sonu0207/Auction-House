
Iteration 3 README 

Use Cases Implemented:  the directions are based on starting from the login page 

1. Buyer: Search recently sold

        Login as a buyer, reference (Buyer: Open Account). Once you are logged in, click the view recently sold button. This will populate the display with items that were recently sold. They display the final price of them item when it sold. In order to search the items, type and name or description into the textbox and click search. The display will update with your search and items that match. 

2. Buyer: Sort recently sold

        Login as a buyer, reference (Buyer: Open Account). Once you are logged in refresh the list, click the view recently sold button. This will populate the display with items that were recently sold. They display the final price of them item when it sold. To sort the list use the drop down menus label sort by and order. After you select the sorting mechanisms, click sort. The display should update to match. 

3. Buyer: View Item
        
        Login as a buyer, reference (Buyer: Open Account). Once you are logged in, scroll down until you see the refresh available items button. Click that button. The screen will populate with a list of items. In order to view an item, click on the item, this will navigate you to another screen where you are able to refresh the bids and see them or bid or buy the item outright based on what type and state the item is in. 

4. Buyer: Review purchases
        Login as a buyer, reference (Buyer: Open Account). Once you are logged in, click the review purchases button. This will populate a portion of the screen with purchased items. 

5. Sellers: Request unfreeze item

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Note which item Id you wish to request to be unfrozen. Along the top of the seller screen, there is a button called "Request Unfreeze". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be requested. Select the chosen item ID and press "Request Unfreeze". An alert will display when successful. If it fails to make the request, another alert notifying the user of a failure will appear.

6. Sellers: Review items

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. This will populate the screen with all the items and data associated with them. It will also state if it is a failed item, or a completed item.    

7. Sellers: Archive item

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to archive. Along the top of the seller screen, there is a button called "Archive Item". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be archived. Select the chosen item ID and press "Archive Item". An alert will display when successful. If it fails to archive an item, another alert notifying the user of a failure will appear. Closing the alert will navigate the seller back to their page. Refreshing the item list, will allow the seller to see the item is archived.

8. Admin: Generate auction report

         After following the directions noted in Admin: Login to Account, click the refresh Auction Report. The page will populate with all of the data within the data base. There is a column for buyers and seller and bids. It also shows a full list of items that will allow the admin to freeze and unfreeze items. If you want to look at specific data click on a buyer or seller, this will populate the screen with only that buyer or sellers data in terms of items and bids. This allows the admin to get a full report of the auction house. NOTE: PLEASE CLICK THE REFRESH AUCTION REPORT TWICE. THERE IS SOMETIMES A UPDATE ISSUE WHEN PULLING THAT DATA FROM THE RDS

9. Admin: Generate forensics report

        After following the directions noted in Admin: Login to Account, click the refresh Financial Forensic Report. The page will populate with all of the financial data that would be used in a forensic analysis to find suspicious values in the auction house. 

10. Customer: Search/filter items

        From the landing page, the user should select the "Continue as Customer" button. Note: sometimes this button does not work unless you refresh the page and click it once or twice. Once the Customer page, use the search type out the details of your search. The page will update as you type it. 


Iteration 2 README 

Use Cases Implemented:  the directions are based on starting from the login page 

1. Admin: Login to Account

        From the landing page, the user should leave the drop down menu as "Please Select a User Type" and then enter their pre-created username and password. Once this information is entered the user should click "login". Note the pre-created Admin username "Admin" is and the password is "1234" (no quotes around them). To return to the login page press the "logout" button.

2. Admin: Freeze Items

        After following the directions noted in Admin: Login to Account, click the refresh items button. The page will populate with all of the items within the auction house. Each item has a button that is freeze or unfreeze based on the items status. In order to freeze an item, click the freeze button. Once this is complete, an alert message will pop up with the status. Note: the buttons to freeze/unfreeze are only displayed for items that are eligible for this functionality. 

3. Admin: Unfreeze Items

        After following the directions noted in Admin: Login to Account, click the refresh all items button and refresh requests button. The page will populate with all of the items within the auction house and any active requests to unfreeze. Each item has a button that is freeze or unfreeze based on the items status. In order to unfreeze an item, click the unfreeze. Alternatively, click the unfreeze button in the corresponding request. Once this is complete, an alert message will pop up with the status. Note: the buttons to freeze/unfreeze are only displayed for items that are eligible for this functionality. 

4. Buyer: Place bid

        Login as a buyer, reference (Buyer: Open Account). Once you are logged refresh the list of items, and click the item that you would like to place a bid on. Once the item is clicked the page will navigate to the individual item page. Enter a bid amount and click the place bid button. Once the bid is successfully placed, a success message will appear. (If there is an issue, such as no bid amount being entered, a error message will appear.) The user is then automatically navigated to their buyer page. 
5. Buyer: Buy Now

        Login as a buyer, reference (Buyer: Open Account). Once you are logged refresh the list of items, and click the item that you would like to place a bid on. Once the item is clicked the page will navigate to the individual item page. Click the BuyNow Button. (If there is an issue a error message will appear.) The user is then automatically navigated to their buyer page.

6. Buyer: Review active bids

        Login as a buyer, reference (Buyer: Login to Account). Press the "Retrieve Active Bids" button. A list will display with the buyer's active bids. The list includes the item name, bid amount, and date of bid placement. 

7. Sellers: Request Unfreeze Item

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to Request to be Unfrozen. Along the top of the seller screen, there is a button called "Request Unfreeze". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be requested. Select the chosen item ID and press "Request Unfreeze". An alert will display when successful. If it fails to remove an item, another alert notifying the user of a failure will appear.

8. Sellers: Remove Inactive Item

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to remove. Along the top of the seller screen, there is a button called "Remove Inactive Item". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be removed. Select the chosen item ID and press "Remove Inactive Item". An alert will display when successful. If it fails to remove an item, another alert notifying the user of a failure will appear. Closing the alert will navigate the seller back to their page. Refreshing the item list, will allow the seller to see the item is no longer listed. 

9. Sellers: Fulfill item

        Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to fulfill. Along the top of the seller screen, there is a button called "Fulfill Item". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be fulfilled. Select the chosen item ID and press "Fulfill Item". An alert will display when successful. If it fails to fulfill an item, another alert notifying the user of a failure will appear. Closing the alert will navigate the seller back to their page. Refreshing the item list, will allow the seller to see the item is fulfilled. 

10. Sellers: Unpublish item

         Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to unpublish. Along the top of the seller screen, there is a button called "Unpublish Item". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be unpublished. Select the chosen item ID and press "Unpublish Item". An alert will display when successful. If it fails to unpublish an item, another alert notifying the user of a failure will appear. Closing the alert will navigate the seller back to their page. Refreshing the item list, will allow the seller to see the item is unpublished.

11. Sellers: Archive item

         Login as a seller, reference (Seller: Login to Account). Press the refresh button on the screen to see all of the seller's items. Not which item Id you wish to archive. Along the top of the seller screen, there is a button called "Archive Item". Click on this button. A page will pop up with a drop down menu of item ids that are eligible to be archived. Select the chosen item ID and press "Archive Item". An alert will display when successful. If it fails to archive an item, another alert notifying the user of a failure will appear. Closing the alert will navigate the seller back to their page. Refreshing the item list, will allow the seller to see the item is archived.


12. Customer: View Items 

        From the landing page, the user should select the "Continue as Customer" button. Note: sometimes this button does not work unless you refresh the page and click it once or twice. Once on this page the list of all active items will appear (this may take a couple seconds). The user is then able to select on each item to view it individually. To return to the login page press the "logout" button.

13. Customer: Search/filter items

        From the landing page, the user should select the "Continue as Customer" button. Note: sometimes this button does not work unless you refresh the page and click it once or twice. Once the Customer page, use the search type out the details of your search. The page will update as you type it.

14. Customer: Sort items

        From the landing page, the user should select the "Continue as Customer" button. Note: sometimes this button does not work unless you refresh the page and click it once or twice. Then using the drop down menus you can sort the data onscreen. 


General Issues:

        Hydration Error: This error commonly pops up, but does not affect any functionality. There is code in the background that gets randomized and changed when you refresh the page, but next.js is able to handel it. We have not been able to get rid of the error at this point, but again it does not affect functionality.

        In general, things can be slow to load so please give them a moment or double click. On initially loading the application, the page may need to be refreshed in order for the login/create account buttons to take effect.

        If the code is opened there will by a type definition issue on the Customer/page.tsx. The code still run correctly, this is only a note. 


####Iteration 1 README 

Use Cases Implemented: 

1. Buyer: Open Account 

        From the landing page, the user should select buyer from the drop down menu and then enter their selected username and password. Once this information is entered the user should click "create account". A success message will appear. Then click "login" to continue. Note: the username "buyer" is already created so you will not be able to make a new account with that username (it will give a failed to create account message). 

2. Buyer: Login to Account

        From the landing page, the user should select buyer from the drop down menu and then enter their pre-created username and password. Once this information is entered the user should click "login". 

3. Buyer: Add Funds

        Once on the buyer page (after login), use the value box to choose an amount (whole number) to add. Click off of the value box. Then click the "add funds" button. In the top right corner, text will display with the available funds and the total funds. This might take a minute to display. 

4. Buyer: Close Account

        When on the buyer specific page, the user can select the "close account" button. This will redirect them to the landing screen and they will be unable to login using the credentials they had before. (The redirection might take a second before it loads). When the user attempts to login again with their credentials a message "Failed to login" will appear. 

5. Sellers: Open Account

        From the landing page, the user should select seller from the drop down menu and then enter their selected username and password. Once this information is entered the user should click "create account". A success message will appear. Note: the messages do not clear, so if you just tested close account the failed to login message will be at the end of the success message. Then click "login" to continue. Note: the username "seller" is already created so you will not be able to make a new account with that username (it will give a failed to create account message). 

6. Sellers: Login to Account 

        From the landing page, the user should select seller from the drop down menu and then enter their pre-created username and password. Once this information is entered the user should click "login". 

7. Sellers: Close Account

        When on the seller specific page, the user can select the "close account" button. This will redirect them to the landing screen and they will be unable to login using the credentials they had before. 
        (The redirection might take a second before it loads). When the user attempts to login again with their credentials a message "Failed to login" will appear. 

8. Sellers: Add Item 

        For this, you will want to open and login to another account. Once on your seller page, there will be a column with a add item button at the top. To add an item you must fill in all required fields (all but the dates and description). The uploaded image must be a .jpg (lowercase). If you try to add an item that does not have all required fields it will not do so, but no error message will appear. To see the item has been added, scroll to the bottom of the page and click refresh button. Your item should appear in the list. If the image doesn't load press refresh again there is lag when uploading the image to the s3 for hosting. 

9. Sellers: Edit Item

        On the seller page, select the dropdown menu in the middle column. (Sometimes this dropdown needs to be clicked a couple time to populate.) Once an existing item is selected, then fill in the field that should be edited and press the corresponding button. To see the update, press refresh at the bottom of the screen and view the item in the Seller's list. Note: an item that is active will appear in the dropdown menu but no edits will be made since it is active. 


10. Sellers: Publish Item

        There are two ways to test this: 
        On the existing seller page, under the "publish item" button select the drop down menu, which displays all items that are eligible to be published. Select one of these and press the publish item button. Then click refresh again and notice that the item now has an active variable of 1 (true). Note: Since account has an active item you will be unable to close the account. Instead, press logout to get back to the home page. Both the end date and start date must have some value greater than the default "0000-00-00 00:00:00". Items will only be successfully published if the end date is set after the current time. In addition, the start date is currently reset to the current timestamp.

        From the login screen, select "Seller Page Link". This is a preset seller that has existing items. Scroll to the bottom of the screen and hit "refresh". This will display the items this seller has. Under the "publish item" button select the drop down menu, which displays all items that are eligible to be published. Select one of these and press the publish item button. Then click refresh again and notice that the item now has an active variable of 1 (true). Since account has an active item you will be unable to close the account. Instead, press logout to get back to the home page. 

            MAC ONLY, due to the way mac renders select html statements you will need to click multiple times in order to get it to load correctly 

11. Admin: Login to Account

        From the landing page, the user should leave the drop down menu as "Please Select a User Type" and then enter their pre-created username and password. Once this information is entered the user should click "login". Note the pre-created Admin username "Admin" is and the password is "1234" (no quotes around them). To return to the login page press the "logout" button.

12. Customer: View Items 

        From the landing page, the user should select the "Continue as Customer" button. Note: sometimes this button does not work unless you refresh the page and click it once or twice. Once on this page the list of all active items will appear (this may take a couple seconds). The user is then able to select on each item to view it indiviudally. To return to the login page press the "logout" button.

Issues:

    Hydration Error: This error commonly pops up, but does not affect any functionality. There is code in the background that gets randomized and changed when you refresh the page, but next.js is able to handel it. We have not been able to get rid of the error at this point, but again it does not affect functionality.\

    In general, things can be slow to load so please give them a moment or double click. On initially loading the application, the page may need to be refreshed in order for the login/create account buttons to take effect.



