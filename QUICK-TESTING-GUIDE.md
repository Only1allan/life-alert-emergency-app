# 🚨 QUICK TESTING GUIDE - Life Alert AI Emergency System

## 🚀 **IMMEDIATE TESTING STEPS**

Your app is running at: **http://localhost:3000**

---

## 1️⃣ **FIRST - Environment Variables Setup**

Create `.env.local` file in your project root with:

```bash
# Storyblok (Required)
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_storyblok_preview_token

# VAPI (Required for AI calls)
VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id

# Twilio (Required for SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ CRITICAL:** Without these environment variables, the system won't work!

---

## 2️⃣ **TEST YOUR STORYBLOK DATA**

### **Quick Storyblok Test:**
1. Go to http://localhost:3000/dashboard
2. You should see:
   - ✅ User profile data (Mary Johnson)
   - ✅ Emergency contacts list
   - ✅ Hospital information
   - ✅ Emergency logs (if any)

### **If you see "Loading..." or errors:**
- Check your Storyblok access token
- Verify your Storyblok space has the content types
- Check browser console for API errors

---

## 3️⃣ **TEST THE PANIC BUTTON (WITHOUT VAPI FIRST)**

### **Basic Panic Button Test:**
1. Go to http://localhost:3000/dashboard
2. Find the large red **EMERGENCY** button
3. Click and hold for 3 seconds
4. **Expected behavior:**
   - Countdown from 3 to 0
   - Location services activate
   - VAPI call interface appears (even if VAPI isn't configured yet)

### **What to check:**
- ✅ Button countdown works
- ✅ Location permission requested
- ✅ Emergency interface appears
- ✅ Console shows emergency data preparation

---

## 4️⃣ **TEST INDIVIDUAL COMPONENTS**

### **Test Location Services:**
```bash
# Open browser console and run:
navigator.geolocation.getCurrentPosition(
  (pos) => console.log('Location:', pos.coords),
  (err) => console.log('Location error:', err)
);
```

### **Test Storyblok API:**
```bash
# Visit these URLs directly:
http://localhost:3000/api/profile
http://localhost:3000/api/emergency-contacts
```

### **Test SMS API (if Twilio configured):**
```bash
# Test SMS endpoint:
curl -X POST http://localhost:3000/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{"to":"+1234567890","body":"Test message"}'
```

---

## 5️⃣ **FULL VAPI TESTING (Once Configured)**

### **Setup VAPI Assistant:**
1. Go to https://dashboard.vapi.ai
2. Create new assistant
3. Upload your prompt from `vapi-emergency-agent-prompt.md`
4. Configure phone number
5. Set webhook URL to: `http://localhost:3000/api/vapi/webhook`

### **Test Emergency Scenarios:**

#### **SCENARIO 1: Medical Emergency**
1. Press panic button
2. When AI agent answers, say:
   - *"I'm having chest pain, it's about an 8 out of 10"*
3. **Expected AI Response:**
   - References your medical conditions
   - Decides to call 911
   - Sends SMS to emergency contacts

#### **SCENARIO 2: False Alarm**
1. Press panic button  
2. When AI agent answers, say:
   - *"Sorry, I pressed this by accident, I'm fine"*
3. **Expected AI Response:**
   - Confirms false alarm
   - Cancels emergency response
   - Logs incident

#### **SCENARIO 3: Moderate Emergency**
1. Press panic button
2. When AI agent answers, say:
   - *"I fell and hurt my hip, maybe a 6 out of 10"*
3. **Expected AI Response:**
   - Suggests hospital visit
   - Contacts emergency contacts
   - Provides hospital options

---

## 6️⃣ **TESTING WITHOUT FULL SETUP**

### **Demo Mode Testing:**
If you don't have all APIs configured, you can still test:

1. **Dashboard Data:** Should load from Storyblok
2. **Panic Button:** Should show countdown and interface
3. **Location Services:** Should request permission
4. **Console Logging:** Check browser console for emergency data
5. **UI Flow:** Complete emergency interface should appear

### **What You'll See in Console:**
```
🚨 PANIC BUTTON PRESSED - STARTING COUNTDOWN
🚨 EMERGENCY TRIGGERED - INITIATING VAPI CALL
📊 EMERGENCY DATA PREPARED FOR VAPI: {user data...}
```

---

## 7️⃣ **QUICK DEBUGGING CHECKLIST**

### **Common Issues:**

#### **"Loading..." stuck on dashboard:**
- ❌ Storyblok token missing/invalid
- ❌ Storyblok content not published
- ❌ Network/CORS issues

#### **Panic button not working:**
- ❌ JavaScript errors in console
- ❌ Location permission denied
- ❌ Component import issues

#### **VAPI call fails:**
- ❌ VAPI API key missing
- ❌ Assistant ID incorrect
- ❌ Webhook URL not accessible

#### **SMS not sending:**
- ❌ Twilio credentials missing
- ❌ Phone number format incorrect
- ❌ Twilio account not funded

---

## 8️⃣ **TESTING COMMANDS**

### **Run these in your terminal:**

```bash
# Check if app builds
npm run build

# Check for linting errors
npm run lint

# Test API endpoints
curl http://localhost:3000/api/profile
curl http://localhost:3000/api/emergency-contacts

# Check environment variables (don't expose secrets!)
echo $NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN | head -c 10
```

---

## 9️⃣ **BROWSER TESTING STEPS**

### **Step-by-Step Test:**

1. **Open http://localhost:3000**
   - ✅ Homepage loads
   - ✅ Navigation works

2. **Go to Dashboard**
   - ✅ User profile displays
   - ✅ Emergency contacts show
   - ✅ Hospital info visible
   - ✅ System status indicators work

3. **Test Panic Button**
   - ✅ Button is prominent and clickable
   - ✅ Countdown works (3-2-1)
   - ✅ Location permission requested
   - ✅ Emergency interface appears

4. **Check Browser Console**
   - ✅ No JavaScript errors
   - ✅ Emergency data logged
   - ✅ API calls successful

5. **Test Mobile View**
   - ✅ Responsive design
   - ✅ Panic button easy to press
   - ✅ Text readable

---

## 🔟 **DEMO PREPARATION TESTING**

### **Perfect Demo Flow:**
1. **Setup** (Show dashboard with real data)
2. **Trigger** (Press panic button, show countdown)
3. **AI Call** (Demonstrate VAPI conversation)
4. **Response** (Show SMS sent, decision made)
5. **Completion** (Show emergency logged)

### **Practice Scenarios:**
Use the detailed scenarios in `VAPI-TESTING-SCENARIOS.md`:
- Medical emergency (severity 8)
- False alarm detection
- Away from home emergency
- Multiple contact notification

---

## ⚠️ **SAFETY REMINDERS**

### **NEVER during testing:**
- ❌ Call real 911
- ❌ Use real emergency contact numbers without permission
- ❌ Send SMS to strangers
- ❌ Cause actual emergency responses

### **ALWAYS during testing:**
- ✅ Use test phone numbers
- ✅ Use demo/sandbox modes
- ✅ Inform people it's a test
- ✅ Have clear "DEMO MODE" indicators

---

## 🎯 **QUICK SUCCESS CHECKLIST**

**Minimum Working Demo:**
- [ ] Dashboard loads with Storyblok data
- [ ] Panic button countdown works
- [ ] Location services activate
- [ ] Emergency interface appears
- [ ] Console shows complete emergency data
- [ ] No critical JavaScript errors

**Full Working System:**
- [ ] VAPI AI agent responds to calls
- [ ] SMS notifications send successfully
- [ ] Hospital finder works
- [ ] Emergency logging to Storyblok
- [ ] Complete end-to-end emergency flow

---

## 🚀 **START TESTING NOW!**

1. **Verify .env.local has your API keys**
2. **Go to http://localhost:3000/dashboard**
3. **Press the panic button**
4. **Check browser console for logs**
5. **Follow the emergency flow**

**If you get stuck, check:**
- Browser console for errors
- Network tab for failed API calls
- Terminal for server errors
- Environment variables are set correctly

**Remember:** Even without full API setup, you can demonstrate the UI flow, data integration, and emergency logic!

**GO TEST YOUR LIFE-SAVING SYSTEM! 🚨🧪**
