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
        
        // Her resim için ayrı widget oluştur
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
        <div className='mb-4'>
            <h3 className='mb-2'>{label}</h3>
            {!images[imageKey] ? (
                <div onClick={() => openUploadWidget(imageKey)} className='flexCenter flex-col w-full h-[15rem] border-dashed border-2 cursor-pointer'>
                    <MdOutlineCloudUpload size={44} color='grey' />
                    <span>Upload Image</span>
                </div>
            ): (
                <div onClick={() => openUploadWidget(imageKey)} className='w-full h-[15rem] rounded-xl overflow-hidden cursor-pointer'>
                    <img src={images[imageKey]} alt={`uploaded-${imageKey}`} className='h-full w-full object-cover' />
                </div>
            )}
        </div>
    )

    return (
        <div className='mt-12 flexCenter flex-col w-3/4 mx-auto'>
            <ImageUploader imageKey="image" label="Ana Resim" />
            <ImageUploader imageKey="image2" label="İkinci Resim" />
            <ImageUploader imageKey="image3" label="Üçüncü Resim" />
            <ImageUploader imageKey="image4" label="Dördüncü Resim" />
            
            <Group justify='center' mt={'xl'}>
                <Button onClick={prevStep}>Go Back</Button>
                <Button onClick={handleNext} disabled={!images.image}>Next</Button>
            </Group>
        </div>
    )
}

export default UploadImage