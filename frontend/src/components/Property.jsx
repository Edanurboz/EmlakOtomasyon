import React, { useState } from 'react';

const Property = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const images = [
        property.image,
        property.image2,
        property.image3,
        property.image4
    ].filter(Boolean);

    return (
        <div className='flexBetween'>
            <h5 className='bold-16 my-1 text-secondary'>{property.city}</h5>
            <h4 className='h4'>₺{formatPrice(property.price)}</h4>
        </div>
    );
};

export default Property; 