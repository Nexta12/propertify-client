const Cta = () => {
    return (
      <section className="section-container bg-green-gradient  py-12 md:py-24 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Join <span className="font-semibold">10,000+</span> satisfied users who found their perfect home through our platform. 
            List your property or start searching today - it takes just 30 seconds!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-emerald-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              List Property FREE
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-emerald-700 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
              Browse Properties
            </button>
          </div>
  
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm md:text-base">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No hidden fees
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Verified listings
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              24/7 support
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default Cta