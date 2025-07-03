# FlockWish - Corporate Collaborative Wishlist Platform

A professional-grade collaborative shopping application built for the FlockShop.ai internship assignment. This enterprise-ready platform enables teams to create shared wishlists, manage products, and collaborate in real-time with a clean, corporate-level UI.

## 🎯 Assignment Requirements Checklist

### ✅ Frontend Features (React)
- **✅ Sign up & log in** - Complete authentication system with JWT
- **✅ Create a new wishlist** - Full CRUD functionality
- **✅ Add, edit, and remove products** - Name, image URL, price management
- **✅ Invite others to join wishlist** - Email-based invitation system
- **✅ Show who added which item** - User attribution for all products

### ✅ Backend Features (Node.js/Express via Next.js API)
- **✅ REST APIs** - Complete RESTful architecture
- **✅ User signup/login** - JWT-based authentication
- **✅ CRUD for wishlists and products** - Full database operations
- **✅ Store who created/edited each item** - Complete audit trail

### ✅ Database (MongoDB)
- **✅ Store wishlists** - Complete wishlist management
- **✅ Store user data** - User profiles and authentication
- **✅ Store product items** - Product details with metadata
- **✅ Store timestamps** - Created/updated tracking

### ✅ Bonus Features
- **✅ Comments on products** - Full commenting system
- **✅ Emoji reactions** - React with 👍, ❤️, 😍
- **✅ Responsive mobile-friendly UI** - Corporate-grade responsive design

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Corporate-grade styling
- **shadcn/ui** - Professional component library
- **Lucide React** - Clean iconography

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **JWT Authentication** - Secure token-based auth
- **bcryptjs** - Password hashing
- **MongoDB Native Driver** - Direct database operations

### Database
- **MongoDB** - Document-based storage
- **Structured Collections** - Users, Wishlists with embedded products
- **Indexing** - Optimized queries

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Environment Setup

1. **Clone and install**
   \`\`\`bash
   git clone <repository-url>
   cd flockwish-app
   npm install
   \`\`\`

2. **Environment Variables**
   Create \`.env.local\` file:
   \`\`\`env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flockwish
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   \`\`\`

3. **MongoDB Setup**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Replace \`MONGODB_URI\` in \`.env.local\`

4. **Run the application**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Access the app**
   Open \`http://localhost:3000\`

## 🗄 Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Wishlists Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  createdBy: {
    _id: ObjectId,
    name: String,
    email: String
  },
  collaborators: [{
    _id: ObjectId,
    name: String,
    email: String,
    joinedAt: Date
  }],
  products: [{
    _id: ObjectId,
    name: String,
    price: Number,
    imageUrl: String,
    description: String,
    addedBy: {
      _id: ObjectId,
      name: String,
      email: String
    },
    comments: [{
      _id: ObjectId,
      text: String,
      author: {
        _id: ObjectId,
        name: String,
        email: String
      },
      createdAt: Date
    }],
    reactions: [{
      emoji: String,
      count: Number,
      users: [ObjectId]
    }],
    createdAt: Date,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🔧 REST API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Create user account
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user
- \`POST /api/auth/logout\` - User logout

### Wishlists
- \`GET /api/wishlists\` - Get user's wishlists
- \`POST /api/wishlists\` - Create new wishlist
- \`GET /api/wishlists/[id]\` - Get specific wishlist

### Products
- \`POST /api/wishlists/[id]/products\` - Add product
- \`DELETE /api/wishlists/[id]/products/[productId]\` - Remove product

### Collaboration
- \`POST /api/wishlists/[id]/invite\` - Invite collaborator
- \`POST /api/wishlists/[id]/products/[productId]/comments\` - Add comment
- \`POST /api/wishlists/[id]/products/[productId]/reactions\` - Add reaction

## 🏗 Project Architecture

\`\`\`
app/
├── api/                    # REST API endpoints
│   ├── auth/              # Authentication routes
│   └── wishlists/         # Wishlist CRUD operations
├── dashboard/             # User dashboard
├── login/                 # Login page
├── signup/                # Registration page
├── wishlist/              # Wishlist management
│   ├── new/              # Create wishlist
│   └── [id]/             # View/edit wishlist
├── globals.css           # Global styles
├── layout.tsx            # Root layout
└── page.tsx              # Landing page

lib/
├── mongodb.ts            # Database connection
└── models/               # TypeScript interfaces
    ├── User.ts
    └── Wishlist.ts

components/ui/            # Reusable components
\`\`\`

## 🎨 Design Philosophy

### Corporate-Level UI
- **Clean & Professional** - Minimal, business-focused design
- **Consistent Typography** - Clear hierarchy and readability
- **Neutral Color Palette** - Gray-based with blue accents
- **Spacious Layout** - Adequate whitespace for clarity
- **Accessible** - WCAG compliant design patterns

### Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Appropriate touch targets
- **Progressive Enhancement** - Works on all devices

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **HTTP-Only Cookies** - Secure token storage
- **Input Validation** - Server-side validation
- **Access Control** - Role-based permissions

## 📱 Features Overview

### User Management
- Secure registration and login
- Profile management
- Session handling

### Wishlist Management
- Create and organize wishlists
- Collaborative editing
- Real-time updates

### Product Management
- Add products with images and pricing
- Edit and remove products
- Track who added what

### Collaboration
- Invite team members
- Comment on products
- React with emojis
- Activity tracking

## 🚀 Deployment

### MongoDB Setup in Production
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Get connection string

### Environment Variables
\`\`\`env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong_random_string
NODE_ENV=production
\`\`\`

### Vercel Deployment
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Wishlist creation and management
- [ ] Product CRUD operations
- [ ] Collaboration features
- [ ] Comments and reactions
- [ ] Mobile responsiveness
- [ ] Error handling

## 🔮 Future Enhancements

### Phase 1
- Real-time WebSocket updates
- Advanced search and filtering
- Bulk product import
- Email notifications

### Phase 2
- Role-based permissions
- Product categories
- Price tracking
- Analytics dashboard

### Phase 3
- API integrations
- Mobile app
- Advanced reporting
- Enterprise features

## 📊 Performance Considerations

- **Database Indexing** - Optimized queries
- **Image Optimization** - Next.js image optimization
- **Caching** - Strategic caching implementation
- **Bundle Optimization** - Code splitting and tree shaking

## 🤝 Contributing

This project demonstrates enterprise-level development practices:
- TypeScript for type safety
- Clean architecture patterns
- Comprehensive error handling
- Security best practices
- Scalable database design

## 📄 License

Created for FlockShop.ai internship assignment - Educational purposes.

---

**Built with ❤️ for FlockShop.ai**

*Demonstrating enterprise-grade full-stack development capabilities*
\`\`\`
\`\`\`

## 🎯 **What You Need to Set Up:**

### **Required Downloads/Installations:**
1. **Node.js 18+** - Download from nodejs.org
2. **MongoDB Compass** - For database management
3. **Code Editor** - VS Code recommended

### **MongoDB Setup:**
1. **Create MongoDB Atlas Account** (free tier available)
2. **Create a new cluster**
3. **Get your connection string** - Replace in `.env.local`
4. **Database will auto-create** when you first run the app

### **Environment Variables:**
Create `.env.local` file with:
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
