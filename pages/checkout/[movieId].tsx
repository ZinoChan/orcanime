import React, { useState } from 'react'
import WithAuth from '../../components/WithAuth'

import { useRouter } from 'next/router'

import { auth, firestore } from '../../lib/firebase'

import { usePaymentInputs } from 'react-payment-inputs'

import toast from 'react-hot-toast'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const Checkout = () => {
    const router = useRouter()
    const { movieId } = router.query

    const {
        meta,
        getCardNumberProps,
        getExpiryDateProps,
        getCVCProps,
    } = usePaymentInputs()

    const [data, setData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    })

    const handleInputChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (meta.isTouched && !meta.error) {
            const uid = auth.currentUser.uid

            const movieRef = firestore
                .collection('movies')
                .where('id', '==', movieId)

            const getMovie = await movieRef.get()

            const movie = getMovie?.docs.map((doc) => doc.data())

            const userRef = firestore
                .collection('users')
                .doc(uid)
                .collection('user_movies')
                .doc()

            const userMovie = {
                id: movie[0].id,
                trailer: movie[0].trailer,
                img: movie[0].img,
                title: movie[0].title,
                genre: movie[0].genre,
            }

            movie && (await userRef.set(userMovie))

            toast((t) => (
                <div className="p-8 text-center">
                    <div className="rounded-full mx-auto bg-primary w-16 h-16 text-white flex items-center justify-center mb-6">
                        <FontAwesomeIcon icon={faCheck} className="text-2xl" />
                    </div>
                    <p className="text-2xl font-sans font-bold mb-6">
                        Payment Successfully Confiremed
                    </p>
                    <div className="flex space-x-6">
                        <Link href="/movies">
                            <a className="bg-primary text-white px-4 py-2 font-sans font-lg">
                                back to Movies
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="bg-theme text-white px-4 py-2 font-sans font-lg">
                                go to Dashboard
                            </a>
                        </Link>
                    </div>
                </div>
            ))
        } else {
            toast.error('Please enter valid info')
        }
    }

    return (
        <WithAuth>
            <section className="min-h-screen bg-theme flex items-center">
                <div className="max-w-screen-md w-full mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="border border-primary "
                    >
                        <div className="bg-primary text-center">
                            <h2 className="text-2xl font-poppins font-bold text-white py-4">
                                Payment Details
                            </h2>
                        </div>
                        <div className="p-6 flex flex-col space-y-4">
                            <label
                                htmlFor="Card Number"
                                className="font-sans text-white text-xl mb-2"
                            >
                                Card Number
                            </label>
                            <input
                                className="rounded text-white border border-gray-500 w-full p-2 bg-transparent mb-2"
                                {...getCardNumberProps({
                                    onChange: handleInputChange,
                                })}
                                value={data.cardNumber}
                            />
                            {meta.touchedInputs.cardNumber &&
                                meta.erroredInputs.cardNumber && (
                                    <span className="text-primary font-sans text-lg mb-2">
                                        {meta.erroredInputs.cardNumber}
                                    </span>
                                )}
                            <label
                                htmlFor="Card Number"
                                className="font-sans text-white text-xl mb-2"
                            >
                                Expirity Date
                            </label>
                            <input
                                className="rounded text-white border border-gray-500 w-full p-2 bg-transparent mb-2"
                                {...getExpiryDateProps({
                                    onChange: handleInputChange,
                                })}
                                value={data.expiryDate}
                            />
                            {meta.touchedInputs.expiryDate &&
                                meta.erroredInputs.expiryDate && (
                                    <span className="text-primary font-sans text-lg mb-2">
                                        {meta.erroredInputs.expiryDate}
                                    </span>
                                )}
                            <label
                                htmlFor="Cvc"
                                className="font-sans text-white text-xl mb-2"
                            >
                                Cvc Number
                            </label>
                            <input
                                className="rounded text-white border border-gray-500 w-full p-2 bg-transparent"
                                {...getCVCProps({
                                    onChange: handleInputChange,
                                })}
                                value={data.cvc}
                            />
                            {meta.touchedInputs.cvc &&
                                meta.erroredInputs.cvc && (
                                    <span className="text-primary font-sans text-lg">
                                        {meta.erroredInputs.cvc}
                                    </span>
                                )}
                            <button
                                type="submit"
                                className="disabled:cursor-not-allowed bg-primary text-white font-sans px-6 py-2 mt-6 rounded self-center"
                                disabled={meta.isTouched && meta.error}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </WithAuth>
    )
}

export default Checkout
