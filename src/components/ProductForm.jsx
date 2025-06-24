import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Stack, CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert'; 
import Snackbar from '@mui/material/Snackbar'; 

import { createProduct, updateProduct } from '../services/api';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProductForm = ({ productToEdit, onProductSaved }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.nome || '');
      setPrice(productToEdit.preco != null ? String(productToEdit.preco) : '');
    } else {
      setName('');
      setPrice('');
    }
  }, [productToEdit]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim() || !price.trim() || isNaN(parseFloat(price))) {
      showSnackbar('Por favor, preencha nome e preço válidos.', 'warning');
      setIsLoading(false);
      return;
    }

    const productData = { nome: name.trim(), preco: parseFloat(price) };

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
        showSnackbar('Produto atualizado com sucesso!', 'success');
      } else {
        await createProduct(productData);
        showSnackbar('Produto cadastrado com sucesso!', 'success');
      }

      setName('');
      setPrice('');
      onProductSaved();
    } catch (error) {
      console.error('Erro no formulário:', error);
      showSnackbar(`Erro ao salvar produto: ${error.message || 'Verifique a conexão com a API.'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', mb: 4, boxShadow: 2 }}>
      <Typography variant="h5" component="h3" align="center" gutterBottom>
        {productToEdit ? 'Editar Produto Existente' : 'Cadastrar Novo Produto'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nome do Produto"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Camiseta"
            required
          />
          <TextField
            fullWidth
            label="Preço"
            variant="outlined"
            type="number"
            inputProps={{ step: "0.01" }}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 99.90"
            required
          />
          <Button
            type="submit"
            variant="contained" 
            color="primary"
            disabled={isLoading}
            fullWidth
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Salvando...' : (productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto')}
          </Button>
        </Stack>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductForm;