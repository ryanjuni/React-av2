import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material'; 
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [productToEdit, setProductToEdit] = useState(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(0);

  const handleProductSaved = () => {
    setProductToEdit(null);
    setRefreshListTrigger(prev => prev + 1);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}> 
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Gerenciamento de Produtos
      </Typography>

      <ProductForm
        productToEdit={productToEdit}
        onProductSaved={handleProductSaved}
      />

      <ProductList
        onEditProduct={handleEditProduct}
        refreshTrigger={refreshListTrigger}
      />
    </Container>
  );
}

export default App;