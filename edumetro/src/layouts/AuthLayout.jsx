const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        {/* Main card */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute "></div>

          {/* Content */}
          <div className="relative ">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
