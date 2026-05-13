import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
