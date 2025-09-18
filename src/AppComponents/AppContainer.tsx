"use client"

export function AppContainer({ children, title }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="
            bg-card dark:bg-gray-800 
            shadow-2xl rounded-2xl 
            p-4 sm:p-6 lg:p-8 
            w-full 
            max-w-full 
            md:max-w-4xl lg:max-w-6xl 
            mx-auto 
            transition-shadow hover:shadow-2xl
            mt-12
        ">
            {title && (
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-foreground dark:text-foreground">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
