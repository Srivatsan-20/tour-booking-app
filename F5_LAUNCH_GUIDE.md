# 🚀 F5 Launch Guide - Sri Sai Senthil Tours Complete System

## 🎯 **ONE-CLICK STARTUP METHODS**

### **Method 1: NPM Start (Recommended)**
```bash
npm start
```
**✅ This is the easiest way - just press F5 in VS Code terminal or run this command**

### **Method 2: Windows Batch File**
```bash
start-all.bat
```
**✅ Double-click the batch file or run from command prompt**

### **Method 3: PowerShell Script**
```powershell
.\start-all.ps1
```
**✅ Right-click and "Run with PowerShell" or execute in PowerShell terminal**

### **Method 4: Visual Studio Code**
1. Open VS Code in the project root
2. Press `Ctrl+Shift+P`
3. Type "Tasks: Run Task"
4. Select "start-all-applications"
5. **✅ All applications will start automatically**

### **Method 5: Visual Studio**
1. Open `TourBookingSystem.sln`
2. Press F5 to start the backend
3. Open terminal and run: `npm run start:backoffice && npm run start:customer`

---

## 🌐 **WHAT GETS STARTED**

When you use any of the above methods, these applications will start:

| Application | URL | Port | Purpose |
|-------------|-----|------|---------|
| **Backend API** | http://localhost:5050 | 5050 | REST API & Database |
| **Swagger Docs** | http://localhost:5050/swagger | 5050 | API Documentation |
| **Back Office** | http://localhost:3001 | 3001 | Admin Management |
| **Customer Website** | http://localhost:3000 | 3000 | Public Booking Site |

---

## ⚡ **AUTOMATIC FEATURES**

### **Auto-Opening in Browser**
- All applications automatically open in your default browser
- Swagger documentation loads for API testing
- Both frontend applications are ready to use immediately

### **Live Reload**
- ✅ Frontend changes reload automatically
- ✅ Backend changes restart the API automatically
- ✅ Database changes are applied via migrations

### **Colored Console Output**
- 🔵 Backend API logs in blue
- 🟢 Back Office logs in green  
- 🟡 Customer Website logs in yellow

---

## 🔧 **TROUBLESHOOTING**

### **If Applications Don't Start**
1. **Check Prerequisites:**
   ```bash
   node --version    # Should be v16+
   npm --version     # Should be v8+
   dotnet --version  # Should be 8.0+
   ```

2. **Install Dependencies:**
   ```bash
   npm run setup
   ```

3. **Check Ports:**
   - Ensure ports 3000, 3001, and 5050 are available
   - Close any applications using these ports

### **If Database Issues Occur**
```bash
cd TourBookingAPI/TourBookingAPI
dotnet ef database update
```

### **If Frontend Issues Occur**
```bash
npm run clean
npm run install:all
```

---

## 🎮 **DEVELOPMENT WORKFLOW**

### **Daily Development**
1. **Start Everything:** `npm start`
2. **Make Changes:** Edit code in any application
3. **Test:** Changes reload automatically
4. **Stop:** Press `Ctrl+C` in the terminal

### **Individual Application Control**
```bash
npm run start:backend     # Only API
npm run start:backoffice  # Only Admin Site
npm run start:customer    # Only Customer Site
```

### **Building for Production**
```bash
npm run build            # Build all frontend apps
```

---

## 📱 **TESTING THE SYSTEM**

### **Backend API Testing**
- Visit: http://localhost:5050/swagger
- Test all endpoints directly in Swagger UI
- Check database connectivity

### **Back Office Testing**
- Visit: http://localhost:3001
- Login with admin credentials
- Test bus management, bookings, trip accounts

### **Customer Website Testing**
- Visit: http://localhost:3000
- Search for buses
- Test booking flow
- Create customer account

---

## 🎉 **SUCCESS INDICATORS**

### **You'll Know It's Working When:**
✅ Three browser tabs open automatically  
✅ Backend API shows "Now listening on: http://localhost:5050"  
✅ Back Office loads with navigation menu  
✅ Customer Website shows homepage with search form  
✅ Swagger UI displays all API endpoints  
✅ No error messages in any console  

---

## 🚨 **QUICK FIXES**

### **Port Already in Use**
```bash
# Kill processes on specific ports
npx kill-port 3000 3001 5050
```

### **Node Modules Issues**
```bash
npm run clean
npm install
npm run setup
```

### **Database Connection Issues**
- Check SQL Server is running
- Verify connection string in `appsettings.json`
- Run: `dotnet ef database update`

---

## 🎯 **FINAL RESULT**

After running any startup method, you should have:

🔥 **Complete Tour Booking System Running**  
🔥 **All Three Applications Accessible**  
🔥 **Auto-Reload for Development**  
🔥 **Professional UI/UX Ready**  
🔥 **API Documentation Available**  
🔥 **Database Fully Migrated**  

### **🎊 CONGRATULATIONS! Your complete Sri Sai Senthil Tours system is now running!**

---

*For additional help, refer to `COMPLETE_SYSTEM_README.md` or check the individual application documentation.*
