// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../slices/Login/reducer";     
import addressReducer from "../slices/Address/reducer";  
import bookingsReducer from "../slices/Bookings/reducer";
import serviceReducer from "../slices/Service/reducer";
import providerReducer from "../slices/Provider/reducer";
import servicesReducer from "../slices/Services/reducer"; 
import customerReducer from "../slices/Customer/reducer"; 
import authReducer from "../slices/Auth/reducer";
import supportReducer from "../slices/Support/reducer";
import reviewRatingReducer from "../slices/ReviewRating/reducer";
import categoriesReducer from "../slices/Services/reducer";
import transactionsReducer from "../slices/Transactions/reducer";

// import profileReducer from "../slices/Profile/reducer"; 

const store = configureStore({
  reducer: {
    login: loginReducer,
    addresses: addressReducer,
    bookings: bookingsReducer,
    //service: serviceReducer,
    provider: providerReducer,
    services: servicesReducer, 
    categories: categoriesReducer,
    customers: customerReducer,
    auth: authReducer,
    support: supportReducer,
    reviewRating: reviewRatingReducer,
    transactions: transactionsReducer,
    
    // profile: profileReducer, 
  },
});

export default store;