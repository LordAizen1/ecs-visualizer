"use client"

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <div className="max-w-md mx-auto mb-8">
          {/* Placeholder for a cool vector/image */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path fill="currentColor" d="M48.4,-63.3C62.2,-53.5,72.7,-39,78.3,-22.9C83.9,-6.8,84.6,10.9,78.5,26.1C72.4,41.3,59.5,54,45.1,62.8C30.7,71.6,15.3,76.5,-0.8,77.2C-16.9,77.9,-33.8,74.4,-47.8,65.8C-61.8,57.2,-72.9,43.5,-78.5,28.2C-84.1,12.9,-84.2,-4.1,-79.1,-19.6C-74,-35.1,-63.7,-49.1,-50.5,-58.9C-37.3,-68.7,-21.2,-74.3,-4.5,-72.5C12.2,-70.7,24.5,-61.5,35.4,-53.4C46.3,-45.3,57.2,-38.5,66.9,-29.1" transform="translate(100 100)" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-2">Welcome to ECS Visualizer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your tool for understanding and visualizing your AWS ECS infrastructure.
        </p>
        <p className="mt-4">
          Use the sidebar to navigate to the different visualization pages.
        </p>
      </div>
    </div>
  )
}

export default HomePage
