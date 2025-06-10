export default function BouncingDots() {
    return (
      <div className="flex justify-center items-center w-full h-full gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="sm:w-[3%] w-[5%] aspect-square rounded-full animate-bounce-dot"
            style={{
                animation: "bounce 1s ease-in-out infinite, colorPulse 4s linear infinite",
                animationDelay: `${i * 0.2}s`,
              }}
          ></div>
        ))}
      </div>
    );
  }