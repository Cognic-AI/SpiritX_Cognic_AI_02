import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Spirit11 Fantasy Cricket
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Build your dream team, compete with friends, and rise to the top of the leaderboard in the ultimate inter-university fantasy cricket game.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors text-center"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-md border border-white hover:bg-blue-600 transition-colors text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-80 w-full">
              {/* Cricket illustration or image would go here */}
              <div className="absolute inset-0 bg-white bg-opacity-10 rounded-lg p-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">1</span>
                      <span>Create your account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">2</span>
                      <span>Build your team with Rs. 9,000,000 budget</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">3</span>
                      <span>Earn points based on player performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">4</span>
                      <span>Compete on the leaderboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full opacity-20 -ml-24 -mb-24"></div>
    </div>
  );
}