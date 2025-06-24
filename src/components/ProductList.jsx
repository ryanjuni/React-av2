import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Typography, CircularProgress, Paper, Grid
} from '@mui/material';
import MuiAlert from '@mui/material/Alert'; 
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { getProducts, deleteProduct } from '../services/api';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProductList = ({ onEditProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

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

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showSnackbar(`Erro ao carregar produtos: ${error.message || 'Verifique a conexão com a API.'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const confirmDelete = (id) => {
    setProductToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setProductToDeleteId(null);
  };

  const handleDelete = async () => {
    handleCloseConfirmDialog();
    if (productToDeleteId) {
      try {
        await deleteProduct(productToDeleteId);
        showSnackbar('Produto excluído com sucesso!', 'success');
        fetchProducts(); 
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showSnackbar(`Erro ao excluir produto: ${error.message || 'Não foi possível excluir o produto.'}`, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress color="primary" sx={{ mr: 2 }} />
        <Typography variant="h6">Carregando produtos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 2 }}>
      <Typography variant="h5" component="h3" align="center" gutterBottom>
        Lista de Produtos Cadastrados
      </Typography>
      {products.length === 0 ? (
        <Typography textAlign="center" sx={{ py: 2, color: 'text.secondary' }}>Nenhum produto cadastrado ainda.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell align="right">
                    {parseFloat(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell align="center">
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => onEditProduct(product)}
                        >
                          Editar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => confirmDelete(product.id)}
                        >
                          Excluir
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;