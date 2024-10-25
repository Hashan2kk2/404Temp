const SecondaryButton = ({content, className, events}: { content: any, className: string, events: any }) => {
    return <button
        className={`border border-gray-200 transition duration-300 dark:hover:bg-gray-900 hover:bg-gray-100 py-4 px-8 rounded-full ${className}`}
        onClick={events}>{content}</button>
}

export default SecondaryButton;