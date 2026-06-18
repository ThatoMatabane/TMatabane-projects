# Presentation: Pastimes Online Store
## Reshaping the South African Thrift Market

---

### 1. Introduction & Goal
**The Slide:** "Sustainability Meets Luxury"
**The Talk:** 
Good day. Today I am presenting **Pastimes**, a high-end digital marketplace dedicated to second-hand clothing. Our goal was to solve a major problem: traditional thrift markets are often disorganized and lack trust. Pastimes bridges that gap by providing a structured, secure, and professional environment for buyers and sellers, specifically tailored for the South African market.

---

### 2. User Authentication (Login & Register)
**The Slide:** "Professional Security for Every User"
**The Talk:** 
Every user journey begins with our secure Account system. 
- **Registration**: Collects full profile data and uses industry-standard `password_hash` encryption to ensure user data is never vulnerable.
- **Login**: Features a robust session management system. 
- **Customization**: Once logged in, the system dynamically changes, showing a personalized dashboard and giving sellers the power to manage their unique inventory.

---

### 3. The Digital Catalog (Shop & Discovery)
**The Slide:** "Infinite Choice, Zero Friction"
**The Talk:** 
The heart of Pastimes is the Shop. We have implemented:
- **Sneaker Vault**: A dedicated section for sneakerheads to find rare kicks.
- **South African Pricing**: All items are listed in **Rands (ZAR)** with reduced, affordable "thrift" pricing.
- **Advanced Filtering**: Powered by PHP queries, users can filter by Category (Mens, Womens, Sneakers) and Brand instantly.
- **Sustainability Metrics**: We added a unique feature that shows the environmental impact (like water saved) for every item, encouraging responsible consumption.

---

### 4. Interactive Experience (UI/UX)
**The Slide:** "Modern Design, Instant Feedback"
**The Talk:** 
We used **Tailwind CSS** for a "mobile-first" approach. 
- **Real-time Toasts**: Using JavaScript, the app provides instant feedback when you add items to your cart, making the site feel alive and responsive.
- **Navigation**: Clean, accessible, and structured navigation that keeps the user focused on the products.

---

### 5. Backend Architecture (The Engine)
**The Slide:** "PHP & MySQL: The Power Behind the UI"
**The Talk:** 
The application is built on a "Traditional LAMP" stack (Linux, Apache, MySQL, PHP):
- **PHP Core**: Manages the logic between the database and the user. It handles everything from checking if a user is logged in to calculating cart totals.
- **XAMPP Optimized**: The code is specifically tuned to run on XAMPP servers, making it easy to deploy and manage locally.

---

### 6. Database Design (MySQL)
**The Slide:** "Relational Integrity & Scalability"
**The Talk:** 
Our database consists of several interconnected tables:
- **Users**: Stores profiles and roles.
- **Products**: Contains detailed metadata for every thrift item.
- **Relational Links**: Sellers are linked to products, and buyers are linked to reviews, ensuring full accountability.

---

### 7. Conclusion
**The Talk:** 
Pastimes is more than just a website; it’s a functional, professional tool that demonstrates how local markets can be modernized using clean code and intentional design. It’s secure, it’s fast, and it’s built for the future of fashion.

---
**Technical Specifications for Setup:**
- **Server:** Apache (via XAMPP)
- **Language:** PHP 8+
- **Styling:** Tailwind CSS CDN
- **Database:** MySQL (Import `database.sql`)
- **Integration:** Visual Studio / VS Code compatible
