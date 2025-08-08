"use client"

import { useEffect, useState } from 'react'

// Split-screen 3D Model Component with Food and Fitness
export default function FoodModel3D() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Split Screen Container */}
            <div className="flex w-full h-full">
                {/* Left Side - Fruits and Vegetables */}
                <div className="w-1/2 h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
                    {/* Marble surface effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-80"></div>

                    {/* Fruits and Vegetables Container */}
                    <div className="relative z-10 p-6 h-full">
                        {/* Top Row - Fruits */}
                        <div className="flex justify-between items-center mb-8">
                            {/* Apple */}
                            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-16 h-16 bg-red-500 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute top-2 left-2 w-4 h-4 bg-red-300 rounded-full opacity-60"></div>
                                    </div>
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-amber-800 rounded-full"></div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Orange */}
                            <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-14 h-14 bg-orange-400 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute top-1 left-1 w-3 h-3 bg-orange-300 rounded-full opacity-60"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Banana */}
                            <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-12 h-20 bg-yellow-400 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-yellow-300 rounded-full transform scale-90"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Strawberry */}
                            <div className={`transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-12 h-12 bg-red-400 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute top-1 left-1 w-2 h-2 bg-red-300 rounded-full opacity-60"></div>
                                    </div>
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row - More Fruits */}
                        <div className="flex justify-center items-center mb-8">
                            {/* Grapes */}
                            <div className={`transform transition-all duration-1000 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="flex space-x-1">
                                        <div className="w-6 h-6 bg-purple-500 rounded-full shadow-md"></div>
                                        <div className="w-6 h-6 bg-purple-600 rounded-full shadow-md"></div>
                                        <div className="w-6 h-6 bg-purple-500 rounded-full shadow-md"></div>
                                    </div>
                                    <div className="flex space-x-1 mt-1">
                                        <div className="w-6 h-6 bg-purple-600 rounded-full shadow-md"></div>
                                        <div className="w-6 h-6 bg-purple-500 rounded-full shadow-md"></div>
                                        <div className="w-6 h-6 bg-purple-600 rounded-full shadow-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row - Vegetables */}
                        <div className="flex justify-between items-center">
                            {/* Carrot */}
                            <div className={`transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-8 h-16 bg-orange-500 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-orange-400 rounded-full transform scale-90"></div>
                                    </div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Broccoli */}
                            <div className={`transform transition-all duration-1000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-16 h-16 bg-green-500 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-green-400 rounded-full transform scale-80"></div>
                                        <div className="absolute inset-0 bg-green-300 rounded-full transform scale-60"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-green-600 rounded-full"></div>
                                </div>
                            </div>

                            {/* Tomato */}
                            <div className={`transform transition-all duration-1000 delay-1400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-14 h-14 bg-red-500 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute top-1 left-1 w-3 h-3 bg-red-300 rounded-full opacity-60"></div>
                                    </div>
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Bell Pepper */}
                            <div className={`transform transition-all duration-1000 delay-1600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <div className="relative group">
                                    <div className="w-12 h-16 bg-green-400 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300">
                                        <div className="absolute inset-0 bg-green-300 rounded-full transform scale-90"></div>
                                    </div>
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Scattered Small Items */}
                        <div className="absolute top-4 left-4">
                            <div className={`w-4 h-4 bg-yellow-300 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.5s' }}></div>
                        </div>
                        <div className="absolute top-12 right-6">
                            <div className={`w-3 h-3 bg-blue-400 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDelay: '1s' }}></div>
                        </div>
                        <div className="absolute bottom-8 left-6">
                            <div className={`w-5 h-5 bg-purple-400 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDelay: '1.5s' }}></div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <div className={`w-4 h-4 bg-orange-300 rounded-full shadow-md transform hover:scale-110 transition-transform duration-300 ${isLoaded ? 'animate-bounce' : ''}`} style={{ animationDelay: '2s' }}></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Standing Human with Dumbbell */}
                <div className="w-1/2 h-full bg-gradient-to-b from-white via-gray-100 to-gray-300 relative overflow-hidden">
                    {/* Single Standing Silhouette with Dumbbell */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`relative transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {/* Head */}
                            <div className="w-8 h-8 bg-gray-800 rounded-full"></div>

                            {/* Body */}
                            <div className="w-4 h-16 bg-gray-800 absolute top-8 left-1/2 transform -translate-x-1/2"></div>

                            {/* Arms */}
                            <div className="w-3 h-8 bg-gray-800 absolute top-10 -left-2 transform rotate-45"></div>
                            <div className="w-3 h-8 bg-gray-800 absolute top-10 -right-2 transform -rotate-45"></div>

                            {/* Legs */}
                            <div className="w-3 h-12 bg-gray-800 absolute bottom-0 -left-1"></div>
                            <div className="w-3 h-12 bg-gray-800 absolute bottom-0 -right-1"></div>

                            {/* Dumbbell in Right Hand */}
                            <div className="absolute top-8 -right-6 transform rotate-45">
                                <div className="w-10 h-2 bg-gray-600 rounded-full shadow-lg">
                                    <div className="w-4 h-2 bg-gray-700 rounded-full absolute -left-1 shadow-md"></div>
                                    <div className="w-4 h-2 bg-gray-700 rounded-full absolute -right-1 shadow-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Motion Lines */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute top-1/3 left-1/4 w-16 h-1 bg-blue-400 transform rotate-45 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute top-1/2 right-1/4 w-12 h-1 bg-green-400 transform -rotate-45 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute bottom-1/3 left-1/4 w-14 h-1 bg-purple-400 transform rotate-30 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>

                    {/* Energy Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute top-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute bottom-1/4 right-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping transition-all duration-1000 delay-1400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                        <div className={`absolute bottom-1/3 left-1/6 w-2 h-2 bg-orange-400 rounded-full animate-ping transition-all duration-1000 delay-1600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>
                </div>
            </div>

            {/* Center Divider */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-800 z-20 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">Nutrition & Fitness</h3>
                    <p className="text-sm drop-shadow-md">Your complete wellness journey starts here</p>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-10 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute top-20 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-20 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-10 right-1/3 w-3 h-3 bg-orange-400 rounded-full animate-bounce transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
        </div>
    )
}
