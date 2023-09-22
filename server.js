// part1 hosted connect custom onboarding

const express = require('express');
const stripe = require('stripe')('sk_test_51HMxduGP8QfSuB6Uvs3fpETOuEreItJTs57BkTA6Olk5cEDfcxHziz0P6CK8M1dIKZ8QftlgSSb8OCqlIFZ8sdo600vinbWqcP');
const cors = require('cors');
const app = express();

app.use(cors());
app.post('/', async () => {
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price: 'price_1NsMn1SHm2r7V8v9bFdvQZmO',
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: 123,
          transfer_data: {
            destination: '{{CONNECTED_ACCOUNT_ID}}',
          },
        },
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });
   console.log({ session });

});



app.post('/create-account-link', async (req, res) => {
    // const { email, redirectUrl } = req.body || {};
  // console.log({email})
  // const customer = await stripe.createCustomer(name, email);
  const accountTest = await stripe.accounts.create({
    type: 'express',
    email: 'sajjadalam3577@gmail.com'
  });
  console.log({ accountTest });
  try {
      
      const accountLink = await stripe.accountLinks.create({
        account: accountTest.id, // Your platform's Stripe account ID
        refresh_url: 'http://localhost:3001/onboarding-success',
        return_url: 'http://localhost:3001/onboarding-success',
        type: 'account_onboarding',
      });
     console.log({accountLink})
      res.json({ success: true, url: accountLink.url, accountTest });
  } catch (error) {
     console.log([error])
      res.json({ success: false, error: error.message });
    }
});

app.post('/payment', async (req, res) => {
   const fee = Math.ceil(10000 * 0.15); // Calculate the 15% fee
  //  const transferAmount = candidateSalary - fee; // Calculate the amount to transfer to the candidate
  // Charge the recruiter's account
  try{
   const session = await stripe.checkout.sessions.create({
     mode: 'payment',
     line_items: [
       {
         price: 'price_1Nt7JKGP8QfSuB6UXYh4r8lh',
         quantity: 1,
       },
     ],
     payment_intent_data: {
       application_fee_amount: 100,
       transfer_data: {
         destination: 'acct_1Nt7BC4PPIM3kd3Y',
       },
     },
     success_url: 'https://example.com/success',
     cancel_url: 'https://example.com/cancel',
   });
   console.log({session})
    return res.json({ sessionID:  session.id }); 
 } catch (error) {
   console.error(error);
   throw error;
 }
})
  

app.listen(3000, () => {
      console.log('server is running on the port ', 3000);
})
  