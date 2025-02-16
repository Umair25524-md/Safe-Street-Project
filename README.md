
# SafeStreet Web App  

SafeStreet is a web-based platform designed to detect and report road damages, helping authorities prioritize and schedule repairs efficiently. Utilizing a Vision Transformer (ViT) model, the system accurately classifies damage types and severity levels while providing advanced visualizations for better decision-making.

## Features  
- Road damage detection and severity assessment using ViT model  
- Detailed text summaries for damage type and repair priority  
- Historical analysis and advanced visualizations for road authorities  
- Authentication (Login and Signup)  
- Intuitive and user-friendly interface  

## Tech Stack  
### Frontend:  
- React.js  
- Tailwind CSS  
- GSAP for animations  
- React Router for navigation  
- Axios for API requests  

### Backend:  
- Node.js  
- Express.js  
- MongoDB (Database)  
- JWT Authentication with HTTP-only cookies  

## Installation and Setup  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Rayan-360/Safe-Street-Project.git
   cd safestreet-web
   ```

2. Install dependencies:  
   - Frontend:  
     ```bash
     cd frontend
     npm install
     ```
   - Backend:  
     ```bash
     cd ../backend
     npm install
     ```

3. Environment Variables:  
   Create a `.env` file in the backend directory with the following:  
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```

4. Start the application:  
   - Frontend:  
     ```bash
     npm run dev
     ```
   - Backend:  
     ```bash
     nodemon server.js
     ```


## Usage  
1. Sign up and log in to access the dashboard.  
2. View road damage reports and insights.  
3. Analyze damage severity and prioritize repairs.  

## Future Enhancements  
- Uploading images for custom damage detection  
- Mobile app integration  
- Real-time notifications for road authorities  

## License  
This project is licensed under the MIT License.

## Contributors  
- [Rayan](https://github.com/Rayan-360)  
- [Umair](https://github.com/Umair25524-md)
- [Viraj](https://github.com/VirajPalnitkar)
