export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 h-screen w-full bg-white overflow-hidden">
        {/* Left Column: Form Content */}
        <div className="flex flex-col lg:col-span-2 justify-center px-8 sm:px-16 lg:px-24 py-12">
            {children}
        </div>
  
        {/* Right Column: Decorative Image */}
        <div className="hidden lg:block lg:col-span-3 relative bg-white">
            <div className="relative h-full w-full overflow-hidden rounded-tl-[10rem]">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                    alt="Students" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
          </div>
        </div>
      </div>
    );
  }