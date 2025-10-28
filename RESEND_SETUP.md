# Resend Email Setup Instructions

## Quick Setup (5 minutes)

### 1. Create Resend Account
1. Go to https://resend.com
2. Click "Sign Up" (it's free!)
3. Verify your email

### 2. Get Your API Key
1. Once logged in, go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "Chiang Mai Tours Bookings"
4. Copy the API key (it starts with `re_...`)

### 3. Add API Key to Your Project
1. Open the file: `chiang-mai-tours/.env.local`
2. Replace `your_resend_api_key_here` with your actual API key
3. Save the file

**Example:**
```
RESEND_API_KEY=re_abc123xyz789_YourActualKeyHere
```

### 4. Restart Your Dev Server
```bash
cd chiang-mai-tours
bun run dev
```

## Important Notes

### Testing Domain
- Right now, emails are sent from `bookings@resend.dev` (Resend's test domain)
- This works fine for testing
- Later, you can verify your own domain to send from `bookings@chiangmaiprivatetours.com`

### Email Destination
- Currently set to: **travisbmiller@outlook.com**
- To change this, edit: `app/api/send-booking/route.ts` (line 13)

### Free Tier Limits
- 3,000 emails per month
- 100 emails per day
- More than enough for tour bookings!

### How It Works Now

When someone submits a booking request:

1. **Email is ALWAYS sent** to travisbmiller@outlook.com
2. **WhatsApp is ONLY opened** if the user said "Yes" to WhatsApp

## Testing

1. Go to your tour page
2. Click "Request Booking"
3. Fill out the form
4. **Try both scenarios:**
   - Set WhatsApp to "Yes" → Opens WhatsApp + Sends Email
   - Set WhatsApp to "No" → Only Sends Email

Check your inbox at travisbmiller@outlook.com for the booking notification!

## Troubleshooting

**"Error sending email"**
- Check that you copied the API key correctly
- Make sure there are no spaces before/after the key
- Restart your dev server

**"Email not arriving"**
- Check spam folder
- Verify the email address in the API route is correct
- Check Resend dashboard for delivery logs

## Next Steps

Once you're ready to go live:
1. Verify your domain in Resend
2. Change the "from" email in the API route
3. Change the "to" email to Chet's actual email
4. Deploy to production!

---

**Need help?** The Resend dashboard shows all sent emails and their status.
