import React from 'react'
import { useForm } from '@mantine/form';
import { validateString } from '../utils/common';
import { Button, Group, NumberInput, TextInput, Textarea } from '@mantine/core';

const BasicDetails = ({propertyDetails, setPropertyDetails, nextStep, prevStep}) => {
    const form = useForm({
        initialValues: {
            title: propertyDetails?.title,
            description: propertyDetails?.description,
            price: propertyDetails?.price,
        },
        validate: {
            title: (value) => validateString(value),
            description: (value) => validateString(value),
            price: (value) => (value < 100 ? "Minimum fiyat 100 TL olmalıdır" : null),
        },
    })
    const {title, description, price} = form.values
    
    const handleSubmit = () => {
        const {hasError} = form.validate()
        if(!hasError) {
            setPropertyDetails((prev) => ({...prev, title, description, price}))
            nextStep()
        }
    }
  return (
    <form 
    onSubmit={(e)=> {
        e.preventDefault()
        handleSubmit()
    }}
    >
        <div className='flexCenter'>
            {/* LEFT SIDE  */}
            <div className='flexCenter flex-1'>
                {/* INPUTS */}
                <div>
                    <TextInput 
                    w={"100%"}
                    withAsterisk
                    label = "Başlık"
                    {...form.getInputProps("title", { type: "input"})}
                    />
                    <Textarea 
                    w={"100%"}
                    withAsterisk
                    label = "Açıklama"
                    {...form.getInputProps("description", { type: "input"})}
                    />
                    <NumberInput 
                    w={"100%"}
                    withAsterisk
                    label = "Fiyat"
                    prefix="₺"
                    min={100}
                    formatter={(value) => 
                        !Number.isNaN(parseFloat(value))
                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                            : ''
                    }
                    {...form.getInputProps("price", { type: "input"})}
                    />
                </div>
            </div>
        </div>
        <Group justify='center' mt={'xl'} >
            <Button variant='default' onClick={prevStep}>Geri</Button>
            <Button type='submit'>Sonraki Adım</Button>
        </Group>
    </form>
  )
}

export default BasicDetails