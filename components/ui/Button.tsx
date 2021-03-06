import { motion } from 'framer-motion'

const Button: React.FC = ({ children }) => {
    return (
        <motion.button
            whileHover={{
                position: 'relative',
                zIndex: 1,
                scale: 1.1,
                transition: {
                    duration: 0.2,
                },
            }}
            whileTap={{ scale: 0.9 }}
            className="focus:outline-none py-2 px-4 bg-primary text-sans text-md text-white font-bold rounded"
        >
            {children}
        </motion.button>
    )
}

export default Button
