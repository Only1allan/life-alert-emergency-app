# 🏗️ Storyblok Setup Guide - Life guardpro Emergency System

## 🎯 **How to See Your Emergency Data in Storyblok**

### **Step 1: Access Your Storyblok Space**
1. Go to [app.storyblok.com](https://app.storyblok.com)
2. Log in to your account
3. Select your Life guardpro project space

### **Step 2: Create Content Types (Blocks)**

#### **A. Emergency Log Content Type**
1. Go to **Settings** → **Block Library**
2. Click **"Create new block"**
3. Name: `emergency_log`
4. Add these fields:

```
📋 Emergency Log (emergency_log)
├── emergency_id (Text) - "Emergency ID"
├── user_id (Text) - "User ID" 
├── emergency_type (Text) - "Emergency Type"
├── severity_level (Number) - "Severity Level (1-10)"
├── status (Text) - "Status"
├── timestamp (Date) - "Emergency Timestamp"
├── response_time_seconds (Number) - "Response Time (seconds)"
├── call_duration (Number) - "Call Duration (seconds)"
├── location_latitude (Number) - "Location Latitude"
├── location_longitude (Number) - "Location Longitude"
├── location_address (Text) - "Location Address"
├── ai_transcript (Textarea) - "AI Conversation Transcript"
├── ai_decision (Text) - "AI Decision"
├── agent_summary (Text) - "Agent Summary"
├── actions_taken (Text) - "Actions Taken"
├── outcome_status (Text) - "Outcome Status"
└── created_at (Date) - "Created At"
```

#### **B. Emergency Contact Content Type**
1. Create new block: `emergency_contact`
2. Add these fields:

```
📞 Emergency Contact (emergency_contact)
├── contact_name (Text) - "Contact Name"
├── email (Text) - "Email Address"
├── phone_number (Text) - "Phone Number"
├── relationship (Text) - "Relationship"
├── is_primary (Boolean) - "Is Primary Contact"
├── priority_order (Number) - "Priority Order"
├── preferred_contact_method (Text) - "Preferred Method"
├── medical_proxy (Boolean) - "Medical Proxy"
├── available_hours (Text) - "Available Hours"
├── user_id (Text) - "User ID"
└── contact_success_rate (Number) - "Success Rate %"
```

#### **C. Emergency Notification Content Type**
1. Create new block: `emergency_notification`
2. Add these fields:

```
🔔 Emergency Notification (emergency_notification)
├── contact_name (Text) - "Contact Name"
├── contact_email (Text) - "Contact Email"
├── contact_phone (Text) - "Contact Phone"
├── relationship (Text) - "Relationship"
├── emergency_type (Text) - "Emergency Type"
├── severity (Number) - "Severity Level"
├── notification_status (Text) - "Notification Status"
├── sent_at (Date) - "Sent At"
├── emergency_timestamp (Date) - "Emergency Time"
└── storyblok_log_reference (Number) - "Emergency Log ID"
```

### **Step 3: Create Test Content**

#### **A. Create Emergency Contacts**
1. Go to **Content** → **Stories**
2. Click **"Create new story"**
3. Select **"Emergency Contact"**
4. Create these test contacts:

**Primary Contact:**
- Name: "John Doe"
- Email: "john.doe@example.com"
- Phone: "+1-555-0123"
- Relationship: "Spouse"
- Is Primary: ✅ Yes
- Priority Order: 1

**Secondary Contact:**
- Name: "Jane Smith" 
- Email: "jane.smith@example.com"
- Phone: "+1-555-0456"
- Relationship: "Daughter"
- Is Primary: ❌ No
- Priority Order: 2

#### **B. Create Test Emergency Log**
1. Create new story: **"Emergency Log"**
2. Fill in sample data:

```
Emergency ID: emergency-1695456600000
User ID: test-user
Emergency Type: panic_button
Severity Level: 7
Status: resolved
Timestamp: [Current date/time]
Response Time: 180
Location Address: 123 Main St, New York, NY
AI Decision: Contact preferred hospital
Agent Summary: Emergency severity 7/10. AI recommended: Contact preferred hospital
Actions Taken: AI emergency assessment completed, Emergency contacts to be notified
Outcome Status: Resolved successfully
```

### **Step 4: Configure Environment Variables**

Add to your `.env.local`:

```bash
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_SPACE_ID=your_space_id_here

# Management API (for creating content)
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here

# Base URL for webhooks
NEXT_PUBLIC_BASE_URL=http://localhost:3004
```

**How to get these tokens:**
1. **Preview Token**: Settings → Access Tokens → Copy "Preview token"
2. **Space ID**: Settings → General → Copy "Space ID" 
3. **Management Token**: Settings → Access Tokens → Create new "Management token"

### **Step 5: Test the Integration**

#### **A. Test Emergency Logging**
1. Go to `http://localhost:3004/dashboard`
2. Press the **PANIC BUTTON**
3. Complete VAPI conversation
4. Click **"Complete & Log Emergency"**
5. Check browser console for:
   ```
   📝 Logging emergency to Storyblok...
   ✅ Emergency logged to Storyblok: emergency-1695456600000
   ```

#### **B. View Data in Storyblok**
1. Go to **Content** → **Stories** in Storyblok
2. Look for new emergency log entries
3. Click on any emergency log to see the full data
4. Check the **Emergency Log Viewer** on your dashboard

#### **C. Test Notifications**
1. Check browser console for notification logs:
   ```
   📧 Sending emergency notifications...
   ✅ Emergency notifications sent successfully
   ```

### **Step 6: Set Up Webhooks (Optional)**

#### **A. Configure Webhook in Storyblok**
1. Go to **Settings** → **Webhooks**
2. Click **"Create new webhook"**
3. URL: `https://yourdomain.com/api/storyblok/webhook`
4. Events: Select "Story published", "Story unpublished"
5. Save webhook

#### **B. Test Webhook**
1. Create/edit an emergency log in Storyblok
2. Publish the story
3. Check your server logs for webhook processing

---

## 🔍 **Where to Find Your Data in Storyblok**

### **1. Emergency Logs**
- **Location**: Content → Stories
- **Filter**: Look for stories with component "emergency_log"
- **Data**: Complete emergency incident records with AI transcripts

### **2. Emergency Contacts**
- **Location**: Content → Stories  
- **Filter**: Look for stories with component "emergency_contact"
- **Data**: Contact information and notification preferences

### **3. Emergency Notifications**
- **Location**: Content → Stories
- **Filter**: Look for stories with component "emergency_notification" 
- **Data**: Notification delivery logs and status

### **4. API Data Access**
You can also access data via API:

```bash
# Get emergency logs
curl "https://api.storyblok.com/v2/cdn/stories?token=YOUR_TOKEN&filter_query[component][eq]=emergency_log"

# Get emergency contacts  
curl "https://api.storyblok.com/v2/cdn/stories?token=YOUR_TOKEN&filter_query[component][eq]=emergency_contact"
```

---

## 🚨 **Troubleshooting**

### **Problem: No data showing in dashboard**
**Solution**: 
1. Check if Storyblok tokens are correct in `.env.local`
2. Verify content types are created in Storyblok
3. Check browser console for API errors
4. Ensure emergency logs are published in Storyblok

### **Problem: Emergency logging fails**
**Solution**:
1. Check Management API token permissions
2. Verify space ID is correct
3. Check server logs for Storyblok API errors
4. Ensure content types have correct field names

### **Problem: Notifications not sending**
**Solution**:
1. Check emergency contacts exist in Storyblok
2. Verify contact email/phone fields are populated
3. Check notification API logs in console
4. Test with mock data first

---

## 🎯 **Current Status Check**

### **✅ What Should Work:**
- Emergency logs appear in Storyblok after panic button use
- Dashboard shows emergency history from Storyblok
- Notifications are sent to emergency contacts
- All data is properly structured in Storyblok

### **🔧 What to Verify:**
1. **Content Types Created**: emergency_log, emergency_contact, emergency_notification
2. **Test Data Added**: At least one emergency contact and one emergency log
3. **Environment Variables**: All Storyblok tokens configured
4. **API Endpoints**: All working without errors

---

## 🏆 **Hackathon Demo Flow**

### **1. Show Storyblok Content Management**
- Navigate to Storyblok dashboard
- Show emergency logs being created in real-time
- Demonstrate content type structure
- Show emergency contact management

### **2. Demonstrate Real-time Integration**
- Press panic button on dashboard
- Show emergency log being created in Storyblok
- Show notification being sent to contacts
- Show emergency history updating

### **3. Highlight Advanced Features**
- Webhook-triggered actions
- AI-generated content in Storyblok
- Real-time dashboard updates
- Professional notification system

**Your Life guardpro system now showcases Storyblok's full potential for mission-critical applications!** 🚀




