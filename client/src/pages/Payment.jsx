import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, SignInButton } from '@clerk/clerk-react'
import { createBooking } from '../utils/api'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getToken, isSignedIn, isLoaded } = useAuth()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('debit-card')

  // Get booking data from navigation state (fallback safe shape)
  const bookingData = location.state || {
    room: null,
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalPrice: 0,
    nights: 1,
  }

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Redirect if no booking data
    if (!bookingData?.room) {
      // Don't redirect when auth isn't loaded yet to avoid flicker
      if (isLoaded) {
        navigate('/rooms')
      }
    }
  }, [bookingData?.room, isLoaded, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : v
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }))
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }))
    }
  }

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setPaymentData((prev) => ({
      ...prev,
      expiryDate: formatted,
    }))
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (paymentMethod === 'debit-card') {
      // Card number: strictly 16 digits
      const cardDigits = paymentData.cardNumber.replace(/\s/g, '')
      if (!/^\d{16}$/.test(cardDigits)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number'
      }

      // Expiry date
      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required'
      } else {
        const [monthStr, yearStr] = paymentData.expiryDate.split('/')
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1
        const month = parseInt(monthStr, 10)
        const year = parseInt(yearStr, 10)
        if (
          Number.isNaN(month) ||
          Number.isNaN(year) ||
          month < 1 ||
          month > 12 ||
          (yearStr || '').length !== 2
        ) {
          newErrors.expiryDate = 'Invalid expiry date'
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = 'Card has expired'
        }
      }

      // CVV: 3-4 digits
      if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits'
      }

      // Cardholder name
      if (!paymentData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required'
      }
    } else if (paymentMethod === 'upi') {
      // Simple UPI validation
      if (!paymentData.upiId || !paymentData.upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., yourname@upi)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Safely convert to ISO; null if invalid
  const toSafeISOString = (value) => {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d.toISOString()
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const checkInISO = toSafeISOString(bookingData.checkInDate)
    const checkOutISO = toSafeISOString(bookingData.checkOutDate)
    if (!checkInISO || !checkOutISO) {
      setPaymentError('Invalid check-in or check-out date. Please go back and select dates again.')
      return
    }
    if (new Date(checkOutISO) <= new Date(checkInISO)) {
      setPaymentError('Check-out date must be after check-in date.')
      return
    }

    if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
      setPaymentError('No internet connection. Please check your network and try again.')
      return
    }

    if (!isLoaded || !isSignedIn) {
      setPaymentError('You must be signed in to complete payment.')
      return
    }

    setIsProcessing(true)
    setPaymentError('')

    try {
      const token = await getToken({ skipCache: true })
      if (!token) {
        setPaymentError('You must be signed in to complete payment.')
        setIsProcessing(false)
        return
      }

      const roomId = bookingData?.room?._id || bookingData?.room?.id
      if (!roomId) {
        setPaymentError('Invalid room information. Please reselect the room and try again.')
        setIsProcessing(false)
        return
      }

      const bookingPayload = {
        room: roomId,
        checkInDate: checkInISO,
        checkOutDate: checkOutISO,
        guests: Number(bookingData.guests) || 1,
        specialRequests: '',
      }

      const bookingResponse = await createBooking(bookingPayload, token)

      if (bookingResponse && bookingResponse.success) {
        navigate('/booking-confirmation', {
          state: {
            bookingData,
            paymentData: { ...paymentData, transactionId: 'TXN' + Date.now() },
            booking: bookingResponse.booking,
          },
        })
      } else {
        const respMsg =
          bookingResponse?.message ||
          bookingResponse?.error ||
          (Array.isArray(bookingResponse?.errors) ? bookingResponse.errors.join(', ') : null)
        setPaymentError(respMsg ? `Booking failed: ${respMsg}` : 'Booking creation failed. Please try again.')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      if (error?.name === 'TypeError' && /Failed to fetch/i.test(error?.message || '')) {
        setPaymentError(
          'Network error: Unable to reach the server. Possible causes: CORS not enabled on API, invalid API URL, or HTTP/HTTPS mismatch. Please try again.'
        )
        setIsProcessing(false)
        return
      }
      const apiMsg = error?.response?.data?.message || error?.message
      setPaymentError(apiMsg ? `Payment failed: ${apiMsg}` : 'An error occurred during payment processing. Please try again.')
      setIsProcessing(false)
    }
  }

  // Auth loading screen
  if (!isLoaded) {
    return <div className='py-28 px-4 text-center'>Loading authentication...</div>
  }

  // Auth gate screen
  if (isLoaded && !isSignedIn) {
    return (
      <div className='min-h-screen py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white shadow-lg rounded-xl p-8 ring-1 ring-gray-200/60 text-center'>
            <h1 className='text-2xl md:text-3xl font-semibold text-gray-900 mb-4'>Sign in to complete your booking</h1>
            <p className='text-gray-600 mb-6'>For security, you need to sign in before proceeding to payment.</p>
            <div className='flex items-center justify-center gap-4'>
              <SignInButton mode='modal'>
                <button
                  type='button'
                  className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition'
                >
                  Sign in to continue
                </button>
              </SignInButton>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-300 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition'
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no booking data (after auth), show basic loading then redirect will have happened
  if (!bookingData?.room) {
    return <div className='py-28 px-4 text-center'>Loading...</div>
  }

  // Extract safe values for display
  const roomImage = bookingData?.room?.images?.[0] || 'https://via.placeholder.com/150x150.png?text=Room'
  const hotelName = bookingData?.room?.hotel?.name || 'Hotel'
  const roomType = bookingData?.room?.roomType || 'Room'
  const hotelAddress = bookingData?.room?.hotel?.address || ''

  return (
    <div className='min-h-screen py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold tracking-tight text-gray-900 mb-12'>Complete Your Booking</h1>

        <div className='grid lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10'>
          {/* Booking Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white/95 backdrop-blur-sm shadow-md md:shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 md:p-7 sticky top-24 md:top-8 border border-gray-100 ring-1 ring-gray-200/60'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Booking Summary</h2>

              <div className='space-y-5'>
                <div className='flex items-start gap-3'>
                  <img src={roomImage} alt='Room' className='w-16 h-16 rounded-lg object-cover' />
                  <div>
                    <h3 className='font-medium'>{hotelName}</h3>
                    <p className='text-sm text-gray-600'>{roomType}</p>
                    {hotelAddress ? <p className='text-sm text-gray-500'>{hotelAddress}</p> : null}
                  </div>
                </div>

                <div className='border-t border-gray-100 pt-4 space-y-2'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Check-in:</span>
                    <span>{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Check-out:</span>
                    <span>{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Guests:</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Nights:</span>
                    <span>{bookingData.nights}</span>
                  </div>
                </div>

                <div className='border-t border-gray-100 pt-4'>
                  <div className='flex justify-between font-semibold text-lg text-gray-900'>
                    <span>Total:</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className='lg:col-span-2'>
            <form onSubmit={handlePayment} className='bg-white/95 backdrop-blur-sm shadow-md md:shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 md:p-8 border border-gray-100 ring-1 ring-gray-200/60'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Payment Information</h2>

              {paymentError && (
                <div className='mb-6 p-4 flex gap-3 items-start bg-red-50 border border-red-200 rounded-lg text-red-800 ring-1 ring-red-100'>
                  <span className='text-red-600 mt-0.5'>⚠️</span>
                  <p className='text-sm leading-5'>{paymentError}</p>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className='mb-8'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>Select Payment Method</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6'>
                  <button
                    type='button'
                    onClick={() => setPaymentMethod('debit-card')}
                    className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white bg-white ${
                      paymentMethod === 'debit-card'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='text-2xl mb-2'>💳</div>
                    <div className='text-sm font-medium'>Debit Card</div>
                  </button>
                  <button
                    type='button'
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white bg-white ${
                      paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className='text-2xl mb-2'>📱</div>
                    <div className='text-sm font-medium'>UPI</div>
                  </button>
                </div>
              </div>

              {/* Debit Card Information */}
              {paymentMethod === 'debit-card' && (
                <div className='mb-8'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>Debit Card Information</h3>
                  <div className='grid md:grid-cols-2 gap-4 md:gap-5'>
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Card Number
                      </label>
                      <input
                        type='text'
                        name='cardNumber'
                        value={paymentData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder='1234 5678 9012 3456'
                        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white hover:border-gray-400 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength='19'
                      />
                      {errors.cardNumber && (
                        <p className='text-red-500 text-sm mt-1'>{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Expiry Date
                      </label>
                      <input
                        type='text'
                        name='expiryDate'
                        value={paymentData.expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder='MM/YY'
                        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white hover:border-gray-400 ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength='5'
                      />
                      {errors.expiryDate && (
                        <p className='text-red-500 text-sm mt-1'>{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        CVV
                      </label>
                      <input
                        type='text'
                        name='cvv'
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        placeholder='123'
                        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white hover:border-gray-400 ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength='4'
                      />
                      {errors.cvv && <p className='text-red-500 text-sm mt-1'>{errors.cvv}</p>}
                    </div>

                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Cardholder Name
                      </label>
                      <input
                        type='text'
                        name='cardholderName'
                        value={paymentData.cardholderName}
                        onChange={handleInputChange}
                        placeholder='John Doe'
                        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white hover:border-gray-400 ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cardholderName && (
                        <p className='text-red-500 text-sm mt-1'>{errors.cardholderName}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div className='mb-8'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>UPI Payment</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        UPI ID
                      </label>
                      <input
                        type='text'
                        name='upiId'
                        value={paymentData.upiId}
                        onChange={handleInputChange}
                        placeholder='yourname@upi'
                        className={`w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white hover:border-gray-400 ${
                          errors.upiId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.upiId && <p className='text-red-500 text-sm mt-1'>{errors.upiId}</p>}
                    </div>
                    <div className='bg-blue-50 border border-blue-100 p-4 rounded-lg'>
                      <p className='text-sm text-blue-800'>
                        💡 <strong>How to pay:</strong> Enter your UPI ID and click "Pay Now". You'll receive a payment request on your UPI app.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-300 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition'
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay $${bookingData.totalPrice}`
                  )}
                </button>
              </div>

              <p className='text-xs text-gray-500 mt-4 text-center'>
                Your payment information is secure and encrypted.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
