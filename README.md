# Online Train Ticket Reservation

**Online Train Ticket Reservation** (*OTTR*) is a web platform for train ticket booking 
where customers can visually choose their seats, this representing the main feature. Other 
features include:
- Account registration, authentication and management;
- Rides filtering using different criteria;
- Payment for train tickets using **PayPal** and *SMS* confirmation;
- Easy car layouts and routes management for a qualified **railway administrator**;
- Many more...

The app consists of 2 components: **client** and **server**. The client was developed using
**Vue.js** while the server is based on **Node.js**. All data is stored inside a **MongoDB**
database so the app can be easily scalable regarding the data schemas. *OTTR* is also 
hosted on **Heroku** and can be easily accessed at:

https://ottr-reservation.herokuapp.com/

Feel free to create a new account and search for a ride from **Braila** to **Bucuresti Nord**
on **August 1st 2030**. To make a checkout using PayPal, you can use a sandbox PayPal account 
having the following credentials: (mail: **gabriel-griffin@gmail.com**, pwd: **G@br1el***). 
Note that the *SMS* confirmation feature has been disable since the **Nexmo API** that makes 
it possible has not been made available for free.

\
Table of Contents:
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Screenshots](#screenshots)
  - [Home Page](#home-page)
  - [Results Page](#results-page)
  - [My Account Page](#my-account-page)
  - [Ride Booking Page](#ride-booking-page)
  - [My Tickets Page](#my-tickets-page)
  - [SMS Confirmation](#sms-confirmation)
  - [Admin Pages](#admin-pages)
    - [Miscellaneous Page](#miscellaneous-page)
    - [Car Layouts Page](#car-layouts-page)
    - [Routes Page](#routes-page)
    - [Dashboard Page](#dashboard-page)

## Entity Relationship Diagram
![Entity Relationship Diagram](./docs/er-diagram.png)

## Screenshots

### Home Page
![Home Page](./docs/home-page.png)

### Results Page
![Results Page](./docs/rides-found-page.png)

### My Account Page
![My Account Page](./docs/my-account-page.png)
![My Account Edit Page](./docs/my-account-page-edit.png)

### Ride Booking Page
![Ride Booking Page 1](./docs/ride-booking-1-page.png)
![Ride Booking Page 2](./docs/ride-booking-2-page.png)
![Ride Booking Page 3](./docs/ride-booking-3-page.png)
![Ride Booking Page 4](./docs/ride-booking-4-page.png)

### My Tickets Page
![My Tickets Page](./docs/my-tickets-page.png)

### SMS Confirmation
![SMS Confirmation](./docs/sms-example.png)

### Admin Pages

#### Miscellaneous Page
![Miscellaneous Page](./docs/miscellaneous-page.png)

#### Car Layouts Page
![Car Layouts Page](./docs/car-layouts-page.png)
![Car Layouts Edit Page](./docs/car-layouts-edit-page.png)

#### Routes Page
![Routes Page](./docs/routes-page.png)
![Routes Edit 1 Page](./docs/routes-edit-1-page.png)
![Routes Edit 2 Page](./docs/routes-edit-2-page.png)
![Routes Edit 3 Page](./docs/routes-edit-3-page.png)
![Routes Edit 4 Page](./docs/routes-edit-4-page.png)
![Routes Edit 5 Page](./docs/routes-edit-5-page.png)

#### Dashboard Page
![Dashboard Page](./docs/dashboard-page.png)
