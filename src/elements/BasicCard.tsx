const BasicCard = ({img, properties, title, description}: {
    img: string,
    properties: string,
    title: string,
    description: string
}) => {
    return (
        <div
            className="flex relative rounded-2xl border border-neutral-100 dark:border-gray-700 dark:bg-[#1f2937] p-8 items-center hover:shadow-lg transition duration-300">
            <span
                className="rounded-full p-1 px-4 text-sm bg-neutral-100 dark:text-gray-900 absolute right-2 top-2">{properties}</span>
            <img aria-label="image"  src={img} alt={title} className="rounded-full w-28 aspect-square"/>
            <div className="text-start ps-6">
                <span className="font-bold block">{title}</span>
                <span className="text-neutral-500 text-sm">{description}</span>
            </div>
        </div>
    );
}

export default BasicCard;