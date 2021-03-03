import React, { useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import MovieCard from '../../components/ui/MovieCard'
import ReactPlayer from 'react-player'

import WithAuth from '../../components/WithAuth'

import { auth, firestore } from '../../lib/firebase'

const UserDashboard = () => {
    const userMoviesRef = firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('user_movies')

    const [moviesCollection, loading] = useCollectionOnce(userMoviesRef)

    const userMovies = moviesCollection?.docs.map((doc) => doc.data())

    const [currentPlayer, setCurrentPlayer] = useState('')
    const [isOpen, setOpen] = useState(false)

    const onPlayClick = (url) => {
        setCurrentPlayer(url)
        setOpen(true)
    }

    return (
        <WithAuth>
            <section className="min-h-screen bg-theme flex items-center justify-items-start py-20">
                <div className="max-w-screen-2xl mx-auto w-full">
                    <div>
                        <h2 className="text-white font-poppins font-bold text-5xl mb-12">
                            My Movies :
                        </h2>
                        <div className="flex space-x-12">
                            {loading && (
                                <p className="text-white">Loading...</p>
                            )}
                            {!loading &&
                                userMovies?.map((movie) => (
                                    <>
                                        <div className="relative">
                                            <MovieCard
                                                key={movie.id}
                                                img={movie.img}
                                                title={movie.title}
                                                genre={movie.genre}
                                            />
                                            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        onPlayClick(
                                                            movie.trailer
                                                        )
                                                    }
                                                    className="py-2 px-6 rounded bg-primary text-white font-sans font-bold text-2xl"
                                                >
                                                    Watch
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ))}
                        </div>
                    </div>
                </div>
                {currentPlayer && isOpen && (
                    <div
                        className={`fixed top-0 left-0 z-30 w-screen bg-primary flex flex-col px-6 py-4 h-screen `}
                    >
                        <button
                            className="bg-white text-gray-800 font-bold font-sans py-1 px-2 self-end rounded my-2 "
                            onClick={() => setOpen(!isOpen)}
                        >
                            X
                        </button>
                        <div className="border border-white rounded w-full h-full">
                            <ReactPlayer
                                width={'100%'}
                                height={'100%'}
                                url={currentPlayer}
                            />
                        </div>
                    </div>
                )}
            </section>
        </WithAuth>
    )
}

export default UserDashboard