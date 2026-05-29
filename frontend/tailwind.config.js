/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'airplane': "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3')",
                'admin': "url('https://images.unsplash.com/photo-1556388158-62ea3f43d8f8?ixlib=rb-4.0.3')",
            }
        },
    },
    plugins: [],
}