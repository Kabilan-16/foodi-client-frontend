import { CardElement,useElements,useStripe} from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { FaPaypal } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({price,cart}) => {
  const stripe=useStripe();
  const elements=useElements();
  const {user}=useAuth()
  const axiosSecure=useAxiosSecure()
  const navigate=useNavigate()
  const [cartError,setCardError]=useState('')
  const [clientSecret, setClientSecret] = useState('');
   
   useEffect(()=>{
     if(typeof price!=='number'|| price<1)
     {
      console.log("price is not an number")
       return;
     }
      axiosSecure.post("/create-payment-intent",{price})
       .then(res=>{
      // console.log(res.data.clientSecret)
       setClientSecret(res.data.clientSecret)
       })
   },[price,axiosSecure])


  const handleSubmit = async (event)=>{
    event.preventDefault();
    if(!stripe||!elements)
    {
      return;
    }

    const card=elements.getElement(CardElement);
   // console.log(card)
    if(card==null)
    {
      return;
    }
      const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
      setCardError(error.message)
    } else {
      setCardError("success !")
     //console.log('[PaymentMethod]', paymentMethod);
    }

    const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
  clientSecret,
  {
    payment_method: {
      card: card,
      billing_details: {
        name: user?.displayName || 'anonymous',
        email:user?.email || 'unknown'
      },
    },
  },
);
if(confirmError)
{
   console.log(confirmError)
}
  console.log(paymentIntent)
  if(paymentIntent.status === "succeeded")
  {
    console.log(paymentIntent.id)
    setCardError(`Your TransactionId is ${paymentIntent.id}`)
   // console.log(`Your TransactionId is ${paymentIntent.id}`)
    // payment info data
    const paymentInfo={
      email:user.email,
      transitionId:paymentIntent.id,
      price,
      quantity:cart.length,
      status:"Order pending",
      itemName:cart.map(item=>item.name),
      cartItem:cart.map(item=>item._id),
      menuItem:cart.map(item=>item.menuItemId)

    }
    console.log(paymentInfo)

    //send information to backend
     axiosSecure.post('/payments',paymentInfo)   
      .then(res=>{
         console.log(res.data)
        alert("Payment Successful!");
        navigate('/order')        
      })
 
  }
  };
  return (
    <div className="flex flex-col sm:flex-row
             justify-start items-start gap-8 ">
      {/*left side */}
      <div className="md:w-1/3 w-full space-y-3">
          <h4 className="text-lg font-semibold">Order Summary</h4>
          <p>Total Price: ${price}</p>
          <p>Number of Items: {cart.length}</p>
      </div>
      {/*right side */}
      <div className="md:w-1/3 card space-y-5 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl px-4 py-8">
      <h4 className="text-lg font-semibold">Process your payment</h4>
      <h5 className="font-medium">Credit/Debit Card</h5>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <button className="btn btn-sm mt-5 btn-primary w-full text-white" type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
      {
        cartError?<p className="text-red italic text-sm">{cartError}</p>:""
      }
      {/*paypal*/}
      <div className="mt-5 txt-center">
        <hr/>

      <button className="btn btn-sm mt-5 bg-orange-500 text-white" type="submit">
          <FaPaypal/>Pay with Paypal
        </button>
      </div>
      </div>
    </div>
  )
}
//hiii this is data
export default CheckoutForm