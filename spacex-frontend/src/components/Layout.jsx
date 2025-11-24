export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {" "}
      <nav className="bg-gray-900 p-4 shadow-md">
        {" "}
        <h1 className="text-2xl font-bold">🚀 SpaceX Dashboard</h1>{" "}
      </nav>{" "}
      <main className="p-8">{children}</main>{" "}
    </div>
  );
}
