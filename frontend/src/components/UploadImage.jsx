import { Button, Group } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineCloudUpload } from 'react-icons/md'

const UploadImage = ({prevStep, nextStep, propertyDetails, setPropertyDetails}) => {
    const [images, setImages] = useState({
        image: propertyDetails.image || '',
        image2: propertyDetails.image2 || '',
        image3: propertyDetails.image3 || '',
        image4: propertyDetails.image4 || ''
    });

    const cloudinaryRef = useRef()
    const widgetRefs = useRef({
        image: null,
        image2: null,
        image3: null,
        image4: null
    });

    const handleNext = () => {
        setPropertyDetails((prev) => ({
            ...prev,
            ...images
        }))
        nextStep()
    }

    const handleImageUpload = (imageKey) => {
        return (err, result) => {
            if(result.event === "success") {
                setImages(prev => ({
                    ...prev,
                    [imageKey]: result.info.secure_url
                }))
            }
        }
    }

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        
        ['image', 'image2', 'image3', 'image4'].forEach(key => {
            widgetRefs.current[key] = cloudinaryRef.current.createUploadWidget({
                cloudName: "duzyjjynx",
                uploadPreset: "EmlakOtomasyon",
                maxFiles: 1
            }, handleImageUpload(key));
        });
    }, []);

    const openUploadWidget = (imageKey) => {
        widgetRefs.current[imageKey]?.open();
    }

    const ImageUploader = ({ imageKey, label }) => (
        <div className='relative group'>
            {!images[imageKey] ? (
                <div 
                    onClick={() => openUploadWidget(imageKey)} 
                    className='flexCenter flex-col w-full h-[200px] border-dashed border-2 border-gray-300 rounded-lg cursor-pointer hover:border-secondary transition-all duration-300 bg-gray-50 hover:bg-gray-100'
                >
                    <MdOutlineCloudUpload size={44} className='text-gray-400 group-hover:text-secondary transition-colors duration-300' />
                    <span className='mt-2 text-gray-500 group-hover:text-secondary transition-colors duration-300'>{label}</span>
                </div>
            ): (
                <div 
                    onClick={() => openUploadWidget(imageKey)} 
                    className='w-full h-[200px] rounded-lg overflow-hidden cursor-pointer group relative'
                >
                    <img 
                        src={images[imageKey]} 
                        alt={`uploaded-${imageKey}`} 
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' 
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center'>
                        <span className='text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>Değiştir</span>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className='mt-8 w-4/5 mx-auto'>
            <div className='grid grid-cols-2 gap-6'>
                <ImageUploader imageKey="image" label="Ana Resim" />
                <ImageUploader imageKey="image2" label="İkinci Resim" />
                <ImageUploader imageKey="image3" label="Üçüncü Resim" />
                <ImageUploader imageKey="image4" label="Dördüncü Resim" />
            </div>
            
            <Group justify='center' mt={'xl'}>
                <Button onClick={prevStep} variant="outline">Geri</Button>
                <Button onClick={handleNext} disabled={!images.image} color="blue">İleri</Button>
            </Group>
        </div>
    )
}

export default UploadImage