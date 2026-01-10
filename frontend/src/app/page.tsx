import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Todo App
        </h1>

        <div className="flex items-center justify-around mt-6">
          <Link href="/login" className="text-2xl font-bold p-4 m-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
            Login
          </Link>
          <Link href="/signup" className="text-2xl font-bold p-4 m-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
