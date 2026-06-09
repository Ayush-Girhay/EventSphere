function LoadingOverlay() {
  return (
    <div className="
      fixed inset-0
      bg-black/60
      flex items-center justify-center
      z-50
    ">
      <div className="
        bg-slate-800
        p-6
        rounded-2xl
      ">
        <div className="
          animate-spin
          h-10 w-10
          border-4
          border-cyan-500
          border-t-transparent
          rounded-full
          mx-auto
        " />

        <p className="mt-4">
          Please wait...
        </p>
      </div>
    </div>
  );
}

export default LoadingOverlay;