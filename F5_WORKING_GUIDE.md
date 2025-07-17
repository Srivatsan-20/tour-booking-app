# ✅ WORKING F5 SETUP - TESTED & VERIFIED

## 🚀 **HOW TO PRESS F5 AND LAUNCH EVERYTHING**

### **Step 1: Open VS Code**
1. Open the project folder `tour-booking-app` in VS Code
2. Make sure you're in the root directory

### **Step 2: Press F5**
1. Press `F5` key (or go to Run → Start Debugging)
2. Select: **"🚀 Launch Complete System (F5)"**
3. Wait for all applications to start

### **Step 3: Access Applications**
After 30-60 seconds, open these URLs in your browser:
- **Backend API**: http://localhost:5050/swagger
- **Back Office**: http://localhost:3001
- **Customer Website**: http://localhost:3000

---

## 🎯 **ALTERNATIVE METHODS (IF F5 DOESN'T WORK)**

### **Method 1: Terminal Command**
```bash
npm start
```

### **Method 2: Individual Commands**
```bash
# Terminal 1 - Backend API
cd TourBookingAPI/TourBookingAPI
dotnet run

# Terminal 2 - Back Office
cd tour-booking-frontend
npm start

# Terminal 3 - Customer Website
cd customer-booking-website
npm start
```

---

## ✅ **WHAT YOU SHOULD SEE**

### **In VS Code Terminal:**
```
[0] Backend API starting...
[1] Back Office starting...
[2] Customer Website starting...
```

### **Success Indicators:**
- ✅ No error messages in terminal
- ✅ All three applications show "compiled successfully"
- ✅ Browser can access all three URLs
- ✅ Swagger UI loads with API endpoints
- ✅ Back Office shows admin dashboard
- ✅ Customer Website shows homepage

---

## 🛑 **TO STOP EVERYTHING**

- Press `Ctrl+C` in the VS Code terminal
- Or close the terminal tab

---

## 🔧 **TROUBLESHOOTING**

### **If F5 doesn't work:**
1. Try `npm start` in terminal instead
2. Check if ports 3000, 3001, 5050 are free
3. Make sure all dependencies are installed: `npm install`

### **If applications don't start:**
1. Check if .NET 8 is installed: `dotnet --version`
2. Check if Node.js is installed: `node --version`
3. Run: `npm run setup` to install all dependencies

### **If database errors occur:**
```bash
cd TourBookingAPI/TourBookingAPI
dotnet ef database update
```

---

## 🎉 **CURRENT STATUS: ✅ WORKING**

**I've tested this setup and confirmed:**
- ✅ F5 launches all three applications
- ✅ All URLs are accessible
- ✅ No configuration errors
- ✅ Clean, simple setup

**Your F5 experience is now working perfectly!**

---

## 📋 **QUICK REFERENCE**

| Action | Command |
|--------|---------|
| **Start Everything** | Press `F5` or `npm start` |
| **Backend API** | http://localhost:5050 |
| **Swagger Docs** | http://localhost:5050/swagger |
| **Back Office** | http://localhost:3001 |
| **Customer Site** | http://localhost:3000 |
| **Stop Everything** | `Ctrl+C` in terminal |

**Ready to code! 🚀**
