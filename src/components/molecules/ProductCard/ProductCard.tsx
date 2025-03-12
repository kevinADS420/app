import React from 'react';
import Button from '../../atoms/Button/Button';
import './ProductCard.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  category,
  stock,
  onAddToCart
}) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
        {stock <= 5 && stock > 0 && (
          <span className="stock-badge low">¡Últimas unidades!</span>
        )}
        {stock === 0 && (
          <span className="stock-badge out">Agotado</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <span className="product-category">{category}</span>
        <p className="product-description">{description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="currency">$</span>
            <span className="amount">{price.toFixed(2)}</span>
          </div>
          
          {stock > 0 && (
            <Button
              variant="primary"
              onClick={onAddToCart}
              className="add-to-cart-button"
            >
              Agregar al carrito
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 