export default function Overview() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 shadow-xl rounded-2xl p-10 max-w-2xl w-full">
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center drop-shadow">
            Welcome to CredChain
          </h1>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-purple-700 dark:text-purple-300">
                What is CredChain?
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg">
                CredChain revolutionizes credit scoring using blockchain technology for transparency, privacy, and security.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-2 text-pink-700 dark:text-pink-300">
                Contact Us
              </h2>
              <div className="space-y-1 text-gray-700 dark:text-gray-200">
                <p>
                  <span className="font-semibold">Email:</span> support@credchain.com
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> +91-XXXXX-XXXXX
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
  