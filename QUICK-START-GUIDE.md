# 🚀 Life guardpro - Quick Start Guide

## ⚡ **One-Click Setup for Storyblok Integration**

### **Step 1: Configure Environment Variables**

Add these to your `.env.local` file:

```bash
# Storyblok Configuration (Required)
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_SPACE_ID=your_space_id_here
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here

# VAPI Configuration (Required)
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3004
```

**How to get Storyblok tokens:**
1. Go to [app.storyblok.com](https://app.storyblok.com)
2. **Preview Token**: Settings → Access Tokens → Copy "Preview token"
3. **Space ID**: Settings → General → Copy "Space ID"
4. **Management Token**: Settings → Access Tokens → Create new "Management token"

### **Step 2: Automatic Storyblok Setup**

1. Go to `http://localhost:3004/dashboard`
2. Click **"🏗️ Setup Storyblok"** button
3. Wait for the setup to complete
4. Check your Storyblok space - you'll see:
   - ✅ **4 Content Types** created automatically
   - ✅ **3 Emergency Contacts** with sample data
   - ✅ **3 Message Templates** for different severity levels

### **Step 3: Test the System**

1. Click **"🧪 Create Test Emergency"** to generate sample data
2. Press the **red PANIC BUTTON** to test the full workflow
3. Complete the VAPI conversation
4. Click **"Complete & Log Emergency"**
5. Watch the emergency appear in your dashboard and Storyblok!

---

## 🏗️ **What Gets Created Automatically**

### **Content Types in Storyblok:**

#### **1. Emergency Log** (`emergency_log`)
- Complete emergency incident records
- AI conversation transcripts
- Location data, severity levels, timestamps
- Actions taken and outcomes

#### **2. Emergency Contact** (`emergency_contact`)
- Contact information and preferences
- Priority ordering for notifications
- Medical proxy settings
- Success rate tracking

#### **3. Emergency Notification** (`emergency_notification`)
- Notification delivery logs
- Contact attempt tracking
- Status monitoring

#### **4. Message Template** (`message_template`)
- **Critical Emergency Email** (severity 8+)
- **Moderate Emergency Email** (severity 5-7)
- **SMS Emergency Template** (all severities)
- Professional HTML templates with variable substitution

### **Sample Data Created:**

#### **Emergency Contacts:**
- **John Doe** (Spouse, Primary Contact)
- **Jane Smith** (Daughter, Secondary Contact)  
- **Dr. Sarah Wilson** (Primary Care Physician)

#### **Message Templates:**
- **Critical Emergency**: Red styling, immediate action required
- **Moderate Emergency**: Orange styling, contact immediately
- **SMS Template**: Short, urgent message format

---

## 🎯 **How It Works**

### **Emergency Workflow:**
```
🔴 PANIC BUTTON PRESSED
    ↓
🤖 VAPI AI CONVERSATION
    ↓ (conversation data)
📝 AUTOMATIC STORYBLOK LOGGING
    ↓ (creates emergency_log story)
🔔 TEMPLATE-BASED NOTIFICATIONS
    ↓ (uses message_template stories)
📧 PROFESSIONAL EMAIL ALERTS
    ↓ (to emergency_contact stories)
👨‍👩‍👧‍👦 FAMILY NOTIFIED
```

### **Storyblok Integration Features:**
- ✅ **Automatic Content Creation** - No manual setup needed
- ✅ **Template-Based Messaging** - Professional, customizable emails
- ✅ **Real-time Data Sync** - Dashboard updates from Storyblok
- ✅ **Webhook Support** - Content changes trigger actions
- ✅ **Multi-Content Type Architecture** - Structured emergency data

---

## 🧪 **Testing the System**

### **Test 1: Setup Verification**
1. Click **"🏗️ Setup Storyblok"**
2. Check browser console for success messages
3. Verify content appears in Storyblok dashboard

### **Test 2: Emergency Logging**
1. Click **"🧪 Create Test Emergency"**
2. Check dashboard for new emergency log
3. Verify data appears in Storyblok

### **Test 3: Full Workflow**
1. Press **PANIC BUTTON**
2. Complete VAPI conversation
3. Click **"Complete & Log Emergency"**
4. Check Storyblok for new emergency log
5. Verify notification templates are used

---

## 🔧 **Troubleshooting**

### **Problem: Setup fails**
**Solution**: Check that all Storyblok tokens are correct in `.env.local`

### **Problem: No data in dashboard**
**Solution**: 
1. Ensure Storyblok setup completed successfully
2. Check browser console for API errors
3. Verify emergency contacts exist in Storyblok

### **Problem: VAPI not working**
**Solution**: 
1. Check VAPI API key is public key (not private)
2. Verify assistant ID is correct
3. Check VAPI account has proper permissions

---

## 🏆 **Hackathon Demo Flow**

### **1. Show Automatic Setup**
- Click "Setup Storyblok" button
- Show content types being created
- Demonstrate sample data generation

### **2. Demonstrate Emergency Workflow**
- Press panic button
- Show VAPI conversation
- Show emergency logging to Storyblok
- Show notification system using templates

### **3. Highlight Advanced Features**
- Real-time dashboard updates from Storyblok
- Professional email templates with variable substitution
- Multi-content type architecture
- Webhook-triggered actions

---

## 📊 **Current Status**

**✅ Ready for Demo:**
- Automatic Storyblok content type creation
- Sample emergency contacts and message templates
- VAPI integration with emergency logging
- Professional notification system
- Real-time dashboard with Storyblok data

**🎯 Next Steps:**
1. Configure your Storyblok tokens
2. Click "Setup Storyblok" button
3. Test the panic button workflow
4. Show the complete integration to judges!

---

**Your Life guardpro system now showcases the full power of Storyblok for mission-critical applications!** 🚀

*This demonstrates how a headless CMS can power emergency response systems with automatic content creation, template-based messaging, and real-time data synchronization.*



