const PrimaryButton = ({content, className, events}: { content: any, className: string, events: any }) => {
    return <button
        className={`bg-primary transition duration-300 text-white py-4 px-8 rounded-full hover:bg-primary-900 ${className}`}
        onClick={events}>{content}</button>
}

export default PrimaryButton;