import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#FDF8F3" }}>
            <div className="text-8xl mb-6">🐶</div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1a1a2e]" style={{ fontFamily: "var(--font-serif)" }}>
                Page Not Found
            </h1>
            <p className="text-lg text-[#4a5568] mb-8 text-center max-w-md">
                Whoops! Looks like this page ran away. Let's get you back to the main path.
            </p>
            <Link href="/">
                <button
                    className="px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: "#4a9068" }}
                >
                    Return Home
                </button>
            </Link>
        </div>
    );
}
