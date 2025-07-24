import { BookOpen, Clock, GraduationCap, Users } from 'lucide-react';
import React from 'react'

const LoadingScreen = ({message="Loading..."}) => {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6E9' }}>
            <div className="text-center max-w-md mx-auto px-6">
                {/* Animated Logo/Icon */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 animate-pulse"
                        style={{ backgroundColor: '#A0C878' }}>
                        <GraduationCap size={40} className="text-white" />
                    </div>

                    {/* Floating Learning Icons */}
                    <div className="absolute -top-2 -left-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <BookOpen size={16} style={{ color: '#A0C878' }} />
                        </div>
                    </div>

                    <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '1s' }}>
                        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <Clock size={16} style={{ color: '#A0C878' }} />
                        </div>
                    </div>

                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '1.5s' }}>
                        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <Users size={16} style={{ color: '#A0C878' }} />
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
                    <p className="text-gray-600">Discovering amazing learning opportunities for you...</p>
                </div>

                {/* Modern Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <div className="h-full rounded-full animate-pulse"
                        style={{
                            background: 'linear-gradient(90deg, #A0C878 0%, #8BB968 50%, #A0C878 100%)',
                            animation: 'loading-bar 2s ease-in-out infinite'
                        }}>
                    </div>
                </div>

                {/* Loading Steps */}
                {/* <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Fetching course catalog</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <span>Personalizing recommendations</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <span>Preparing your dashboard</span>
                    </div>
                </div> */}

                {/* Loading Animation Keyframes */}
                <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
            </div>
        </div>
    );
}

export default LoadingScreen
