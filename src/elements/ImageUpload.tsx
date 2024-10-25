import {LuImagePlus} from 'react-icons/lu';
import {BsX} from "react-icons/bs";

function ImageUpload({name, handler, setSelectedImages, selectedImages, handleRemoveImage, isMultiple}: {
    name?: string,
    handler?: any,
    setSelectedImages?: any,
    selectedImages?: any,
    handleRemoveImage?: any,
    isMultiple?: boolean
}) {

    // @ts-ignore
    const handleImagesChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages(e.target.files);
        }
    };

    return (
        <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center flex-col relative">
            <label htmlFor={`file-upload${name}`} className={`w-full h-full absolute top-0 left-0 cursor-pointer`}></label>
            {Array.from(selectedImages).length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {Array.from(selectedImages).map((image: any, index: number) => (
                        <div key={index} className="relative">
                            <img aria-label="image"  src={URL.createObjectURL(image)} alt="preview" className="w-52 h-52 object-cover"/>
                            <button
                                className="absolute top-1 right-1 bg-white p-0.5 rounded-full"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <BsX className="w-4 h-4 text-red-500"/>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <LuImagePlus className="w-10 h-10 text-primary"/>
            )}
            <p className="mt-4 text-sm text-gray-600">
                <label className="text-primary font-semibold cursor-pointer">
                    Upload files &nbsp;
                    <input
                        type="file"
                        className="hidden"
                        id={`file-upload${name}`}
                        accept="image/*"
                        multiple={isMultiple}
                        onChange={
                            (e) => {
                                handleImagesChange(e);
                                handler(e);
                            }
                        }
                        name={name}/>
                </label>
                or drag and drop
            </p>
        </div>
    );
}

export default ImageUpload;
