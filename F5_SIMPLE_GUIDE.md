# 🚀 Simple F5 Guide - Launch Everything

## ✨ **PRESS F5 TO LAUNCH EVERYTHING**

### **In Visual Studio Code:**
1. Open the project folder in VS Code
2. Press `F5` (or go to Run → Start Debugging)
3. Select "🚀 F5 - Launch Everything (API + BackOffice + Customer)"
4. **Everything starts automatically!**

---

## 🌐 **What Opens Automatically**

When you press F5, these applications will start:

| Application | URL | Purpose |
|-------------|-----|---------|
| **Backend API** | http://localhost:5050 | REST API |
| **Swagger Docs** | http://localhost:5050/swagger | API Testing |
| **Back Office** | http://localhost:3001 | Admin System |
| **Customer Website** | http://localhost:3000 | Public Booking |

**After 15 seconds, all URLs will open automatically in your browser!**

---

## 🎯 **Alternative Methods**

If F5 doesn't work, you can also use:

### **Terminal Command:**
```bash
npm start
```

### **VS Code Command Palette:**
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "start-all-applications"

---

## 🔧 **What You'll See**

### **In VS Code Terminal:**
- 🔵 **API** logs in blue
- 🟢 **BackOffice** logs in green  
- 🟡 **Customer** logs in yellow

### **In Your Browser:**
- **Swagger UI** for API testing
- **Admin Dashboard** for back office
- **Customer Website** for public booking

---

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ VS Code terminal shows colored output for all 3 apps
- ✅ Browser opens 3 tabs automatically
- ✅ All applications load without errors
- ✅ You can navigate between all systems

---

## 🛑 **To Stop Everything**

- Press `Ctrl+C` in the VS Code terminal
- Or close the VS Code terminal tab

---

## 🎉 **That's It!**

**Just press F5 and everything launches automatically!**

No complex setup, no multiple commands - just one F5 press and your complete Sri Sai Senthil Tours system is ready to use.

**Happy coding! 🚀**
