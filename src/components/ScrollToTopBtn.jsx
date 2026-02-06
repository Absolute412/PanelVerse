import { useEffect, useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"

const ScrollToTopBtn = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            const limit = window.innerWidth < 640 ? 100 : 300;
            setVisible(y > limit);
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    };

  return (
    <>
        {showTopBtn && (
            <button
                onClick={scrollToTop}
                className={`fixed bottom-24 sm:bottom-20 right-4 z-40 transition-opacity duration-300
                    ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
                    `}
            >
                <div className="
                    flex items-center gap-1 p-2 rounded-full bg-white/70 dark:bg-component-dark 
                    backdrop-blur-2xl shadow-md hover:bg-white dark:hover:bg-component-hover-dark transition"
                >
                    <Icon 
                        icon="mingcute:up-fill" 
                        className="text-gray-600 dark:text-gray-200 text-3xl cursor-pointer hover:text-gray-800 dark:hover:text-white" 
                    />
                </div>
            </button>
        )}
    </>
  )
}

export default ScrollToTopBtn